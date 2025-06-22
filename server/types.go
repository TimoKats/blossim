package server

// Define a struct for the response
type Response struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}
