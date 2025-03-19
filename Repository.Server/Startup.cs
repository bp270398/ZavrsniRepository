using System.Globalization;
using Autofac;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.OpenApi.Models;
using NLog;
using Rhetos;

namespace Repository.Server
{
    public class Startup
    {
        string[] webOrigin = new string[] {
            "http://127.0.0.1:49265",
            "http://localhost:49265",
            "https://127.0.0.1:49265",
            "https://localhost:49265"
        };

        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = CookieSecurePolicy.None;
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
            });

            services.AddCors(options =>
            options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
                policy.WithOrigins(webOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("Content-Disposition")
            ));

            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(type => type.ToString());
                c.SwaggerDoc("rhetos", new OpenApiInfo { Title = "Rhetos REST API", Version = "v1" });
            });

            services.AddControllers()
                .AddNewtonsoftJson(o =>
                {
                    o.UseMemberCasing();
                    o.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.MicrosoftDateFormat;
                    o.SerializerSettings.Converters.Add(new Rhetos.Host.AspNet.RestApi.Utilities.ByteArrayConverter());
                });

            services.AddRhetosHost(ConfigureRhetosHostBuilder)
                .AddAspNetCoreIdentityUser()
                .AddAspNetFormsAuth()
                .AddHostLogging()
                .AddHostLocalization()
                .AddImpersonation()
                .AddDashboard()
                .AddComplexEntity()
                .AddRestApi(o =>
                {
                    o.BaseRoute = "rest";
                    o.GroupNameMapper = (conceptInfo, controller, oldName) => "rhetos";
                });

            services.AddLocalization()
                .AddPortableObjectLocalization(options => options.ResourcesPath = "Localization")
                .AddMemoryCache();

            services.Configure<IdentityOptions>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 30;
                options.Lockout.AllowedForNewUsers = false;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/rhetos/swagger.json", "Rhetos REST API");
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "App v1");
            });
            app.UseCors(MyAllowSpecificOrigins);
            app.UseRhetosRestApi();
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseRhetosAspNetFormsAuth();
            app.UseRhetosImpersonation();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRhetosDashboard();
            });
            app.UseRequestLocalization(options =>
            {
                var supportedCultures = new List<CultureInfo>
                {
                    new CultureInfo("hr")
                };
                options.DefaultRequestCulture = new RequestCulture("hr");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
                options.RequestCultureProviders = new List<IRequestCultureProvider>
                {
                    new QueryStringRequestCultureProvider()
                };
            });
        }

        private void ConfigureRhetosHostBuilder(IServiceProvider serviceProvider, IRhetosHostBuilder rhetosHostBuilder)
        {
            rhetosHostBuilder
                .ConfigureRhetosAppDefaults()
                .UseBuilderLogProviderFromHost(serviceProvider)
                .ConfigureConfiguration(builder => builder
                    .MapNetCoreConfiguration(Configuration)
                )
                .ConfigureContainer(builder =>
                {
                    builder.RegisterType<EmailService>().As<IEmailService>();
                    builder.Register(context => context.Resolve<Rhetos.Utilities.IConfiguration>().GetOptions<EmailConfiguration>()).SingleInstance();
                });
        }
    }
}
