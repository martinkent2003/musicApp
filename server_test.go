package main

import (
	"Golang-API/entity"
	"strings"

	//groupRepository "Golang-API/groupRepository"
	//userRepository "Golang-API/userRepository"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

/*
var (
	groupRepo groupRepository.GroupRepository = groupRepository.NewGroupRepository()
	userRepo  userRepository.UserRepository   = userRepository.NewUserRepository()
)
*/

func TestGetGroups(t *testing.T) {
	req, err := http.NewRequest("GET", "/groupPost", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getGroups)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedGroups := make([]entity.Group, 0)
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedGroups); err != nil {
		t.Fatal(err)
	}
	if len(expectedGroups) != 12 {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), "[]")
	}
}

func TestGetGroup(t *testing.T) {
	req, err := http.NewRequest("GET", "/groupPost/{groupID}", nil)
	if err != nil {
		t.Fatal(err)
	}
	vars := map[string]string{"groupID": "testingFindGroup3123butdifferent"}
	req = mux.SetURLVars(req, vars)
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getGroup)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedGroup := entity.Group{}
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedGroup); err != nil {
		t.Fatal(err)
	}
	if expectedGroup.GroupID != "Gqx2KQUAD5Ww4jv08PHH" {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), `{"groupID":"Gqx2KQUAD5Ww4jv08PHH","users":["users in group","userA","userB"],"playlistID":"thisisthepID","semiMatched":{"secondID":2.23,"songID":1},"matched":{"secondID":131.4,"songID":23.3}}`)
	}
}

func TestAddGroups(t *testing.T) {
	group := entity.Group{
		GroupID:     "test-group",
		Users:       []string{"user1", "user2"},
		PlaylistID:  "test-playlist",
		SemiMatched: map[string]float64{"user1": 0.5, "user2": 0.7},
		Matched:     map[string]float64{"user1": 0.8, "user2": 0.9},
	}

	body, err := json.Marshal(group)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/groupPost", strings.NewReader(string(body)))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(addGroups)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := entity.Group{}
	json.Unmarshal(rr.Body.Bytes(), &expected)
	if expected.GroupID != "test-group" {
		t.Errorf("handler returned unexpected body: got %v want group with ID 1",
			expected)
	}
}

func TestGetUser(t *testing.T) {
	req, err := http.NewRequest("GET", "/userPost/{userID}", nil)
	if err != nil {
		t.Fatal(err)
	}
	vars := map[string]string{"userID": "123"}
	req = mux.SetURLVars(req, vars)
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getUser)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedUser := entity.User{}
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUser); err != nil {
		t.Fatal(err)
	}
	if expectedUser.UserID != "ADkvh36eR6MKlBQSJyzy" {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), `{"friends":["test","martin","example"],"likedSong":["test","i like this song"],"userID":"ADkvh36eR6MKlBQSJyzy","groupAdmin":{"group1":true,"group2":true}}`)
	}
}

func TestGetUsers(t *testing.T) {
	req, err := http.NewRequest("GET", "/userPost", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getUsers)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedUsers := make([]entity.User, 0)
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUsers); err != nil {
		t.Fatal(err)
	}
	if len(expectedUsers) != 9 {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), "[]")
	}
}

func TestAddUser(t *testing.T) {
	user := entity.User{
		Friends:    []string{"user1", "user2"},
		LikedSong:  []string{"song1", "song2"},
		UserID:     "test-user",
		GroupAdmin: map[string]bool{"group1": true, "group2": true},
	}

	body, err := json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/userPost", strings.NewReader(string(body)))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(addUsers)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := entity.User{}
	json.Unmarshal(rr.Body.Bytes(), &expected)
	if expected.UserID != "test-user" {
		t.Errorf("handler returned unexpected body: got %v want user with ID test-user",
			expected)
	}
}
