(function () {
    app.factory('GitHubContent', ['$http', function ($http) {
        function GitHubContent(name, path, type, self) {
            this.name = name;
            this.path = path;
            this.type = type;
            this.self = self;
            this.isExpanded = false;
            this.isLoading = false;
            this.children = [];
            // more properties possible here, but not necessary.
        }

        // expand a folder/repository
        // get the child-items, if necessary.
        GitHubContent.prototype.expand = function () {
            this.isExpanded = true;
            if (this.children.length < 1) {
                return this.fillDirectoryContent();
            }
            return this.children;
        }

        // collapse a folder/repository
        GitHubContent.prototype.collapse = function () {
            return this.isExpanded = false;
        }

        GitHubContent.prototype.toggleExpandedState = function () {
            if (this.type === 'dir') {
                if (this.isExpanded) {
                    return this.collapse();
                } else {
                    return this.expand();
                }
            }
        }

        // get a directory's content and fill it
        GitHubContent.prototype.fillDirectoryContent = function () {
            var me = this;
            me.isLoading = true;
            me.children = [];
            return $http({
                method: 'GET',
                url: me.self
            }).then(
                function success(response) {
                    if (angular.isArray(response.data)) {
                        angular.forEach(response.data, function (content, index) {
                            me.children.push(GitHubContent.apiResponseTransformerToContent(content));
                        });
                    } else {
                        me.children.push(GitHubContent.apiResponseTransformerToContent(response.data));
                    }
                    me.isLoading = false;
                    return me.children;
                }, function error() {
                    // for example 404 when empty.
                    me.isLoading = false;
                });
        }

        // Get a file's content
        GitHubContent.prototype.getFileContent = function () {
            var me = this;
            me.isLoading = true;
            return $http({
                method: 'GET',
                url: this.self
            }).then(
                function success(response) {
                    me.isLoading = false;
                    return decodeURIComponent(escape(window.atob(response.data.content)));
                },
                function error() {
                    me.isLoading = false;
                });
        }

        GitHubContent.prototype.getContent = function () {
            if (this.type === 'dir') {
                return this.getDirectoryContent;
            } else {
                return this.getFileContent;
            }
        };

        // Transform GitHubApi-Responses into GitHubContent Objects
        GitHubContent.apiResponseTransformerToContent = function (responseData) {
            return new GitHubContent(
                responseData.name,
                responseData.path,
                responseData.type,
                responseData._links.self);
        }

        GitHubContent.apiResponseTransformerToRepository = function (responseData) {
            return new GitHubContent(
                responseData.name,
                '',
                'dir', // handle repository like a directory in our view
                responseData.contents_url.slice(0, responseData.contents_url.indexOf('{'))); // cut placeholder
        }

        return GitHubContent;
    }]);
})();