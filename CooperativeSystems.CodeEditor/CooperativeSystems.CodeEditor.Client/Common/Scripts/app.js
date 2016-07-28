var app = angular.module('CooperativeCodeEdior', ['ngMaterial']);

(function () {
    app.config(function ($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
    });
})();