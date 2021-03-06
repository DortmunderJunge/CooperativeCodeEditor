package main

import (
	"flag"
	"net/http"
	"strings"
)

var m = make(map[string]http.Handler)

func main() {
	flag.Parse()
	dir := flag.Arg(0)
	if dir == "" {
		dir = "."
	}

	http.HandleFunc("/ws/", wsHandler)
	http.Handle("/", http.FileServer(http.Dir(dir)))

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	session := strings.TrimPrefix(r.URL.String(), "/ws/")
	h, ok := m[session]
	if !ok {
		server := NewServer(session)
		h = server.Handler()
		go server.Listen()
	}
	h.ServeHTTP(w, r)
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
