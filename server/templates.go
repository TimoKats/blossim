package server

import (
	"html/template"
	"log"
	"net/http"
)

// serve template for home page
func IndexHandler(w http.ResponseWriter, r *http.Request) {
	// parse template at startup
	tmpl := template.Must(template.ParseFiles("web/templates/index.html"))

	// check something...
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		log.Printf("%s returned: 404", r.URL)
		return
	}

	// return template
	w.Header().Set("Content-Type", "text/html")
	err := tmpl.Execute(w, map[string]string{"Owner": "Timo"})
	if err != nil {
		http.Error(w, "error rendering template", http.StatusInternalServerError)
	} else {
		log.Printf("%s returned: index.html", r.URL)
	}
}
