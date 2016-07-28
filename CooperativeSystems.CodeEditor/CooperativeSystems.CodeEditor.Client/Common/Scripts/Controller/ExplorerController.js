(function () {
    app.controller('ExplorerController', ['$scope', '$rootScope', '$timeout', '$mdSidenav', 'GitHubService', 'GitHubContent', 'GlobalConfigurationService',
        function ($scope, $rootScope, $timeout, $mdSidenav, GitHubService, GitHubContent, Configuration) {

            /* Side-Nav-Control */
            $scope.toggleLeft = buildDelayedToggler('left');
            function debounce(func, wait, context) {
                var timer;
                return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }

            function buildDelayedToggler(navID) {
                return debounce(function () {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            // $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
            }

            function buildToggler(navID) {
                return function () {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            // $log.debug("toggle " + navID + " is done");
                        });
                }
            }

            $scope.close = function () {
                $mdSidenav('left').close()
                    .then(function () {
                        // $log.debug("close LEFT is done");
                    });
            }
            /* End Side-Nav-Control */
            
            this.repositories = function () {
                return Configuration.getRepositories();
            }

            this.currentContent;

            this.setCurrentContent = function (content) {
                if (content instanceof GitHubContent) {
                    this.currentContent = content;
                }
            }

             this.getGitHubRepos = function () {
                 GitHubService.getRepositories(Configuration.getGitHubUser().UserName).then(
                     function success(repositories) {
                         $scope.gitHubRepos = repositories;
                         Configuration.setRepositories(repositories);
                     });
             },

                this.open = function (name) {
                    var repository = this.currentContent;
                    angular.forEach($scope.gitHubRepos, function (repo, index) {
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
                },

                this.openFile = function (gitHubFile) {
                    var fileContent = gitHubFile.getFileContent().then(
                        function success(file) {
                            window.editor.setValue(file);
                            $rootScope.activeDocument = gitHubFile;
                        }
                    );

                }
        }]);
})();