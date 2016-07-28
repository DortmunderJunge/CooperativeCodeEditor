using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace CooperativeSystems.CodeEditor.Api.Models
{
    public class GitHubLoginData : ExternalLoginData
    {
        public string GitHubApi { get; set; }

        private GitHubLoginData(ExternalLoginData data)
        {
            this.Email = data.Email;
            this.LoginProvider = data.LoginProvider;
            this.ProviderKey = data.ProviderKey;
            this.UserName = data.UserName;
        }

        public static new GitHubLoginData FromIdentity(ClaimsIdentity identity)
        {
            ExternalLoginData externalLoginData = ExternalLoginData.FromIdentity(identity);
            return new GitHubLoginData(externalLoginData)
            {
                GitHubApi = identity.FindFirstValue("urn:github:url"),
            };
        }
    }
}