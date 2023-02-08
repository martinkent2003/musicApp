package main

import (
	"encoding/json"
	"math/rand"
	"net/http"

	"github.com/martinkent2003/Golang-API/entity"
	"github.com/martinkent2003/Golang-API/repository"
	"github.com/martinkent2003/Golang-API/groupRepository"

)

var (
	repo repository.PostRepository = repository.NewPostRepository()
	groupRepo groupRepository.GroupRepository= groupRepository.NewGroupRepository()
)

//posts test run get and add
func getPosts(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-type", "application/json")
	posts, err := repo.FindAll()
	if err != nil {
		resp.WriteHeader(http.StatusInternalServerError)
		resp.Write([]byte(`{"error": "Error gettings the posts"}`))
		return
	}
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(posts)
}

func addPost(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-type", "application/json")
	var post entity.Post
	err := json.NewDecoder(req.Body).Decode(&post)
	if err != nil {
		resp.WriteHeader(http.StatusInternalServerError)
		resp.Write([]byte(`{"error": "Error unmarshalling the posts array"}`))
		return
	}
	post.ID = rand.Int63()
	repo.Save(&post)
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(post)
}

//group get and add

func getGroups(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-type", "application/json")
	groups, err := groupRepo.FindAll()
	if err != nil {
		resp.WriteHeader(http.StatusInternalServerError)
		resp.Write([]byte(`{"error": "Error gettings the groups"}`))
		return
	}
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(groups)
}

func addGroups(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-type", "application/json")
	var group entity.Group
	err := json.NewDecoder(req.Body).Decode(&group)
	if err != nil {
		resp.WriteHeader(http.StatusInternalServerError)
		resp.Write([]byte(`{"error": "Error unmarshalling the groups array"}`))
		return
	}
	groupRepo.Save(&group)
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(group)
}
