using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Entidades
{
    [Table("Pessoa")]
    public class Pessoa : Base
    {
        public int Idade { get; set; }

        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}

