using Autofac;
using Rhetos;
using Rhetos.Logging;
using Rhetos.Security;
using Rhetos.Utilities;

namespace Repository.Test
{
    public static class TestScope
    {
        public static IUnitOfWorkScope Create(Action<ContainerBuilder> registerCustomComponents = null)
        {
            return _rhetosHost.Value.CreateScope(registerCustomComponents);
        }
        private const string RhetosAppPath = @"..\..\..\..\Repository.Server\bin\Debug\net6.0\Repository.Server.dll";

        private static readonly Lazy<RhetosHost> _rhetosHost = new(() => RhetosHost.CreateFrom(RhetosAppPath, ConfigureRhetosHostBuilder));

        private static void ConfigureRhetosHostBuilder(IRhetosHostBuilder rhetosHostBuilder)
        {
            rhetosHostBuilder.ConfigureContainer(builder =>
            {
                builder.RegisterType<ProcessUserInfo>().As<IUserInfo>();
                builder.RegisterType<ConsoleLogProvider>().As<ILogProvider>();
            });
        }
    }
}
