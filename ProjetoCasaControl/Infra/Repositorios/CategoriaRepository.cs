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
    public class CategoriaRepository : Repository<Categoria>, ICategoriaRepository
    {
        public CategoriaRepository(CasaControlContext context) : base(context)
        {
        }

        public async Task<List<TotaisPorCategoriaDTO>> GetTotaisPorCategoriaAsync()
        {
            return await _context.Categorias
                .Select(c => new TotaisPorCategoriaDTO
                {
                    CategoriaId = c.Id,
                    Descricao = c.Descricao,
                    TotalReceitas = c.Transacoes
                        .Where(t => t.Tipo == TipoTransacao.Receita)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    TotalDespesas = c.Transacoes
                        .Where(t => t.Tipo == TipoTransacao.Despesa)
                        .Sum(t => (decimal?)t.Valor) ?? 0
                })
                .ToListAsync();
        }
    }
}

