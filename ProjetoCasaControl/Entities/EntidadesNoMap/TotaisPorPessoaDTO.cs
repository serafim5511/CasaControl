using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.EntidadesNoMap
{
    [NotMapped]
    public class TotaisPorPessoaDTO
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }
}
