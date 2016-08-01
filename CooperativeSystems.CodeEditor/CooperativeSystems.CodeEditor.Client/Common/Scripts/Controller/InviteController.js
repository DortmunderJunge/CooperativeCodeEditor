(function () {
    app.controller('InviteController', function ($scope, $rootScope, $mdDialog, $mdMedia) {

        $scope.openDialog = function (ev) {
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title('Code zusammen editieren...')
                .htmlContent('<p>Gib deine aktuelle Sitzungs-ID an deine Kollegen weiter, um deinen Code zusammen zu bearbeiten!</p> <br/> <label id="id">' + $rootScope.sessionId + '</label> <br/><br/> <label id="link">' + 'http://' + window.location.host + '/View/#?id=' + $rootScope.sessionId + '</label><br/>')
                .targetEvent(ev)
                .ok('ID kopieren')
                .cancel('Link erzeugen');

            $mdDialog.show(confirm).then(function () {
                
            }, function () {
               
            });
        }
    });
})();