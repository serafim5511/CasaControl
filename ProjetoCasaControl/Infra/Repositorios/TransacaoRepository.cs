using Domain.Interfaces;
using Entities.Entidades;
using Infra.Config;
using Infra.Repositorios.Genericos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infra.Repositorios
{
    public class TransacaoRepository : Repository<Transacao>, ITransacaoRepository
    {
        public TransacaoRepository(CasaControlContext context) : base(context)
        {
        }

        public async Task<List<Transacao>> GetAllWithIncludesAsync()
        {
            return await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .ToListAsync();
        }
    }
}

