using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadef.Infrastructure.DBContext;
using Sadef.Domain.Users;
using System.Security.Claims;

namespace Sadef.API.Controllers
{
    public class LucidController: ApiBaseController
    {
        private readonly SadefDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LucidController(SadefDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("available-timeslots")]
        public async Task<IActionResult> GetAvailableTimeslotsForCurrentUser()
        {
            // Try to get UserInfoId from claims
            //var userInfoIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("UserInfoId")?.Value;
            //if (string.IsNullOrEmpty(userInfoIdClaim) || !int.TryParse(userInfoIdClaim, out int userInfoId))
            //{
            //    return Unauthorized("UserInfoId claim not found or invalid.");
            //}

            // Get all timeslots that are either unassigned or assigned to this user
            var timeslots = await _dbContext.Timeslots
                .Where(t => t.UserInfoId == null)
                .OrderBy(t => t.StartTime)
                .ToListAsync();

            return Ok(timeslots);
        }
    }
}
