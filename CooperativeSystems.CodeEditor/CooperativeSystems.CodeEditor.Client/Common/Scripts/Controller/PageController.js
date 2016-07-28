(function () {
    app.controller('PageController', ['$scope', '$controller',
        function ($scope, $controller) {
            this.init = function () {

                 var LoginController = $controller('LoginController', { $scope: $scope });
                 var ExplorerController = $controller('ExplorerController', { $scope: $scope });

                 LoginController.checkIsLoggedIn().then(
                     function success() {
                         ExplorerController.getGitHubRepos();
                     },
                     function error() {
                        console.log('not logged in');
                     }
                 );
            }
        }]);
})();