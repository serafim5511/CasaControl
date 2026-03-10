using Entities.Entidades;
using System.Collections.Generic;

namespace Domain.Interfaces
{
    public interface ITransacaoRepository : IRepository<Transacao>
    {
        Task<List<Transacao>> GetAllWithIncludesAsync();
    }
}

