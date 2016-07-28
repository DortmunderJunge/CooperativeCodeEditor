
(function () {
    app.factory('AuthenticationInterceptor', ['$window', '$q', function ($window, $q) {
        return {
            request: function (config) {
                if ($window.localStorage.getItem('auth')) {
                    config.headers = config.headers || {};
                    if (config.url.indexOf('https://github') < 0) {
                        config.headers.Authorization = 'Bearer ' + JSON.parse($window.localStorage.getItem('auth')).Token;
                    } else {
                        config.headers.Authorization = 'token ' + JSON.parse($window.localStorage.getItem('auth')).Token;
                    }
                }
                return config || $q.when(config);
            },
        }
    }]);


    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthenticationInterceptor');
    }]);

})();