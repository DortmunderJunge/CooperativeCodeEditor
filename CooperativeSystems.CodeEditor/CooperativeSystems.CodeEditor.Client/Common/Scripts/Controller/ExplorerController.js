(function () {
    app.controller('ExplorerController', ['$scope', '$rootScope', '$timeout', '$q', '$mdSidenav', 'GitHubService', 'GitHubContent',
        function ($scope, $rootScope, $timeout, $q, $mdSidenav, GitHubService, GitHubContent) {

            var currentRequest;

            // all GitHub-Repositories owned by the user.
            this.repositories = function () {
                if (!$rootScope.gitHubUser) {
                    return;
                }
                currentRequest = (GitHubService.getRepositories($rootScope.gitHubUser.UserName)).then(
                    function (success) {
                        currentRequest = null;
                        $rootScope.cachedRepositories = success;
                        return $rootScope.cachedRepositories;
                    },
                    function (error) {
                        currentRequest = null;
                        $rootScope.cachedRepositories = ['Error getting Repositories :-('];
                        return error;
                    });
                return currentRequest;
            };

            this.currentContent;

            this.setCurrentContent = function (content) {
                if (content instanceof GitHubContent) {
                    this.currentContent = content;
                }
            }

            // opens a repository, directory or file.
            this.open = function (name) {
                var repository = this.currentContent;
                console.log(name);
                console.log(this);
                angular.forEach($rootScope.cachedRepositories, function (repo, index) {
                    if (repo.name === name) {
                        repository = repo;
                        return false;
                    }
                });

                if (repository) {
                    if (repository.type === 'dir') {
                        repository.toggleExpandedState();
                    } else {
                        this.openFile(repository);
                    }
                }
            };

            this.openFile = function (gitHubFile) {
                gitHubFile.getFileContent().then(
                    function success(file) {
                        gitHubFile.content = file;
                        $rootScope.activeDocument = gitHubFile;
                    });

            }
        }]);
})();