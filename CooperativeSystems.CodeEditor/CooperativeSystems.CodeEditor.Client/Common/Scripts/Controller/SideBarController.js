(function() {
    app.controller('SideBarController', function ($scope, $mdSidenav) {
        $scope.openSidebar = function (position) {

            var sideBar = $('#sidebar');
            sideBar.removeClass('md-sidenav-left').removeClass('md-sidenav-right');

            if (position == 'right') {
                sideBar.addClass('md-sidenav-right');
            } else {
                sideBar.addClass('md-sidenav-left');
            }

            $mdSidenav('sidebar').toggle();
        };
    });
})();