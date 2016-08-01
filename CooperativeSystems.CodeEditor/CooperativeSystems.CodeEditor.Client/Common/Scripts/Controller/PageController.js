(function () {
    app.controller('PageController', ['$scope', '$rootScope', '$controller',
        function ($scope, $rootScope, $controller) {

            this.localUrlParams = {};

            $rootScope.activeDocument = {};

            this.init = function () {
                
                $rootScope.editorId = uuid.v4();

                var self = this;
                var locationHash = window.location.hash.replace('#', '').replace('?', '');
                angular.forEach(locationHash.split('&'), function (parameter, index) {
                    var key = parameter.split('=')[0];
                    var value = parameter.split('=')[1];
                    self.localUrlParams[key] = value;
                });

                if (this.localUrlParams.id) {
                    $rootScope.sessionId = this.localUrlParams.id;
                } else {
                    $rootScope.sessionId = uuid.v4();
                    if (window.location.hash.length > 0) {
                        window.location.hash = window.location.hash.concat('&');
                    } else {
                        window.location.hash = window.location.hash.concat('?');
                    }
                    window.location.hash = window.location.hash.concat('id=' + $rootScope.sessionId);
                    self.localUrlParams['id'] = $rootScope.sessionId;
                }

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
                        $rootScope.gitHubUser.UserName = uuid.v4();
                        console.log('not logged in');
                    }
                );
            }
        }]);
})();