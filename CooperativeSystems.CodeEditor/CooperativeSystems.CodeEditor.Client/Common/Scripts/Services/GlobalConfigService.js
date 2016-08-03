(function () {
    app.factory('GlobalConfigurationService', [function ($rootScope, $q, GitHubService) {

        var repositories = [];

        return {

            getRepositories: function () {
                if (repositories.length < 1 && $rootScope.isLoggedIn) {
                    return GitHubService.getRepositories($rootScope.gitHubUser.UserName).then(
                        function (success) {
                            repositories = success;
                            return $q.resolve(repositories);
                        },
                        function (error) {
                            return $q.reject(repositories);
                        }
                    );
                }
                else {
                    return $q.resolve(repositories);
                }
            }


        }
    }]);
})();