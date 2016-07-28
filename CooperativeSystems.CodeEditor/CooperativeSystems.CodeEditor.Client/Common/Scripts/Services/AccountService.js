(function () {
    app.factory('AccountService', ['$http', function ($http) {

        var apiServer = 'http://http://cooperativecodeeditorapi.azurewebsites.net/';
        var baseUrl = apiServer + 'api/';
        var provider = 'GitHub'

        return {
            login: function () {
                var providers = [];

                return $http({
                    method: "GET",
                    url: baseUrl + "Authentication/AuthConfig",
                }).then(
                    function success(response) {
                        return authEndpoint = response.data.AuthorizationEndpoint;
                    });
            },
        }
    }]);
})();