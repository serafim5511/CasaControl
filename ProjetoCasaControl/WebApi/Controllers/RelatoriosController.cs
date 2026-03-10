using Domain.Interfaces;
using Entities.EntidadesNoMap;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly IPessoaRepository _pessoaRepository;
        private readonly ICategoriaRepository _categoriaRepository;

        public RelatoriosController(IPessoaRepository pessoaRepository, ICategoriaRepository categoriaRepository)
        {
            _pessoaRepository = pessoaRepository;
            _categoriaRepository = categoriaRepository;
        }

        [HttpGet("totais-por-pessoa")]
        public async Task<IActionResult> TotaisPorPessoa()
        {
            var lista = await _pessoaRepository.GetTotaisPorPessoaAsync();

            var totalGeral = new
            {
                TotalReceitas = lista.Sum(x => x.TotalReceitas),
                TotalDespesas = lista.Sum(x => x.TotalDespesas),
                SaldoLiquido = lista.Sum(x => x.Saldo)
            };

            return Ok(new
            {
                Pessoas = lista,
                TotalGeral = totalGeral
            });
        }

        [HttpGet("totais-por-categoria")]
        public async Task<IActionResult> TotaisPorCategoria()
        {
            var lista = await _categoriaRepository.GetTotaisPorCategoriaAsync();

            var totalGeral = new
            {
                TotalReceitas = lista.Sum(x => x.TotalReceitas),
                TotalDespesas = lista.Sum(x => x.TotalDespesas),
                SaldoLiquido = lista.Sum(x => x.Saldo)
            };

            return Ok(new
            {
                Categorias = lista,
                TotalGeral = totalGeral
            });
        }
    }
}

