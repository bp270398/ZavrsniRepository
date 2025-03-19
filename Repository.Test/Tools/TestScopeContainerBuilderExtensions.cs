using Autofac;
using Rhetos.Logging;
using Rhetos.TestCommon;
using Rhetos.Utilities;

namespace Repository.Test
{
    public static class TestScopeContainerBuilderExtensions
    {
        public static ContainerBuilder ConfigureLogMonitor(this ContainerBuilder builder, List<string> log, EventType minLevel = EventType.Trace)
        {
            builder.RegisterInstance(new ConsoleLogProvider((eventType, eventName, message) =>
            {
                if (eventType >= minLevel)
                    log.Add("[" + eventType + "] " + (eventName != null ? (eventName + ": ") : "") + message());
            }))
                .As<ILogProvider>();
            return builder;
        }

        public static ContainerBuilder ConfigureApplicationUser(this ContainerBuilder builder, string username)
        {
            builder.RegisterInstance(new TestUserInfo(username)).As<IUserInfo>();
            return builder;
        }
    }
}
