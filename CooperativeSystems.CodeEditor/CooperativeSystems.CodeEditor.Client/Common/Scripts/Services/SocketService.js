(function () {
    app.factory('SocketService', ['$rootScope', function ($rootScope) {

        var socket = null;

        // wait for sessionId to be set. then initialize socket.
        var handle = setInterval(function () {
            if ($rootScope.sessionId) {
                socket = new WebSocket("ws://localhost:8080/ws/" + $rootScope.sessionId);
                socket.onmessage = onMessage;
                clearInterval(handle);
            }
        }, 250);



        // this function is called each time a message arrives through the websocket
        var onMessage = function (message) {
            var emptyObject = JSON.stringify({ "data": JSON.stringify({ "data": null }) });
            var data = JSON.parse(JSON.parse(message.data).data || JSON.parse(emptyObject).data);
            console.log("receive data");
            console.log(data);

            if (data) {
                var action = data.action;

                // switch an action to trigger according to the message's action
                switch (action) {

                    // apply someone else's changes to the document
                    case 'editText': {
                        var editor = data.value.editor;
                        var hash = data.value.currentContentHash;
                        if (editor !== $rootScope.editorId && hash !== ace.getSession().getValue().hashCode()) { //ignore my changes.
                            ace.getSession().getDocument().applyDelta(JSON.parse(data.value.data));
                        }
                        break;
                    }

                    // the document-file was changed
                    case 'changeDocument': {
                        var document = data.value;
                        $rootScope.activeDocument = document;
                        $rootScope.$apply();
                        break;
                    }

                    // a new client requested the current document's content
                    case 'requestCurrentContent': {
                        var senderId = JSON.parse(data.value).replyTo;
                        var document = $.extend(true, {}, $rootScope.activeDocument);
                        document.content = $rootScope.fileContent;

                        // manually implement send() and sendSafe() as they are inaccessible from within the onmessage-listener
                        var reply = {
                            data: {
                                action: 'replyCurrentContent',
                                value: JSON.stringify({
                                    forId: senderId,
                                    document: document,
                                }),
                            },
                        };
                        reply.data = JSON.stringifySafe(reply.data);
                        reply = JSON.stringifySafe(reply);
                        if (this.readyState !== 1) {
                            var handle = setInterval(function () {
                                if (this.readyState == 1) {
                                    this.send(reply);
                                    clearInterval(reply);
                                }
                            }, 500);
                        } else {
                            this.send(reply);
                        }
                        break;
                    }

                    // answer to a request for current document's content
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

                    // someone sent a new chatmessage
                    case 'newChatMessage': {
                        if ($rootScope.chatMessages) {
                            $rootScope.chatMessages.push(new ChatMessage(data.value.name, data.value.text, data.value.time));
                            $rootScope.$apply();
                        }
                    }
                }
            }
        }

        // Wait for websocket to have readyState == 1 ==> connected to the server.
        // Then send data.
        var sendSafe = function (dataString) {
            if (!socket || socket.readyState !== 1) {
                var handle = setInterval(function () {
                    if (socket && socket.readyState == 1) {
                        socket.send(dataString);
                        clearInterval(handle);
                    }
                }, 500);
            } else {
                socket.send(dataString);
            }
        };
        return {

            // action to identify the 'type' of data e.g. it is a document-change or a new chat message
            send: function (action, data) {
                // proper encapsulating of data for the server
                var data = {
                    data: {
                        action: action,
                        value: data,
                    },
                };
                data.data = JSON.stringifySafe(data.data);
                data = JSON.stringifySafe(data);
                sendSafe(data);
            },
        };
    }]);
})();