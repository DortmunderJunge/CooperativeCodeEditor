var app = angular.module('CooperativeCodeEdior', ['ngSanitize', 'ngMaterial', 'ngAnimate', 'ui.ace']);

(function () {
    app.config(function ($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
    });
})();