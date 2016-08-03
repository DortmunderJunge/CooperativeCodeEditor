(function () {
    app.controller('InviteController', function ($scope, $rootScope, $mdDialog, $mdMedia) {

        var getViewUrl = function() {
            var hash = '#view?id=' + $rootScope.sessionId;
            return window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search + hash;
        }

        // open the popup containing session-share-instructions
        $scope.openDialog = function (ev) {
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title('Code zusammen editieren...')
                .htmlContent('<p>Gib deine aktuelle Sitzungs-ID an deine Kollegen weiter, um deinen Code zusammen zu bearbeiten!</p> <br/> <label id="id">' + $rootScope.sessionId + '</label> <br/><br/> <label id="link">' + getViewUrl() + '</label><br/>')
                .targetEvent(ev)
                .ok('Verstanden!')

            $mdDialog.show(confirm).then(function () {
                // TODO: Optional eine Aktion ausführen, wenn der Benuter die OK-Funktion auslöst
            }, function () {
               // TODO: Optional mit .cancel('Abbrechen') einen Abbrechen-Button einfügen und beim Abbrechen-Klick eine Option ausführen
            });
        }
    });
})();