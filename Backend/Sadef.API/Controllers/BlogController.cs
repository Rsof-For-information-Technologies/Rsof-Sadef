using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.BlogDtos;

namespace Sadef.API.Controllers
{
    public class BlogController : ApiBaseController
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _blogService.GetPaginatedAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _blogService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateBlogDto dto)
        {
            var result = await _blogService.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromForm] UpdateBlogDto dto)
        {
            var result = await _blogService.UpdateAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _blogService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
