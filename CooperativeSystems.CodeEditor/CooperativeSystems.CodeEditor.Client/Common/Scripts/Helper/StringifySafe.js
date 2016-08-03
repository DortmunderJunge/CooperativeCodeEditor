(function () {

    // Do not serialize circular references
    // http://stackoverflow.com/a/17773553
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
})();