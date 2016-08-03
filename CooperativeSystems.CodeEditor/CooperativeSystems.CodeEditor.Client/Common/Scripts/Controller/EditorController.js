(function () {
    app.controller('EditorController', function ($scope, $rootScope, SocketService, LanguageService) {

        // All available languages 
        this.languages = [];

        // prepare languages-data for beeing rendered into dropdown
        var modesByName = {};
        for (var name in LanguageService.allLanguages) {
            var data = LanguageService.allLanguages[name];
            var displayName = (LanguageService.nameOverrides[name] || name).replace(/_/g, " ");
            var filename = name.toLowerCase();
            var mode = new Language(filename, displayName, data[0]);
            modesByName[filename] = mode;
            this.languages.push(mode);
        }

        $scope.language = new Language('html', 'HTML', 'html');

        $rootScope.fileContent = "Zum Starten eine deiner Dateien auswählen!";

        // The ui-ace option
        // Look and feel of the embedded code-editor
        this.aceOption = {
            mode: $scope.language.name.toLowerCase(),
            theme: 'vibrant_ink',
            onChange: $scope.contentChanged,
            require: ['ace/ext/language_tools'],
            advanced: {
                enableSnippets: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            },
            onLoad: function (_ace) {
                // make ace available everywhere in our application.
                window.ace = _ace;
                // HACK to have the ace instance in the scope...
                $scope.languageChanged = function () {
                    _ace.getSession().setMode("ace/mode/" + JSON.parse($scope.language).name.toLowerCase());
                };

                // listen for changes inside the ace-editor
                window.ace.on('change', function (delta) {
                    if (window.ace.curOp && window.ace.curOp.command.name) { // if true, the current originates from a user-input 
                        var data = {
                            currentContentHash: ace.getSession().getValue().hashCode(),
                            data: JSON.stringifySafe(delta),
                            editor: $rootScope.editorId,
                        }
                        SocketService.send('editText', data);
                    }
                });
            }
        };

        // download the current ace-editor-content as file
        this.download = function () {
            var a = document.createElement("a");
            var text = $rootScope.fileContent;
            var file = new Blob([text], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = $rootScope.activeDocument ? $rootScope.activeDocument.name : 'code.txt';
            a.click();
        }

        // listen for changes to the currently opened document.
        // notify others, if the document changes.
        $rootScope.$watch('activeDocument', function (document, oldDocument) {
            // Endlosschleife verhindern
            if (document) {
                if (!oldDocument || document.name !== oldDocument.name && document.content) {
                    $rootScope.fileContent = document.content;
                    SocketService.send('changeDocument', document);
                }
            }
        });
    });
})();