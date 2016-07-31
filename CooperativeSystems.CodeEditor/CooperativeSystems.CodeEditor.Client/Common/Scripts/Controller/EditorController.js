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

        $scope.contentChanged = function (e) {
            console.log(e);
        };

        // The ui-ace option
        this.aceOption = {
            mode: $scope.language.name.toLowerCase(),
            theme: 'vibrant_ink',
            onChange: $scope.contentChanged,
            require: ['ace/ext/language_tools'],
            advanced: {
                enableSnippets: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            },
            onLoad: function (_ace) {

                // HACK to have the ace instance in the scope...
                $scope.languageChanged = function () {
                    _ace.getSession().setMode("ace/mode/" + JSON.parse($scope.language).name.toLowerCase());
                };
            }
        };















        // // window.editor = ace.edit("code-editor");
        // // window.editor.setTheme("ace/theme/vibrant_ink");
        // // window.editor.getSession().setMode("ace/mode/javascript");

        // $scope.fileContent = window.editor.getValue();

        $rootScope.$watch('activeDocument', function (document, oldDocument) {
            // Endlosschleife verhindern
            if (document) {
                if (!oldDocument || document.name !== oldDocument.name && document.content) {
                    $scope.fileContent = document.content;
                }
            }
        });

        // $scope.$watch('fileContent', function (content) {

        //     if ($rootScope.activeDocument) {
        //         $rootScope.activeDocument.content = content;
        //     } else {
        //         content = "$(function() {var start = function() {alert('Wähle eine deiner Dateien aus, um zu beginnen!');    };start();});" // dummy text
        //     }
        //     // window.editor.setValue(content);
        // });
    });
})();