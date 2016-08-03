(function () {
    app.controller('ChatController', function ($scope, $rootScope, SocketService) {

        this.userNameSet = false;

        this.currentMessage = "";

        $rootScope.chatNickName = '';

        $rootScope.alertSound = new Audio('/Common/Sounds/chat-notification.mp3');

        $rootScope.chatAlerts = true;

        $rootScope.hasUnreadMessages = false;

        $rootScope.chatMessages = [];

        // publish a chat message
        this.sendMessage = function () {
            if (this.currentMessage.length > 0) {
                var message = new ChatMessage($rootScope.chatNickName, this.currentMessage, new Date().getTime())
                SocketService.send('newChatMessage', message);

                $rootScope.chatMessages.push(message);
            }
            this.currentMessage = '';
            $('#new-chat-message').focus();
        }

        // set the nicname for this chat-session
        this.setUserName = function () {
            if ($rootScope.chatNickName.length > 0) {
                this.userNameSet = true;
                setTimeout(function () {
                    $('#new-chat-message').on('focus', function () {
                        $rootScope.hasUnreadMessages = false;
                    });
                    $('#new-chat-message').focus();
                }, 100);
            }
        }

        // listen for freshly received chat messages and scroll the chat-window to the bottom.
        // notify the user.
        $rootScope.$watchCollection('chatMessages', function (updated, old) {
            setTimeout(function () {
                if ($("#chat-container")[0]) {
                    $("#chat-container").scrollTop($("#chat-container")[0].scrollHeight);
                }
            }, 100);

            if (!$("#chat-container").is(':focus') && $rootScope.chatAlerts && old !== updated && updated.length > 0 && updated[updated.length - 1].name != $rootScope.chatNickName) {
                $rootScope.hasUnreadMessages = true;
                $rootScope.alertSound.play();
            }
        });
    });
})();