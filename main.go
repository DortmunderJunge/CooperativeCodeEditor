package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"

	"github.com/GeertJohan/go.rice"
)

func main() {

	http.Handle("/", http.FileServer(rice.MustFindBox("CooperativeSystems.CodeEditor.Client").HTTPBox()))
	go http.ListenAndServe(":8080", nil)

	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", "http://localhost:8080/home/").Run()
	case "darwin":
		err = exec.Command("open", "http://localhost:8080/home/").Run()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", "http://localhost:8080/home/").Run()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Println(err)
		fmt.Println("Open: http://localhost:8080/home/")
	}
	for {
		time.Sleep(time.Minute)
	}
}
