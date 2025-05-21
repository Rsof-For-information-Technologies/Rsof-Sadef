using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.UserDtos;
namespace Sadef.API.Controllers
{

    public class UserController : ApiBaseController
    {
        private readonly IUserManagementService _userManagementService;

        public UserController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        // User Registration
        [HttpPost("register")]
        public async Task<IActionResult> CreateUser(RegisterUserWithEmailDto request)
        {
            var response = await _userManagementService.CreateUserAsync(request);
            return Ok(response);
        }


        // User Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto request)
        {
            var response = await _userManagementService.LoginUserAsync(request);
            return Ok(response);

        }

        [Authorize]
        // Update User Password
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword(UpdateUserPasswordDto request)
        {
            var response = await _userManagementService.UpdatePasswordAsync(request);
            return Ok(response);

        }


        // Refresh Token
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenDto request)
        {
            var response = await _userManagementService.RefreshTokenAsync(request);
            return Ok(response);

        }

        // Get All Users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var response = await _userManagementService.GetUsersListAsync();
            return Ok(response);
        }

        // Get User by ID
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var response = await _userManagementService.GetUserByIdAsync(id);
            return Ok(response);
        }

        // Update User Details
        [HttpPut("update-user")]
        public async Task<IActionResult> UpdateUser(UpdateUserDto request)
        {
            var response = await _userManagementService.UpdateUserAsync(request);
            return Ok(response);
        }

        // Toggle User
        [HttpPatch]
        public async Task<ActionResult> ToggleStatus(Guid id)
        {
            var response = await _userManagementService.ToggleUserStatusAsync(id);
            return Ok(response);

        }

        // Forgot password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> RecoverPassword(ForgotPasswordDto request)
        {
            var response = await _userManagementService.ForgotPasswordAsync(request);
            return Ok(response);

        }

        //Reset Password with Token
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto request)
        {
            var response = await _userManagementService.ResetPasswordAsync(request);
            return Ok(response);

        }
    }
}
