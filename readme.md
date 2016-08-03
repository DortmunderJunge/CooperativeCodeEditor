Der Service zur Authentisierung läuft bereits in der Cloud unter 'http://cooperativecodeeditorapi.azurewebsites.net/', kann aber auch lokal ausgeführt werden (ASP.Net Web API-Projekt).
        Nur, wenn Api lokal ausgeführt werden sollte: 
            Common/Scripts/AccountService.js API-URL auf localhost umbiegen
            Login/GitHub-Signin.html API-URL auf localhost umbiegen


Anschließend den WebSocket-Forwarder-Service starten. Dazu im Ordner CooperativeCodeEditor\go-backend die dem System entsprechende *.exe ausführen. Der WebSocket-Forwarder belegt HTTP-Port 8081

Abschließend einen lokalen Webserver im Verzeichnis CooperativeCodeEditor\CooperativeSystems.CodeEditor\CooperativeSystems.CodeEditor.Client laufen lassen starten. Unbedingt HTTP-Port 8080 verwenden!


Die Anwendung ist nun unter http://localhost:8080/Home/ zu erreichen.