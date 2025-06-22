package main

import (
	"fmt"
	"log"
	"net/http"

	server "github.com/TimoKats/blossim/server"
)

func main() {
	// serve files
	fs := http.FileServer(http.Dir("web/static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Define routes
	http.HandleFunc("/api/ping", server.PingHandler)
	http.HandleFunc("/", server.IndexHandler)

	// start the server
	fmt.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
