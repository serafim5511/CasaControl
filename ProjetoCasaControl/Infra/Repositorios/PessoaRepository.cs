using Domain.Interfaces;
using Entities.Entidades;
using Entities.EntidadesNoMap;
using Infra.Config;
using Infra.Repositorios.Genericos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infra.Repositorios
{
    public class PessoaRepository : Repository<Pessoa>, IPessoaRepository
    {
        public PessoaRepository(CasaControlContext context) : base(context)
        {
        }

        public async Task<List<TotaisPorPessoaDTO>> GetTotaisPorPessoaAsync()
        {
            return await _context.Pessoas
                .Select(p => new TotaisPorPessoaDTO
                {
                    PessoaId = p.Id,
                    Nome = p.Nome,
                    TotalReceitas = p.Transacoes
                        .Where(t => t.Tipo == TipoTransacao.Receita)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    TotalDespesas = p.Transacoes
                        .Where(t => t.Tipo == TipoTransacao.Despesa)
                        .Sum(t => (decimal?)t.Valor) ?? 0
                })
                .ToListAsync();
        }
    }
}

