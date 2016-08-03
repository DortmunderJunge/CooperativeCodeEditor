(function () {
    app.controller('InfoController', function ($rootScope) {

        // should the git-hub-image be displayed?
        this.showImage = true;

        // Determine if the chat should be available, e.g. hide it in Home/Index.html if the user is not signed in.
        this.shouldShowChat = function () {
            return $rootScope.isLoggedIn || window.location.hash.indexOf('view') >= 0;
        }
    });
})();