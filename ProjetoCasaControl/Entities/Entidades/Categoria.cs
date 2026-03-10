using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Entidades
{
    public enum FinalidadeCategoria
    {
        Despesa = 1,
        Receita = 2,
        Ambas = 3
    }

    [Table("Categoria")]
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(400)]
        public string Descricao { get; set; }

        public FinalidadeCategoria Finalidade { get; set; }

        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}

