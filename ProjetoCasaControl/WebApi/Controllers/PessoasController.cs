using Domain.Interfaces;
using Entities.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaRepository _pessoaRepository;

        public PessoasController(IPessoaRepository pessoaRepository)
        {
            _pessoaRepository = pessoaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pessoas = await _pessoaRepository.GetAllAsync();
            return Ok(pessoas);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pessoa = await _pessoaRepository.GetByIdAsync(id);
            if (pessoa == null) return NotFound();
            return Ok(pessoa);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pessoa pessoa)
        {
            await _pessoaRepository.AddAsync(pessoa);
            return CreatedAtAction(nameof(GetById), new { id = pessoa.Id }, pessoa);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Pessoa pessoa)
        {
            if (id != pessoa.Id) return BadRequest("Id divergente.");
            await _pessoaRepository.UpdateAsync(pessoa);
            return Ok(pessoa);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pessoa = await _pessoaRepository.GetByIdAsync(id);
            if (pessoa == null) return NotFound();

            await _pessoaRepository.DeleteAsync(pessoa);
            return NoContent();
        }
    }
}

