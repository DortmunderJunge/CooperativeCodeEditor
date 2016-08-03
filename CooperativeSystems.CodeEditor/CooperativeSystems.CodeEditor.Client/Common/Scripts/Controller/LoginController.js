(function () {
    app.controller('LoginController', ['$scope', '$rootScope', '$window', 'AccountService', 'GitHubService',
        function ($scope, $rootScope, $window, AccountService, GitHubService) {

            // Log the user in by opening the GitHub-O-Auth-Page
            this.login = function () {
                if (window.location.hash.indexOf('view') >= 0) {
                    sessionStorage.setItem('hash', window.location.hash);
                }
                AccountService.login().then(
                    function success(redirect) {
                        window.open(redirect, '_self');
                    });
            };

            this.checkIsLoggedIn = function () {
                return GitHubService.checkIsLoggedIn().then(
                    function success(reponse) {
                        $rootScope.isLoggedIn = true;
                        // parse the stored auth-information from the redirect back
                        $rootScope.authInformation = JSON.parse($window.localStorage.getItem('auth'));
                        $rootScope.gitHubUser = $rootScope.authInformation.user;
                        return true;
                    },
                    function error(response) {
                        $rootScope.isLoggedIn = false;
                        $rootScope.authInformation = {};
                        $rootScope.gitHubUser = {};
                        return false;
                    }
                );
            };

            // delete all locally stored information about the user.
            this.logout = function () {
                $window.localStorage.removeItem('auth');
                $rootScope.isLoggedIn = false;
                $rootScope.authInformation = {};
                $rootScope.gitHubUser = {};
            };
        }]);
})();