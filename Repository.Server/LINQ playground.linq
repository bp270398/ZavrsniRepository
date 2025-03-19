<Query Kind="Program">
  <Reference Relative="..\Repository.Server\bin\Debug\net6.0\Repository.Server.dll"></Reference>
  <Namespace>Autofac</Namespace>
  <Namespace>Microsoft.AspNetCore.Http</Namespace>
  <Namespace>Microsoft.AspNetCore.Identity</Namespace>
  <Namespace>Microsoft.Extensions.DependencyInjection</Namespace>
  <Namespace>Rhetos</Namespace>
  <Namespace>Rhetos.Dom.DefaultConcepts</Namespace>
  <Namespace>Rhetos.Logging</Namespace>
  <Namespace>Rhetos.Security</Namespace>
  <Namespace>Rhetos.Utilities</Namespace>
  <Namespace>System.Security.Claims</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>Rhetos.TestCommon</Namespace>
  <IncludeUncapsulator>false</IncludeUncapsulator>
  <IncludeAspNet>true</IncludeAspNet>
  <RuntimeVersion>6.0</RuntimeVersion>
</Query>

void Main()
{
    ConsoleLogger.MinLevel = EventType.Info; // Use EventType.Trace for more detailed log.
    string rhetosHostAssemblyPath = Path.Combine(Path.GetDirectoryName(Util.CurrentQueryPath), @"..\Repository.Server\bin\Debug\net6.0\Repository.Server.dll");

	using (var scope = LinqPadRhetosHost.CreateScope(rhetosHostAssemblyPath))
    {
        var context = scope.Resolve<Common.ExecutionContext>();
		var repository = context.Repository;
		var sqlExecuter = scope.Resolve<ISqlExecuter>();
		
		#region Get Common.Principal

		var principals = repository.Common.Principal.Query().ToSimple();
		principals.ToString().Dump("Common.Principal SQL query");
		principals.Dump("Common.Principal items");

		#endregion

		var c = scope.Resolve<IConfiguration>().GetValue<Repository.Server.EmailConfiguration>("EmailConfiguration");
		c.Dump();

		//scope.CommitAndClose();
	}

	var hostServices = RhetosHost.GetHostServices(
		rhetosHostAssemblyPath,
		rhetosHostBuilder => rhetosHostBuilder.ConfigureContainer(
		builder => {
			builder.RegisterType<ConsoleLogProvider>().As<ILogProvider>().SingleInstance();
			builder.RegisterInstance(new TestUserInfo("admin")).As<IUserInfo>();
		}), 
		(hostBuilderContext, serviceCollection) => {
			serviceCollection.AddScoped<IUserInfo, ProcessUserInfo>();
			serviceCollection.AddHttpContextAccessor();
		}
	);

	using (var scope = hostServices.CreateScope())
	{
		
		var authService = scope.ServiceProvider.GetService<Rhetos.AspNetFormsAuth.AuthenticationService>();
		if (authService == null)
			throw new UserException($"The AspNetFormsAuth package is not configured properly. Call the {nameof(AspNetFormsAuthCollectionExtensions.AddAspNetFormsAuth)} method on the {nameof(IServiceCollection)} inside the Startup.ConfigureServices method.");

		
		
		//scope.ServiceProvider.GetService<IRhetosComponent<IUnitOfWork>>().Value.CommitAndClose();
	}	
}

