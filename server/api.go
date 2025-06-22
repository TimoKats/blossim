package server

import (
	"encoding/json"
	"log"
	"net/http"
)

// health check endpoint
func PingHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Message: "pong",
		Status:  http.StatusOK,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
	log.Printf("%s returned: %v", r.URL, response)
}
