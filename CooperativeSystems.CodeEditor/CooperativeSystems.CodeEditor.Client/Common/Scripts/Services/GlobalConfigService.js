(function () {
    app.factory('GlobalConfigurationService', [function () {

        var gitHubUser = {};

        var repositories = {};

        return {
            setGitHubUser: function(user) {
                gitHubUser = user;
            },

            getGitHubUser: function() {
                return gitHubUser;
            },
            
            setRepositories: function(repos) {
                repositories = repos;
            },

            getRepositories: function() {
                return repositories;
            } 


        }
    }]);
})();