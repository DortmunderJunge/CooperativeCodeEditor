(function () {
    app.factory('GitHubService', ['$http', '$q', '$window', 'GitHubContent',
        function ($http, $q, $window, GitHubContent) {

            var gitHubApiBaseUrl = 'https://api.github.com/';

            return {
                checkIsLoggedIn: function () {
                    return $http({
                        method: 'GET',
                        url: gitHubApiBaseUrl + 'user'
                    }).then(function success(response) {
                        return response;
                    }, function error(response) {
                        return $q.reject(response);
                    });
                },

                getRepositories: function (username) {
                    return $http({
                        method: 'GET',
                        url: gitHubApiBaseUrl + 'users/' + username + '/repos',
                    }).then(
                        function success(response) {
                            var gitHubRepos = [];
                            if (angular.isArray(response.data)) {
                                angular.forEach(response.data, function (content, value) {
                                    gitHubRepos.push(GitHubContent.apiResponseTransformerToRepository(content));
                                });
                            } else {
                                gitHubRepos.push(GitHubContent.apiResponseTransformerToRepository(response.data));
                            }
                            return gitHubRepos;
                        });
                },

                getRepositoryContents: function (username, repositoryName) {
                    return $http({
                        method: 'GET',
                        url: gitHubApiBaseUrl + '/repos/' + username + '/' + repositoryName + '/contents',
                    }).then(
                        function success(response) {
                            return response.data;
                        });
                },


            }
        }]);
})();