using Domain.Interfaces;
using Entities.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IPessoaRepository _pessoaRepository;
        private readonly ICategoriaRepository _categoriaRepository;

        public TransacoesController(
            ITransacaoRepository transacaoRepository,
            IPessoaRepository pessoaRepository,
            ICategoriaRepository categoriaRepository)
        {
            _transacaoRepository = transacaoRepository;
            _pessoaRepository = pessoaRepository;
            _categoriaRepository = categoriaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transacoes = await _transacaoRepository.GetAllWithIncludesAsync();

            return Ok(transacoes);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Transacao transacao)
        {
            var pessoa = await _pessoaRepository.GetByIdAsync(transacao.PessoaId);
            if (pessoa == null) return BadRequest("Pessoa inválida.");

            var categoria = await _categoriaRepository.GetByIdAsync(transacao.CategoriaId);
            if (categoria == null) return BadRequest("Categoria inválida.");

            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Menores de 18 anos só podem ter transações do tipo despesa.");
            }

            if (transacao.Tipo == TipoTransacao.Despesa &&
                categoria.Finalidade == FinalidadeCategoria.Receita)
            {
                return BadRequest("Categoria de receita não pode ser usada em despesa.");
            }

            if (transacao.Tipo == TipoTransacao.Receita &&
                categoria.Finalidade == FinalidadeCategoria.Despesa)
            {
                return BadRequest("Categoria de despesa não pode ser usada em receita.");
            }

            await _transacaoRepository.AddAsync(transacao);
            return Ok(transacao);
        }
    }
}

