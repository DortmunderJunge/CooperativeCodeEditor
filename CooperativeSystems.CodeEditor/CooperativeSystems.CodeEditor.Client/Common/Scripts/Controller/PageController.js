(function () {
    app.controller('PageController', ['$scope', '$rootScope', '$controller', 'SocketService',
        function ($scope, $rootScope, $controller, SocketService) {

            // Determine if the chat should be available, e.g. hide it in Home/Index.html if the user is not signed in.
            this.shouldShowExplorerAndEditor = function () {
                return $rootScope.isLoggedIn || window.location.hash.indexOf('view') >= 0;
            }

            this.localUrlParams = {};

            $rootScope.activeDocument = {};

            this.init = function () {

                $rootScope.editorId = uuid.v4();

                // determine the current session-id and generate a new one, if no session is set.
                var self = this;
                var locationHashQuery = window.location.hash.replace('#', '').split('?')[1] || '';
                angular.forEach(locationHashQuery.split('&'), function (parameter, index) {
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

                var LoginController = $controller('LoginController', { $scope: $scope });
                var ExplorerController = $controller('ExplorerController', { $scope: $scope });

                LoginController.checkIsLoggedIn().then(
                    function success() {
                        ExplorerController.repositories();
                    },
                    function error() {
                        $rootScope.gitHubUser.UserName = uuid.v4();
                        console.log('not logged in');
                    }
                );

                setTimeout(function () {
                    // start initializing the current content
                    SocketService.send('requestCurrentContent', JSON.stringify({ replyTo: $rootScope.editorId, }));
                }, 1200);
            }
        }]);
})();