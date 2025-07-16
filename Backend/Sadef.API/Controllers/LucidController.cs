using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadef.Infrastructure.DBContext;
using Sadef.Domain.Users;
using System.Security.Claims;
using Microsoft.AspNetCore.Cors;
using Sadef.Application.DTOs.LucidDto;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Sadef.Domain.LeadEntity;
using System.Collections.Generic;
using Azure.Core;

namespace Sadef.API.Controllers
{
    public class LucidController : ApiBaseController
    {
        private readonly SadefDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LucidController(SadefDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        // Helper to generate all 30-min slots for a date
        private List<(DateTime Start, DateTime End)> GenerateTimeSlots(DateTime date)
        {
            var slots = new List<(DateTime, DateTime)>();
            var start = date.Date.AddHours(9); // 9:00 AM
            var end = date.Date.AddHours(17);  // 5:00 PM
            while (start < end)
            {
                var slotEnd = start.AddMinutes(30);
                slots.Add((start, slotEnd));
                start = slotEnd;
            }
            return slots;
        }



        [HttpGet("dynamic-available-timeslots")]
        [EnableCors("AllowAllOrigins")]

        public async Task<IActionResult> GetDynamicAvailableTimeslots([FromQuery] DateTime date)
        {
            // Generate all possible slots for the date
            var allSlots = GenerateTimeSlots(date);

            // Query booked slots for that date
            var bookedSlots = await _dbContext.Timeslots
                .Where(t => t.StartTime.Date == date.Date && t.UserInfoId != null)
                .Select(t => new { t.StartTime, t.EndTime })
                .ToListAsync();

            // Filter out booked slots
            var availableSlots = allSlots
                .Where(slot => !bookedSlots.Any(b => b.StartTime == slot.Start && b.EndTime == slot.End))
                .ToList();

            // Return as a list of objects for clarity
            return Ok(availableSlots.Select(s => new { Start = s.Start, End = s.End }));
        }

        [HttpPost("name")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> GetUserName([FromBody] UserNamePayload payload)
        {
            try
            {
                // Log or inspect the raw payload if needed
                var jsonPayload = JsonSerializer.Serialize(payload);

                // Basic validation
                if (string.IsNullOrWhiteSpace(payload.Name))
                    return BadRequest("Name is required.");

                // Store into UserInfo table
                var newUser = new UserInfo
                {
                    Name = payload.Name,
                    CreatedAt = DateTime.UtcNow
                    // You can add other fields like Phone, Source, etc. if needed
                };

                await _dbContext.UserInfo.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();
                // Generate all possible slots for the date
                DateTime date = DateTime.UtcNow; // Use current date for simplicity
                var allSlots = GenerateTimeSlots(date);

                // Query booked slots for that date
                var bookedSlots = await _dbContext.Timeslots
                    .Where(t => t.StartTime.Date == date.Date && t.UserInfoId != null)
                    .Select(t => new { t.StartTime, t.EndTime })
                    .ToListAsync();

                // Filter out booked slots
                var availableSlots = allSlots
                    .Where(slot => !bookedSlots.Any(b => b.StartTime == slot.Start && b.EndTime == slot.End))
                    .ToList();
                var slots = availableSlots.Select(s => new { Start = s.Start, End = s.End });

                return Ok(new
                {
                    message = "User saved successfully",
                    userId = newUser.Id,
                    name = newUser.Name,
                    slots = slots
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("UserInfo")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> GetUserInfo([FromBody] UserPayload payload)
        {
            try
            {
                // Log or inspect the raw payload if needed
                var jsonPayload = JsonSerializer.Serialize(payload);

                // Basic validation
                //if (string.IsNullOrWhiteSpace(payload.Name))
                //    return BadRequest("Name is required.");
                //if (string.IsNullOrWhiteSpace(payload.Email))
                //    return BadRequest("Email is required.");
                //if (string.IsNullOrWhiteSpace(payload.PhoneNumber))
                //    return BadRequest("Phone number is required.");

                // Store into UserInfo table
                var newUser = new UserInfo
                {
                    Name = payload.Name,
                    Email = payload.Email,
                    PhoneNumber = payload.PhoneNumber,
                    CreatedAt = DateTime.UtcNow
                };

                await _dbContext.UserInfo.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "User saved successfully",
                    userId = newUser.Id,
                    name = newUser.Name,
                    email = newUser.Email,
                    phoneNumber = newUser.PhoneNumber
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("book-slot")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> BookSlot([FromBody] BookSlotRequest request)
        {
            try
            {
                string rawTime = request.Time?.Split(' ')[0];
                string rawDate = request.Date?.Split(' ')[0];

                if (!DateTime.TryParse($"{rawDate} {rawTime}", out DateTime startTime))
                    return BadRequest(new { succeeded = false, message = "Invalid date or time format." });

                //if (startTime < DateTime.UtcNow)
                //    return BadRequest(new { succeeded = false, message = "You cannot book a time slot in the past." });

                DateTime endTime = startTime.AddMinutes(30);

                if (!int.TryParse(request.UserId, out int userId))
                    return BadRequest(new { succeeded = false, message = "Invalid UserId format." });

                var user = await _dbContext.UserInfo.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                    return NotFound(new { succeeded = false, message = "User not found." });

                var slotAlreadyBooked = await _dbContext.Timeslots.AnyAsync(t =>
                    t.StartTime == startTime &&
                    t.EndTime == endTime &&
                    t.UserInfoId != null);

                if (slotAlreadyBooked)
                    return Ok(new { succeeded = false, message = "Slot is already booked" });

                string appointmentNumber = $"APT-{DateTime.UtcNow:yyyyMMddHHmmssfff}";

                var newSlot = new Timeslot
                {
                    StartTime = startTime,
                    EndTime = endTime,
                    Description = $"{startTime:hh\\:mm tt} - {endTime:hh\\:mm tt}",
                    UserInfoId = user.Id,
                    AppointmentNumber = appointmentNumber
                };

                await _dbContext.Timeslots.AddAsync(newSlot);
                await _dbContext.SaveChangesAsync();

                var response = new UserWithSlotsResponse
                {
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    BookedSlots = new List<TimeslotDto>
            {
                new TimeslotDto
                {
                    StartTime = newSlot.StartTime,
                    EndTime = newSlot.EndTime,
                    Description = newSlot.Description,
                    AppointmentNumber = newSlot.AppointmentNumber
                }
            }
                };

                return Ok(new { succeeded = true, message = "Slot booked successfully", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = $"An error occurred: {ex.Message}" });
            }
        }


        //public async Task<IActionResult> BookSlot([FromBody] BookSlotRequest request)
        //{
        //    try
        //    {
        //        // Clean the string: keep only before the first space
        //        string rawTime = request.StartTime;
        //        if (rawTime.Contains(' '))
        //        {
        //            rawTime = rawTime.Split(' ')[0];
        //        }

        //        // If you expect only a time (e.g., "15:00:00"), combine with today's date:
        //        if (TimeSpan.TryParse(rawTime, out TimeSpan time))
        //        {
        //            DateTime today = DateTime.Today;
        //            DateTime startTime = today.Add(time);

        //            // Find user by Name (assuming unique)
        //            var user = await _dbContext.UserInfo.FirstOrDefaultAsync(u => u.Id == request.UserId);
        //            if (user == null)
        //                return NotFound("User not found.");

        //            var endTime = startTime.AddMinutes(30); // Auto-calculate EndTime

        //            // Check if the slot is already booked
        //            var slotAlreadyBooked = await _dbContext.Timeslots.AnyAsync(t =>
        //                t.StartTime == startTime &&
        //                t.EndTime == endTime &&
        //                t.UserInfoId != null);

        //            if (slotAlreadyBooked)
        //                return Ok(new { succeeded = false, message = "Slot is already booked" });

        //            // Generate appointment number
        //            string appointmentNumber = $"APT-{DateTime.UtcNow:yyyyMMddHHmmssfff}";

        //            // Save the booking
        //            var newSlot = new Timeslot
        //            {
        //                StartTime = startTime,
        //                EndTime = endTime,
        //                Description = $"{startTime:hh\\:mm tt} - {endTime:hh\\:mm tt}",
        //                UserInfoId = user.Id,
        //                AppointmentNumber = appointmentNumber
        //            };

        //            await _dbContext.Timeslots.AddAsync(newSlot);
        //            await _dbContext.SaveChangesAsync();

        //            return Ok(new
        //            {
        //                message = "Slot booked successfully",
        //                slot = new
        //                {
        //                    startTime = newSlot.StartTime.ToString("yyyy-MM-dd HH:mm:ss"),
        //                    endTime = newSlot.EndTime.ToString("yyyy-MM-dd HH:mm:ss"),
        //                    newSlot.Description,
        //                    newSlot.UserInfoId,
        //                    newSlot.AppointmentNumber
        //                }
        //            });
        //        }
        //        else if (DateTime.TryParse(rawTime, out DateTime startTime))
        //        {
        //            // If it's a full date+time string, use as is
        //            // Find user by Name (assuming unique)
        //            var user = await _dbContext.UserInfo.FirstOrDefaultAsync(u => u.Name == request.Name);
        //            if (user == null)
        //                return NotFound("User not found.");

        //            var endTime = startTime.AddMinutes(30); // Auto-calculate EndTime

        //            // Check if the slot is already booked
        //            var slotAlreadyBooked = await _dbContext.Timeslots.AnyAsync(t =>
        //                t.StartTime == startTime &&
        //                t.EndTime == endTime &&
        //                t.UserInfoId != null);

        //            if (slotAlreadyBooked)
        //                return Ok(new { succeeded = false, message = "Slot is already booked" });

        //            // Generate appointment number
        //            string appointmentNumber = $"APT-{DateTime.UtcNow:yyyyMMddHHmmssfff}";

        //            // Save the booking
        //            var newSlot = new Timeslot
        //            {
        //                StartTime = startTime,
        //                EndTime = endTime,
        //                Description = $"{startTime:hh\\:mm tt} - {endTime:hh\\:mm tt}",
        //                UserInfoId = user.Id,
        //                AppointmentNumber = appointmentNumber
        //            };

        //            await _dbContext.Timeslots.AddAsync(newSlot);
        //            await _dbContext.SaveChangesAsync();

        //            return Ok(new
        //            {
        //                message = "Slot booked successfully",
        //                slot = new
        //                {
        //                    newSlot.StartTime,
        //                    newSlot.EndTime,
        //                    newSlot.Description,
        //                    newSlot.UserInfoId,
        //                    newSlot.AppointmentNumber
        //                }
        //            });
        //        }
        //        else
        //        {
        //            return BadRequest("Invalid StartTime format.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"An error occurred: {ex.Message}");
        //    }
        //}

        //public async Task<IActionResult> BookSlot([FromBody] BookSlotRequest request)
        //{
        //    try
        //    {
        //        // Prevent booking in the past
        //        if (request.StartTime < DateTime.UtcNow)
        //        {
        //            return BadRequest("You cannot book a time slot in the past.");
        //        }

        //        // Validate user
        //        var user = await _dbContext.UserInfo.FindAsync(request.Name);
        //        if (user == null)
        //            return NotFound("User not found.");

        //        //  Check if slot is already booked
        //        var slotAlreadyBooked = await _dbContext.Timeslots.AnyAsync(t =>
        //            t.StartTime == request.StartTime &&
        //            t.EndTime == request.EndTime &&
        //            t.UserInfoId != null);

        //        if (slotAlreadyBooked)
        //            return Conflict("This slot is already booked.");
        //        string GenerateAppointmentNumber()
        //            {
        //                return $"APT-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
        //            }
        //        //  Save the booking
        //        var newSlot = new Timeslot
        //                {
        //            StartTime = request.StartTime,
        //            EndTime = request.EndTime,
        //            Description = $"{request.StartTime:hh\\:mm tt} - {request.EndTime:hh\\:mm tt}",
        //            UserInfoId = request.UserId,
        //            AppointmentNumber = GenerateAppointmentNumber()
        //        };

        //        await _dbContext.Timeslots.AddAsync(newSlot);
        //        await _dbContext.SaveChangesAsync();

        //        return Ok(new
        //        {
        //            message = "Slot booked successfully",
        //            slot = new
        //            {
        //                newSlot.StartTime,
        //                newSlot.EndTime,
        //                newSlot.Description,
        //                newSlot.UserInfoId,
        //                newSlot.AppointmentNumber
        //            }
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"An error occurred: {ex.Message}");
        //    }
        //}
        [HttpGet("user-details-with-slots")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> GetUserWithSlotsByPhone([FromQuery] string UserId)
        {
            if (!int.TryParse(UserId, out int userId))
            {
                return BadRequest(new { succeeded = false, message = "Invalid UserId format." });
            }
            var user = await _dbContext.UserInfo.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found.");

            // Get booked slots
            var bookedSlots = await _dbContext.Timeslots
                .Where(t => t.UserInfoId == user.Id)
                .Select(t => new TimeslotDto
                {
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Description = t.Description,
                    AppointmentNumber = t.AppointmentNumber,

                })
                .ToListAsync();

            // Prepare response
            var response = new UserWithSlotsResponse
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                BookedSlots = bookedSlots
            };

            return Ok(response);
        }


        [HttpGet("timeslots-status-by-date")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> GetTimeslotsStatusByDate([FromQuery] DateTime date)
        {
            // Step 1: Generate all 30-min slots for that date
            var allSlots = GenerateTimeSlots(date);

            // Step 2: Load booked timeslots from DB for that date
            var booked = await _dbContext.Timeslots
                .Where(t => t.StartTime.Date == date.Date && t.UserInfoId != null)
                .ToListAsync();

            // Step 3: Get user names (for bookedBy field)
            var userMap = await _dbContext.UserInfo
                .ToDictionaryAsync(u => u.Id, u => u.Name);

            // Step 4: Merge data
            var result = allSlots.Select(slot =>
            {
                var match = booked.FirstOrDefault(b => b.StartTime == slot.Start && b.EndTime == slot.End);

                return new
                {
                    startTime = slot.Start,
                    endTime = slot.End,
                    description = $"{slot.Start:hh\\:mm tt} - {slot.End:hh\\:mm tt}",
                    isBooked = match != null,
                    bookedBy = match?.UserInfoId != null && userMap.ContainsKey(match.UserInfoId.Value)
                               ? userMap[match.UserInfoId.Value]
                               : null,
                    phoneNumber = match?.UserInfo?.PhoneNumber, // Include phone number if available
                };
            });

            return Ok(result);
        }

        [HttpGet("timeslots-status-by-range")]
        [EnableCors("AllowAllOrigins")]

        public async Task<IActionResult> GetTimeslotsStatusByRange(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            // ✅ Apply default values if not provided
            var start = startDate ?? new DateTime(2025, 7, 16);
            var end = endDate ?? new DateTime(2025, 7, 23);

            // Step 1: Generate all slots for each day in the range
            var allSlots = new List<(DateTime Start, DateTime End)>();
            for (var date = start.Date; date <= end.Date; date = date.AddDays(1))
            {
                allSlots.AddRange(GenerateTimeSlots(date));
            }

            // Step 2: Load all booked timeslots in range
            var booked = await _dbContext.Timeslots
                .Where(t => t.StartTime.Date >= start.Date && t.StartTime.Date <= end.Date && t.UserInfoId != null)
                .ToListAsync();

            // Step 3: Get user names
            var userMap = await _dbContext.UserInfo
                .ToDictionaryAsync(u => u.Id, u => u.Name);

            // Step 4: Build response
            var result = allSlots.Select(slot =>
            {
                var match = booked.FirstOrDefault(b => b.StartTime == slot.Start && b.EndTime == slot.End);

                return new
                {
                    startTime = slot.Start,
                    endTime = slot.End,
                    description = $"{slot.Start:hh\\:mm tt} - {slot.End:hh\\:mm tt}",
                    isBooked = match != null,
                    bookedBy = match?.UserInfoId != null && userMap.ContainsKey(match.UserInfoId.Value)
                               ? userMap[match.UserInfoId.Value]
                               : null
                };
            });

            return Ok(result);
        }

    }

}
