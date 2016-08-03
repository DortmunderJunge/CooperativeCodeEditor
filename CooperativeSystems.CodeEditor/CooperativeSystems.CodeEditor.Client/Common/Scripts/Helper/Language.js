(function () {

    // https://ace.c9.io/build/kitchen-sink.html
    window.Language = function (name, caption, extensions) {
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

    window.Language.prototype.supportsFile = function (filename) {
        if (filename) {
            return filename.match(this.extRe);
        }
        return true;
    };
})();