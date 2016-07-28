(function () {
    app.controller('PageController', ['$scope', '$rootScope', '$controller',
        function ($scope, $rootScope, $controller) {
            this.init = function () {

                $rootScope.colors = ['#ffd740', '#00bcd4', '#e91e63'];

                $rootScope.otherUsers = [
                    {
                        Login: 'GrumpyCat',
                        UserName: 'GrumpyCat',
                        avatar_url: 'https://pbs.twimg.com/profile_images/616542814319415296/McCTpH_E.jpg'
                    }
                ]

                var LoginController = $controller('LoginController', { $scope: $scope });
                var ExplorerController = $controller('ExplorerController', { $scope: $scope });

                LoginController.checkIsLoggedIn().then(
                    function success() {
                        $rootScope.gitHubUser.colorIndex = 0;
                        ExplorerController.getGitHubRepos();
                    },
                    function error() {
                        console.log('not logged in');
                    }
                );
            }
        }]);
})();