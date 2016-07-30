package main

import (
	"io"
	"net/http"

	"golang.org/x/net/websocket"
)

func echoHandler(ws *websocket.Conn) {
	io.Copy(ws, ws)
}

func main() {
	//http.Handle("/ws", websocket.Handler(echoHandler))

	server := NewServer("/ws")
	go server.Listen()

	http.Handle("/", http.FileServer(http.Dir("assets")))
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}

type Message struct {
	client uint
	CurPos CursorPosition `json:"curPos"`
	Data   string         `json:"data"`
}

type CursorPosition struct {
	Row    uint `json:"row"`
	Column uint `json:"column"`
}
