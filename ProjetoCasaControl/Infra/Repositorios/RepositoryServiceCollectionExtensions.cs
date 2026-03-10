using Domain.Interfaces;
using Infra.Repositorios.Genericos;
using Microsoft.Extensions.DependencyInjection;

namespace Infra.Repositorios
{
    public static class RepositoryServiceCollectionExtensions
    {
        public static IServiceCollection AddEfRepositories(this IServiceCollection services)
        {
            services.AddScoped<IPessoaRepository, PessoaRepository>();
            services.AddScoped<ICategoriaRepository, CategoriaRepository>();
            services.AddScoped<ITransacaoRepository, TransacaoRepository>();

            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            return services;
        }
    }
}
