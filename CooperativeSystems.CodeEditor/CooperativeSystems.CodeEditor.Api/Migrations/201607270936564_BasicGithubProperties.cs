namespace CooperativeSystems.CodeEditor.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BasicGithubProperties : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Login", c => c.String());
            AddColumn("dbo.AspNetUsers", "AvatarUrl", c => c.String());
            AddColumn("dbo.AspNetUsers", "Url", c => c.String());
            AddColumn("dbo.AspNetUsers", "HtmlUrl", c => c.String());
            AddColumn("dbo.AspNetUsers", "RepositoriesUrl", c => c.String());
            DropColumn("dbo.AspNetUsers", "GitHubUserName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "GitHubUserName", c => c.String());
            DropColumn("dbo.AspNetUsers", "RepositoriesUrl");
            DropColumn("dbo.AspNetUsers", "HtmlUrl");
            DropColumn("dbo.AspNetUsers", "Url");
            DropColumn("dbo.AspNetUsers", "AvatarUrl");
            DropColumn("dbo.AspNetUsers", "Login");
        }
    }
}
