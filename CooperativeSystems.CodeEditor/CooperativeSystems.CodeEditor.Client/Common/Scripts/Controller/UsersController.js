(function () {
    app.controller('UsersController', function ($rootScope) {
        
        this.pickerOpen = false;

        this.setColor = function (user) {
            if (user) {
                angular.forEach($rootScope.otherUsers, function(user, index) {
                    user.colorIndex = ((user.colorIndex + 1) % $rootScope.colors.length);
                    return false;
                }); 
            } else {
                $rootScope.gitHubUser.colorIndex = (($rootScope.gitHubUser.colorIndex + 1) % $rootScope.colors.length);
            }
        }
    });
})();