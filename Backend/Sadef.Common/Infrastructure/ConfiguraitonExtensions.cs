using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Sadef.Common.Domain;
using Sadef.Common.Utils.Extensions;

namespace Sadef.Common.Infrastructure
{
    public static class ConfigurationExtensions
    {
        public static IEnumerable<Assembly> LoadFullAssemblies(this IConfiguration config)
        {
            if (string.IsNullOrEmpty(config.GetValue<string>("QualifiedAssemblyPattern")))
                throw new DomainException(
                    "Add QualifiedAssemblyPattern key in appsettings.json for automatically loading assembly.");

            return config.GetValue<string>("QualifiedAssemblyPattern").LoadFullAssemblies();
        }

        public static IEnumerable<Assembly> LoadApplicationAssemblies(this IConfiguration config)
        {
            if (string.IsNullOrEmpty(config.GetValue<string>("QualifiedAssemblyPattern")))
                throw new DomainException(
                    "Add QualifiedAssemblyPattern key in appsettings.json for automatically loading assembly.");

            var apps = config.GetValue<string>("QualifiedAssemblyPattern").LoadAssemblyWithPattern();
            if (apps == null || !apps.Any())
                throw new CoreException("Should have at least one application assembly to load.");

            return apps;
        }
    }

    public static class ConfigurationHelper
    {
        public static IConfigurationRoot GetConfiguration(string basePath = null)
        {
            basePath = basePath ?? Directory.GetCurrentDirectory();
            var builder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{ Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", true)
                .AddEnvironmentVariables();

            return builder.Build();
        }
    }
}
