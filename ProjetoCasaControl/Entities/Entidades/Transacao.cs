using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Entities.Entidades
{
    public enum TipoTransacao
    {
        Despesa = 1,
        Receita = 2
    }

    [Table("Transacao")]
    public class Transacao
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(400)]
        public string Descricao { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; }

        public TipoTransacao Tipo { get; set; }

        public int CategoriaId { get; set; }

        [JsonIgnore]
        public virtual Categoria? Categoria { get; set; }

        public int PessoaId { get; set; }

        [JsonIgnore]
        public virtual Pessoa? Pessoa { get; set; }
    }
}

