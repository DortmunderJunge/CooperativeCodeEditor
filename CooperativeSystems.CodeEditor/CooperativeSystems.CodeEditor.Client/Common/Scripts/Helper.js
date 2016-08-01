(function () {

    // Do not serialize circular references
    JSON.stringifySafe = function (obj, replacer, indent) {
        var printedObjects = [];
        var printedObjectKeys = [];

        function printOnceReplacer(key, value) {
            if (printedObjects.length > 20000) {
                return 'object too long';
            }
            var printedObjIndex = false;
            printedObjects.forEach(function (obj, index) {
                if (obj === value) {
                    printedObjIndex = index;
                }
            });

            if (key == '') { //root element
                printedObjects.push(obj);
                printedObjectKeys.push("root");
                return value;
            }

            else if (printedObjIndex + "" != "false" && typeof (value) == "object") {
                if (printedObjectKeys[printedObjIndex] == "root") {
                    return "(pointer to root)";
                } else {
                    return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() : typeof (value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
                }
            } else {

                var qualifiedKey = key || "(empty key)";
                printedObjects.push(value);
                printedObjectKeys.push(qualifiedKey);
                if (replacer) {
                    return replacer(key, value);
                } else {
                    return value;
                }
            }
        }
        return JSON.stringify(obj, printOnceReplacer, indent);
    };


    // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    String.prototype.hashCode = function () {
        var hash = 0;
        if (this.length == 0) return hash;

        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;

    }

})();