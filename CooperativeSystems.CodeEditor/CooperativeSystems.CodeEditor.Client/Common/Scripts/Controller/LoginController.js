(function () {
    app.controller('LoginController', ['$scope', '$rootScope', '$window', 'AccountService', 'GitHubService', 'GlobalConfigurationService',
        function ($scope, $rootScope, $window, AccountService, GitHubService, Configuration) {

            this.login = function () {
                AccountService.login().then(
                    function success(redirect) {
                        window.open(redirect, '_self');
                    });
            },

                this.currentUser = function () {
                    return gitHubUser();
                },

                this.checkIsLoggedIn = function () {
                    return GitHubService.checkIsLoggedIn().then(
                        function success(reponse) {
                            $rootScope.isLoggedIn = true;
                            // maybe take these information from response.
                            $rootScope.authInformation = JSON.parse($window.localStorage.getItem('auth'));
                            $rootScope.gitHubUser = $rootScope.authInformation.user;
                            Configuration.setGitHubUser($rootScope.authInformation.user);
                            return true;
                        },
                        function error(response) {
                            $rootScope.isLoggedIn = false;
                            $rootScope.authInformation = {};
                            $rootScope.gitHubUser = {};
                            Configuration.setGitHubUser({});
                            return false;
                        }
                    );
                },

                this.logout = function () {
                    $window.localStorage.removeItem('auth');
                    $rootScope.isLoggedIn = false;
                    $rootScope.authInformation = {};
                    $rootScope.gitHubUser = {};
                    Configuration.setGitHubUser({});
                }
        }]);
})();