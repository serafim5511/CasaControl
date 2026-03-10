using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.EntidadesNoMap
{
    [NotMapped]
    public class TotaisPorCategoriaDTO
    {
        public int CategoriaId { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }
}
