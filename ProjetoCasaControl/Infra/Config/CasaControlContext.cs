using Entities.Entidades;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Infra.Config
{
    public class CasaControlContext : DbContext
    {
        public CasaControlContext(DbContextOptions<CasaControlContext> options) : base(options) { }
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transacao>()
                .Property(t => t.Tipo)
                .HasConversion<string>();

            modelBuilder.Entity<Categoria>()
                .Property(c => c.Finalidade)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }
        // add esse comando para criar as migratiosn 'dotnet ef migrations add ComecoSistema --context CasaControlContext'
        // add esse comando para subir as migrations 'dotnet ef database update --context CasaControlContext'


    }
}
