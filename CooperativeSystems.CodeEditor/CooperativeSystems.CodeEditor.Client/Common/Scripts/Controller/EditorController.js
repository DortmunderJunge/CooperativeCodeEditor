(function () {
    app.controller('EditorController', function ($scope, $rootScope) {

        this.languages = [];

        var Language = function (name, caption, extensions) {
            this.name = name;
            this.caption = caption;
            this.mode = "ace/mode/" + name;
            this.extensions = extensions;
            var re;
            if (/\^/.test(extensions)) {
                re = extensions.replace(/\|(\^)?/g, function (a, b) {
                    return "$|" + (b ? "^" : "^.*\\.");
                }) + "$";
            } else {
                re = "^.*\\.(" + extensions + ")$";
            }

            this.extRe = new RegExp(re, "gi");
        };

        Language.prototype.supportsFile = function (filename) {
            if (filename) {
                return filename.match(this.extRe);
            }
            return true;
        };
        var allLanguages = {
            ABAP: ["abap"],
            ABC: ["abc"],
            ActionScript: ["as"],
            ADA: ["ada|adb"],
            Apache_Conf: ["^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd"],
            AsciiDoc: ["asciidoc|adoc"],
            Assembly_x86: ["asm|a"],
            AutoHotKey: ["ahk"],
            BatchFile: ["bat|cmd"],
            C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
            C9Search: ["c9search_results"],
            Cirru: ["cirru|cr"],
            Clojure: ["clj|cljs"],
            Cobol: ["CBL|COB"],
            coffee: ["coffee|cf|cson|^Cakefile"],
            ColdFusion: ["cfm"],
            CSharp: ["cs"],
            CSS: ["css"],
            Curly: ["curly"],
            D: ["d|di"],
            Dart: ["dart"],
            Diff: ["diff|patch"],
            Dockerfile: ["^Dockerfile"],
            Dot: ["dot"],
            Dummy: ["dummy"],
            DummySyntax: ["dummy"],
            Eiffel: ["e|ge"],
            EJS: ["ejs"],
            Elixir: ["ex|exs"],
            Elm: ["elm"],
            Erlang: ["erl|hrl"],
            Forth: ["frt|fs|ldr"],
            FTL: ["ftl"],
            Gcode: ["gcode"],
            Gherkin: ["feature"],
            Gitignore: ["^.gitignore"],
            Glsl: ["glsl|frag|vert"],
            Gobstones: ["gbs"],
            golang: ["go"],
            Groovy: ["groovy"],
            HAML: ["haml"],
            Handlebars: ["hbs|handlebars|tpl|mustache"],
            Haskell: ["hs"],
            haXe: ["hx"],
            HTML: ["html|htm|xhtml"],
            HTML_Elixir: ["eex|html.eex"],
            HTML_Ruby: ["erb|rhtml|html.erb"],
            INI: ["ini|conf|cfg|prefs"],
            Io: ["io"],
            Jack: ["jack"],
            Jade: ["jade"],
            Java: ["java"],
            JavaScript: ["js|jsm|jsx"],
            JSON: ["json"],
            JSONiq: ["jq"],
            JSP: ["jsp"],
            JSX: ["jsx"],
            Julia: ["jl"],
            LaTeX: ["tex|latex|ltx|bib"],
            Lean: ["lean|hlean"],
            LESS: ["less"],
            Liquid: ["liquid"],
            Lisp: ["lisp"],
            LiveScript: ["ls"],
            LogiQL: ["logic|lql"],
            LSL: ["lsl"],
            Lua: ["lua"],
            LuaPage: ["lp"],
            Lucene: ["lucene"],
            Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
            Markdown: ["md|markdown"],
            Mask: ["mask"],
            MATLAB: ["matlab"],
            Maze: ["mz"],
            MEL: ["mel"],
            MUSHCode: ["mc|mush"],
            MySQL: ["mysql"],
            Nix: ["nix"],
            NSIS: ["nsi|nsh"],
            ObjectiveC: ["m|mm"],
            OCaml: ["ml|mli"],
            Pascal: ["pas|p"],
            Perl: ["pl|pm"],
            pgSQL: ["pgsql"],
            PHP: ["php|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
            Powershell: ["ps1"],
            Praat: ["praat|praatscript|psc|proc"],
            Prolog: ["plg|prolog"],
            Properties: ["properties"],
            Protobuf: ["proto"],
            Python: ["py"],
            R: ["r"],
            Razor: ["cshtml"],
            RDoc: ["Rd"],
            RHTML: ["Rhtml"],
            RST: ["rst"],
            Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
            Rust: ["rs"],
            SASS: ["sass"],
            SCAD: ["scad"],
            Scala: ["scala"],
            Scheme: ["scm|sm|rkt|oak|scheme"],
            SCSS: ["scss"],
            SH: ["sh|bash|^.bashrc"],
            SJS: ["sjs"],
            Smarty: ["smarty|tpl"],
            snippets: ["snippets"],
            Soy_Template: ["soy"],
            Space: ["space"],
            SQL: ["sql"],
            SQLServer: ["sqlserver"],
            Stylus: ["styl|stylus"],
            SVG: ["svg"],
            Swift: ["swift"],
            Tcl: ["tcl"],
            Tex: ["tex"],
            Text: ["txt"],
            Textile: ["textile"],
            Toml: ["toml"],
            Twig: ["twig|swig"],
            Typescript: ["ts|typescript|str"],
            Vala: ["vala"],
            VBScript: ["vbs|vb"],
            Velocity: ["vm"],
            Verilog: ["v|vh|sv|svh"],
            VHDL: ["vhd|vhdl"],
            Wollok: ["wlk|wpgm|wtest"],
            XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
            XQuery: ["xq"],
            YAML: ["yaml|yml"],
            Django: ["html"]
        };

        var nameOverrides = {
            ObjectiveC: "Objective-C",
            CSharp: "C#",
            golang: "Go",
            C_Cpp: "C and C++",
            coffee: "CoffeeScript",
            HTML_Ruby: "HTML (Ruby)",
            HTML_Elixir: "HTML (Elixir)",
            FTL: "FreeMarker"
        };
        var modesByName = {};
        for (var name in allLanguages) {
            var data = allLanguages[name];
            var displayName = (nameOverrides[name] || name).replace(/_/g, " ");
            var filename = name.toLowerCase();
            var mode = new Language(filename, displayName, data[0]);
            modesByName[filename] = mode;
            this.languages.push(mode);
        }

        $scope.language = new Language('html', 'HTML', 'html');

        $scope.fileContent = "Zum Starten eine deiner Dateien auswählen!";

        $rootScope.socket.onmessage = function (message) {
            var emptyObject = JSON.stringify({ "data": { "data": null } });
            var data = JSON.parse(JSON.parse(message.data).data || JSON.parse(emptyObject).data);
            console.log("receive data");
            console.log(data);
            if (data) {
                var action = data.action;

                switch (action) {
                    case 'editText': {
                        var editor = data.value.editor;
                        var hash = data.value.currentContentHash;
                        $scope.lastHash = hash;
                        if (editor !== $rootScope.editorId && hash !== ace.getSession().getValue().hashCode()) { //ignore my changes.
                            ace.getSession().getDocument().applyDelta(JSON.parse(data.value.data));
                        }
                        break;
                    }

                    case 'changeDocument': {
                        var document = data.value;
                        $rootScope.activeDocument = document;
                        $rootScope.$apply();
                        break;
                    }

                    case 'requestCurrentContent': {
                        data.value = JSON.parse(data.value);
                        var senderId = data.value.replyTo;
                        var document = $.extend(true, {}, $rootScope.activeDocument);
                        document.content = $scope.fileContent;
                        var data = {
                            data: {
                                action: 'replyCurrentContent',
                                value: JSON.stringify({
                                    forId: senderId,
                                    document: document,
                                }),
                            },
                        };
                        data.data = JSON.stringifySafe(data.data);
                        data = JSON.stringifySafe(data);
                        $rootScope.socket.send(data);
                        break;
                    }

                    case 'replyCurrentContent': {
                        data.value = JSON.parse(data.value);
                        var receiverId = data.value.forId;
                        if (receiverId == $rootScope.editorId) {
                            var document = data.value.document;
                            $rootScope.activeDocument = document;
                            $rootScope.$apply();
                        }
                        break;
                    }
                    
                    case 'newChatMessage': {
                        $rootScope.chatMessages.push(data.value);
                        $rootScope.$apply();
                    }
                }
            }
        };

        // The ui-ace option
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
                window.ace = _ace;
                // HACK to have the ace instance in the scope...
                $scope.languageChanged = function () {
                    _ace.getSession().setMode("ace/mode/" + JSON.parse($scope.language).name.toLowerCase());
                };

                window.ace.on('change', function (delta) {
                    if (window.ace.curOp && window.ace.curOp.command.name) { // Änderung durch user-input und nicht durch Programm
                        if ($rootScope.socket.readyState == 1) {
                            var data = {
                                data: {
                                    action: 'editText',
                                    value: {
                                        currentContentHash: ace.getSession().getValue().hashCode(),
                                        data: JSON.stringifySafe(delta),
                                        editor: $rootScope.editorId,
                                    }
                                }
                            };
                            data.data = JSON.stringifySafe(data.data);
                            data = JSON.stringifySafe(data);

                            console.log('send data');
                            console.log(data);
                            $rootScope.socket.send(data);
                        }
                    }
                });
            }
        };

        this.download = function () {
            var a = document.createElement("a");
            var text = $scope.fileContent;
            var file = new Blob([text], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = $rootScope.activeDocument ? $rootScope.activeDocument.name : 'code.txt';
            a.click();
        }

        $rootScope.$watch('activeDocument', function (document, oldDocument) {
            // Endlosschleife verhindern
            if (document) {
                if (!oldDocument || document.name !== oldDocument.name && document.content) {
                    $scope.fileContent = document.content;
                    console.log(document);

                    var data = {
                        data: {
                            action: 'changeDocument',
                            value: document,
                        },
                    };
                    data.data = JSON.stringifySafe(data.data);
                    data = JSON.stringifySafe(data);
                    $rootScope.socket.send(data);
                }
            }
        });
    });
})();