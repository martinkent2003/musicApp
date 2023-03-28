package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const (
	port string = ":8000"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", func(response http.ResponseWriter, request *http.Request) {
		fmt.Fprintln(response, "Router is running...")
	})

	router.HandleFunc("/groupPost", getGroups).Methods("GET")
	router.HandleFunc("/groupPost", addGroups).Methods("POST", "OPTIONS")
	router.HandleFunc("/groupPost/{groupID}", getGroup).Methods("GET")
	router.HandleFunc("/groupPost/{groupID}", deleteGroup).Methods("DELETE")
	router.HandleFunc("/userPost", addUsers).Methods("POST")
	router.HandleFunc("/userPost", putUsers).Methods("PUT")

	router.HandleFunc("/userPost/{userID}", getUser).Methods("GET")
	router.HandleFunc("/userPost", getUsers).Methods("GET")
	router.HandleFunc("/userPost", addUsers).Methods("POST", "OPTIONS")
	router.HandleFunc("/userPost/{userID}", deleteUser).Methods("DELETE")

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Print("Server listening on port: ", port)
	log.Fatalln(http.ListenAndServe(port, handlers.CORS(headers, methods, origins)(router)))
}
