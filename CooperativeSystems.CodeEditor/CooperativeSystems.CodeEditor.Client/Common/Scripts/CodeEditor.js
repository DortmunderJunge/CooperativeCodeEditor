(function() {
    window.editor = ace.edit("code-editor");
    window.editor.setTheme("ace/theme/vibrant_ink");
    window.editor.getSession().setMode("ace/mode/javascript");
})();