using Entities.Entidades;

namespace Domain.Interfaces
{
    public interface ITransacaoRepository : IRepository<Transacao>
    {
        Task<List<Transacao>> GetAllWithIncludesAsync();
    }
}

