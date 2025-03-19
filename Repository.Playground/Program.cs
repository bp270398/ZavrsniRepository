using Autofac;
using ConsoleDump;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Rhetos;
using Rhetos.Logging;
using Rhetos.Security;
using Rhetos.Utilities;

namespace Repository.Playground
{
    static class Program
    {
        // Comment out CommitAndClose calls for transaction rollback

        public const string adminUserPassword = "test";

        static void Main(string[] args)
        {

            List<Common.Principal> Principals = new List<Common.Principal>();

            ConsoleLogger.MinLevel = EventType.Info; // Use EventType.Trace for more detailed log.
            string rhetosHostAssemblyPath = Path.GetFullPath(@"..\..\..\..\Repository.Server\bin\Debug\net6.0\Repository.Server.dll");
            var rhetosHost = RhetosHost.CreateFrom(rhetosHostAssemblyPath, RhetosHostBuilderConfiguration);
            var hostServices = RhetosHost.GetHostServices(rhetosHostAssemblyPath, rhetosHostBuilder => rhetosHostBuilder.ConfigureContainer(builder =>
                builder.RegisterType<ConsoleLogProvider>().As<ILogProvider>().SingleInstance()), (hostBuilderContext, serviceCollection) =>
                {
                    serviceCollection.AddScoped<IUserInfo, ProcessUserInfo>();
                    serviceCollection.AddHttpContextAccessor();
                });

            #region Repository
            using (var scope = rhetosHost.CreateScope())
            {
                var context = scope.Resolve<Common.ExecutionContext>();
                var repository = context.Repository;
                var sqlExecuter = context.SqlExecuter;

                // ...
                Principals = repository.Common.Principal.Query().ToSimple().ToList();


                // scope.CommitAndClose();
            }
            #endregion

            #region Services
            using (var scope = hostServices.CreateScope())
            {
                var authService = scope.ServiceProvider.GetService<Rhetos.AspNetFormsAuth.AuthenticationService>();
                if (authService == null)
                    throw new UserException($"The AspNetFormsAuth package is not configured properly. Call the {nameof(AspNetFormsAuthCollectionExtensions.AddAspNetFormsAuth)} method on the {nameof(IServiceCollection)} inside the Startup.ConfigureServices method.");

                var logger = scope.ServiceProvider.GetService<ILogProvider>();
                var userManager = scope.ServiceProvider.GetService<UserManager<IdentityUser<Guid>>>();


                foreach (var principal in Principals.Skip(Principals.Count / 2))
                {
                    SetUpPrincipalPassword(scope.ServiceProvider, principal.Name, adminUserPassword);

                }

                // ...

                scope.ServiceProvider.GetService<IRhetosComponent<IUnitOfWork>>().Value.CommitAndClose();

            }
            #endregion

            void SetUpPrincipalPassword(IServiceProvider serviceProvider, string username, string password)
            {
                var userManager = serviceProvider.GetService<UserManager<IdentityUser<Guid>>>();
                if (userManager == null)
                    throw new UserException($"The AspNetFormsAuth package is not configured properly. Call the {nameof(AspNetFormsAuthCollectionExtensions.AddAspNetFormsAuth)} method on the {nameof(IServiceCollection)} inside the Startup.ConfigureServices method.");

                var sqlExecuter = serviceProvider.GetService<IRhetosComponent<ISqlExecuter>>();

                var principalCount = 0;
                sqlExecuter.Value.ExecuteReaderInterpolated($"SELECT COUNT(*) FROM Common.Principal WHERE Name = {username}",
                    reader => principalCount = reader.GetInt32(0));

                if (principalCount == 0)
                    throw new UserException($"Missing '{username}' user entry in Common.Principal entity. Please insert the principal before calling this method.");

                var user = userManager.FindByNameAsync(username).Result;

                var token = userManager.GeneratePasswordResetTokenAsync(user).Result;
                var changedPasswordResults = userManager.ResetPasswordAsync(user, token, password).Result;

                if (!changedPasswordResults.Succeeded)
                    throw new UserException($"Cannot change password. ResetPassword failed with errors: {string.Join(Environment.NewLine, changedPasswordResults.Errors.Select(x => x.Description))}.");
                else
                    serviceProvider.GetService<ILogProvider>().Dump($"Password for user {username} successfuly set to: {adminUserPassword}");

            }
        }

        static void RhetosHostBuilderConfiguration(IRhetosHostBuilder rhetosHostBuilder)
        {
            rhetosHostBuilder.ConfigureContainer(containerBuilder =>
            {
                containerBuilder.RegisterType<ProcessUserInfo>().As<IUserInfo>();
                containerBuilder.RegisterType<ConsoleLogProvider>().As<ILogProvider>();
            });
        }
    }
}