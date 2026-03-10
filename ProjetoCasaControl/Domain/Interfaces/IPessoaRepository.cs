using Entities.Entidades;
using Entities.EntidadesNoMap;

namespace Domain.Interfaces
{
    public interface IPessoaRepository : IRepository<Pessoa>
    {
        Task<List<TotaisPorPessoaDTO>> GetTotaisPorPessoaAsync();
    }
}

