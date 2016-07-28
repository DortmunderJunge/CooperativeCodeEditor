(function () {
    app.factory('AccountService', ['$http', function ($http) {

        var apiServer = 'http://cooperativecodeeditorapi.azurewebsites.net/'; // 'http://localhost/CooperativeCodeEditor/
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