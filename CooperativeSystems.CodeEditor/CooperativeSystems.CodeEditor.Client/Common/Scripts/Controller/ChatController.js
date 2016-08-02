(function () {
    app.controller('ChatController', function ($scope, $rootScope) {

        this.userNameSet = false;

        this.currentMessage = "";

        this.userName = '';

        $rootScope.chatMessages = [];

        this.sendMessage = function () {
            if (this.currentMessage.length > 0) {
                var data = {
                    data: {
                        action: 'newChatMessage',
                        value: {
                            name: this.userName,
                            text: this.currentMessage,
                            time: new Date().getTime(),
                        }
                    },
                };

                $rootScope.chatMessages.push(data.data.value);

                data.data = JSON.stringifySafe(data.data);
                data = JSON.stringifySafe(data);
                $rootScope.socket.send(data);
            }
            this.currentMessage = '';
            $('#new-chat-message').focus();
        }

        this.setUserName = function () {
            if (this.userName.length > 0) {
                this.userNameSet = true;
                setTimeout(function () {
                    $('#new-chat-message').focus();
                }, 100);

            }
        }

        $rootScope.$watchCollection('chatMessages', function (old, updated) {
            setTimeout(function () {
                $("#chat-container").scrollTop($("#chat-container")[0].scrollHeight);
            }, 100);
        });
    });
})();