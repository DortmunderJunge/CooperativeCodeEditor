using CooperativeSystems.CodeEditor.Api.Models;
using CooperativeSystems.CodeEditor.Api.Providers;
using CooperativeSystems.CodeEditor.Api.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace CooperativeSystems.CodeEditor.Api.Controllers
{
    [RoutePrefix("api/Authentication")]
    public class GitHubAccountController : ApiController
    {
        [HttpGet]
        [AllowAnonymous]
        [Route("AuthConfig")]
        public IHttpActionResult GetAuthorizationConfiguration()
        {
            return Json(GitHubAuthorizationConfiguration.CreateDefault());
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GitHubToken")]
        public async Task<IHttpActionResult> GetGitHubToken(string githubCode)
        {
            var config = GitHubAuthorizationConfiguration.CreateDefault();
            string responseString = "";
            using (var webClient = new WebClient())
            {
                webClient.Headers.Add("Accept", "application/json");
                responseString = webClient.UploadString(config.GetTokenEndpoint(), config.GetTokenEndpointParameters(githubCode));
            }

            var responseDefiniton = new { token_type = "", scope = "", access_token = "" };
            var response = JsonConvert.DeserializeAnonymousType(responseString, responseDefiniton);

            var accessToken = response.access_token;

            string userInformationString = "";
            using (var webClient = new WebClient())
            {
                webClient.Headers.Add("Accept", "application/json");
                // Set a User-Agent ... any User-Agent..... , otherwise receive a 403 Unauthorized.... yup!
                webClient.Headers.Add("User-Agent", "Y U require this header, github? this cost me some 30 minutes!");
                userInformationString = webClient.DownloadString(string.Format("https://api.github.com/user?access_token={0}", accessToken));
            }
            ApplicationUser user = JsonConvert.DeserializeObject<ApplicationUser>(userInformationString);
            user.CheckAndRepairUselessRequiredFields();
            ApplicationUser exisitingUser = await UserManager.FindByNameAsync(user.UserName);

            if (exisitingUser != null)
            {
                exisitingUser.AvatarUrl = user.AvatarUrl;
                exisitingUser.Email = user.Email;
                exisitingUser.GitHubId = user.GitHubId;
                exisitingUser.HtmlUrl = user.HtmlUrl;
                exisitingUser.RepositoriesUrl = user.RepositoriesUrl;
                exisitingUser.Url = user.Url;
                IdentityResult idr = await UserManager.UpdateAsync(exisitingUser);
            }
            else
            {
                await UserManager.CreateAsync(user);
                exisitingUser = await UserManager.FindByNameAsync(user.UserName);
            }

            await AddExternalLogin(exisitingUser, accessToken);

            ClaimsIdentity oAuthIdentity = await exisitingUser.GenerateUserIdentityAsync(UserManager, DefaultAuthenticationTypes.ExternalBearer);
            AuthenticationProperties authProperties = ApplicationOAuthProvider.CreateProperties(exisitingUser.UserName);

            oAuthIdentity.AddClaims(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, accessToken),
                new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider",
                    "ASP.NET Identity", "http://www.w3.org/2001/XMLSchema#string"),

                new Claim(ClaimTypes.Name, exisitingUser.UserName),
                new Claim("Certificate", accessToken),
            });

            Authentication.SignIn(new AuthenticationProperties
            {
                IsPersistent = false,
            }, oAuthIdentity);
            

            return Ok(new { Token = accessToken, user = exisitingUser });
        }

        public async Task AddExternalLogin(ApplicationUser user, string externalToken)
        {
            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            IdentityResult result = await UserManager.AddLoginAsync(user.Id,
                new UserLoginInfo("GitHub", user.GitHubId));
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public GitHubAccountController(ApplicationUserManager userManager, ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public GitHubAccountController()
        {
           
        }
    }
}
