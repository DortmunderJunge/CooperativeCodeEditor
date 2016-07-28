using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(CooperativeSystems.CodeEditor.Api.Startup))]

namespace CooperativeSystems.CodeEditor.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            System.Web.Http.HttpConfiguration config = new System.Web.Http.HttpConfiguration();
            ConfigureAuth(app);
            WebApiConfig.Register(config);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);


        }
    }
}
