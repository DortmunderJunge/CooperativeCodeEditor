(function() {
    window.ChatMessage = function(sender, text, time) {
        this.name = sender;
        this.text = text;
        this.time = time;
    }
})();