var app = angular.module('CooperativeCodeEdior', ['ngSanitize', 'ngMaterial', 'ui.ace']);

(function () {
    app.config(function ($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
    });
})();