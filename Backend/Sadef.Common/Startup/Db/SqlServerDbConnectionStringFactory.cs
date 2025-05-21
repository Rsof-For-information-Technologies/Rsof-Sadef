using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Sadef.Common.Infrastructure.EfCore.Db;

namespace Sadef.Common.RestTemplate.Db
{
    public sealed class SqlServerDbConnStringFactory : IDbConnStringFactory
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;

        public SqlServerDbConnStringFactory(
            IConfiguration config,
            IWebHostEnvironment env)
        {
            _config = config;
            _env = env;
        }

        public string Create()
        {
            if (_env.IsDevelopment()) return _config.GetConnectionString("mssqldb");

            return string.Format(
                _config.GetConnectionString("mssqldb"),
                _config.GetValue<string>("k8s:mssqldb:Host"),
                _config.GetValue<string>("k8s:mssqldb:Port"),
                _config.GetValue<string>("k8s:mssqldb:Database"),
                _config.GetValue<string>("k8s:mssqldb:UserName"),
                _config.GetValue<string>("k8s:mssqldb:Password"));
        }
    }
}
