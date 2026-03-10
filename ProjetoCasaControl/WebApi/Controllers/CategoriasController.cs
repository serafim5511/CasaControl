using Domain.Interfaces;
using Entities.Entidades;
using Infra.Config;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly CasaControlContext _context;

        public CategoriasController(ICategoriaRepository categoriaRepository, CasaControlContext context)
        {
            _categoriaRepository = categoriaRepository;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categorias = await _categoriaRepository.GetAllAsync();
            return Ok(categorias);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null) return NotFound();
            return Ok(categoria);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Categoria categoria)
        {
            await _categoriaRepository.AddAsync(categoria);
            return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Categoria categoria)
        {
            if (id != categoria.Id) return BadRequest("Id divergente.");
            await _categoriaRepository.UpdateAsync(categoria);
            return Ok(categoria);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null) return NotFound();

            var hasTransacoes = await _context.Transacoes.AnyAsync(t => t.CategoriaId == id);
            if (hasTransacoes)
            {
                return BadRequest("Categoria possui transações e não pode ser removida.");
            }

            await _categoriaRepository.DeleteAsync(categoria);
            return NoContent();
        }
    }
}
