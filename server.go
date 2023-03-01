package main

import (
	"fmt"
	"log"
	"net/http"

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
	router.HandleFunc("/groupPost", addGroups).Methods("POST")
	router.HandleFunc("/groupPost/{groupID}", getGroup).Methods("GET")
	router.HandleFunc("/userPost/{userID}", getUser).Methods("GET")
	router.HandleFunc("/userPost", getUsers).Methods("GET")
	router.HandleFunc("/userPost", addUsers).Methods("POST")
	log.Print("Server listening on port: ", port)
	log.Fatalln(http.ListenAndServe(port, router))
}
