var app = angular.module('CooperativeCodeEdior', ['ngMaterial', 'ui.ace']);

(function () {
    app.config(function ($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
    });
})();