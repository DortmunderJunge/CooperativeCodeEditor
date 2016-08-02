using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooperativeSystems.CodeEditor.Api.Models
{
    public class GitHubAuthorizationConfiguration
    {
        public string BaseUrl { get; set; }

        public string ClientId { get; set; }

        [JsonIgnore]
        public string ClientSecret { get; set; }

        public string Scope { get; set; }

        public string AuthorizationEndpoint
        {
            get
            {
                return HttpUtility.UrlPathEncode(string.Format("{0}authorize?client_id={1}&scope={2}", BaseUrl, ClientId, Scope));
            }
        }

        public string GetTokenEndpoint()
        {
            return HttpUtility.UrlPathEncode(string.Format("{0}access_token", BaseUrl));
        }

        public string GetTokenEndpointParameters(string code)
        {
            return HttpUtility.UrlPathEncode(string.Format("code={0}&client_id={1}&client_secret={2}", code, ClientId, ClientSecret));
        }


        private GitHubAuthorizationConfiguration()
        {

        }

        public static GitHubAuthorizationConfiguration CreateDefault()
        {
            return new GitHubAuthorizationConfiguration
            {
                ClientId = "920019fba9f40261f36b",
                ClientSecret = "32150e11d03f50b5d8a670b061d75f60277cf3f9",
                Scope = "user:email repo read:org",
                BaseUrl = "https://github.com/login/oauth/",
            };
        }
    }
}