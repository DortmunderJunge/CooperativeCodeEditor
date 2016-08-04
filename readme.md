Der Service zur Authentisierung läuft bereits in der Cloud unter 'http://cooperativecodeeditorapi.azurewebsites.net/', kann aber auch lokal ausgeführt werden (ASP.Net Web API-Projekt).  
        Nur, wenn Api lokal ausgeführt werden sollte:  
            Common/Scripts/AccountService.js API-URL auf localhost umbiegen  
            Login/GitHub-Signin.html API-URL auf localhost umbiegen  

Abschließend den mitgelieferten Webserver im Verzeichnis CooperativeCodeEditor\CooperativeSystems.CodeEditor\CooperativeSystems.CodeEditor.Client starten.  

Möchte man die Binaries nicht im Webroot liegen lassen, kann man sie auch verschieben und den Webroot im ersten Argument übergeben. Ansonsten wird immer das aktuelle Verzeichnis als Webroot angesehen.  

Die Anwendung ist nun unter http://localhost:8080/ zu erreichen.  
 
Getestete Browser:  
    - Google Chrome v 52  
    - Mozilla Firefox v 48  
    - Edge  
    - Internet Explorer 11 - Darstellungsprobleme! Keine vollständige Unterstützung!  
