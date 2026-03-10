using Entities.Entidades;
using Entities.EntidadesNoMap;

namespace Domain.Interfaces
{
    public interface ICategoriaRepository : IRepository<Categoria>
    {
        Task<List<TotaisPorCategoriaDTO>> GetTotaisPorCategoriaAsync();
    }
}

