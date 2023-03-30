package main

import (
	"Golang-API/entity"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/mux"
)

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
	if len(expectedGroups) != 2 {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), "[]")
	}
}

func TestGetGroup(t *testing.T) {
	req, err := http.NewRequest("GET", "/groupPost/{groupID}", nil)
	if err != nil {
		t.Fatal(err)
	}
	vars := map[string]string{"groupID": "test-group"}
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
	if expectedGroup.GroupID != "3przdQi28dDSfBMNqxZM" {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), `{"groupID":"3przdQi28dDSfBMNqxZM","users":["user1","user2"],"playlistID":"test-playlist","semiMatched":{"user1":0.5,"user2":0.7},"matched":{"user1":131.4,"user2":0.9}}`)
	}
}

func TestAddGroups(t *testing.T) {
	group := entity.Group{
		GroupID:     "test-groupforsprint3",
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
	if expected.GroupID != "test-groupforsprint3" {
		t.Errorf("handler returned unexpected body: got %v want group with ID test-groupforsprint3",
			expected)
	}
}

func TestDeleteGroup(t *testing.T) {
	//first get all the groups
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

	//then delete one of them
	req1, err1 := http.NewRequest("DELETE", "/groupPost/{groupID}", nil)
	if err1 != nil {
		t.Fatal(err1)
	}
	vars := map[string]string{"groupID": "test-groupforsprint3"}
	req1 = mux.SetURLVars(req1, vars)
	rr1 := httptest.NewRecorder()
	handler = http.HandlerFunc(deleteGroup)
	handler.ServeHTTP(rr1, req1)
	if status := rr1.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	//then get all the groups again
	req, err = http.NewRequest("GET", "/groupPost", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	handler = http.HandlerFunc(getGroups)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedGroupsAfterDelete := make([]entity.Group, 0)
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedGroupsAfterDelete); err != nil {
		t.Fatal(err)
	}
	//then check the length is one less
	if len(expectedGroups)-len(expectedGroupsAfterDelete) != 1 {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), "[]")
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
	if expectedUser.UserID != "HvnU54NHGgvWiU8zjaF5" {
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
	if len(expectedUsers) != 6 {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), "[]")
	}
}

func TestAddUser(t *testing.T) {
	user := entity.User{
		Friends:    []string{"user1", "user2"},
		LikedSong:  []string{"song1", "song2"},
		UserID:     "test-user-for-sprint3",
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
	if expected.UserID != "test-user-for-sprint3" {
		t.Errorf("handler returned unexpected body: got %v want user with ID test-user",
			expected)
	}
}

func TestDeleteUser(t *testing.T) {
	// First add a new user to the system
	newUser := entity.User{
		UserID:     "test-user-for-sprint3",
		Friends:    []string{"user1", "user2"},
		LikedSong:  []string{"song1", "song2"},
		GroupAdmin: map[string]bool{"group1": true, "group2": true},
	}
	body, err := json.Marshal(newUser)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/user", strings.NewReader(string(body)))
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

	expectedUser := entity.User{}
	json.Unmarshal(rr.Body.Bytes(), &expectedUser)
	if expectedUser.UserID != "test-user-for-sprint3" {
		t.Errorf("handler returned unexpected body: got %v want user with ID test-user-for-sprint3",
			expectedUser)
	}

	// Then get all users
	req, err = http.NewRequest("GET", "/user", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	handler = http.HandlerFunc(getUsers)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedUsers := make([]entity.User, 0)
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUsers); err != nil {
		t.Fatal(err)
	}

	// Then delete the added user
	req1, err1 := http.NewRequest("DELETE", "/user/{userID}", nil)
	if err1 != nil {
		t.Fatal(err1)
	}
	vars := map[string]string{"userID": "test-user-for-sprint3"}
	req1 = mux.SetURLVars(req1, vars)
	rr1 := httptest.NewRecorder()
	handler = http.HandlerFunc(deleteUser)
	handler.ServeHTTP(rr1, req1)
	if status := rr1.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Then get all users again
	req, err = http.NewRequest("GET", "/user", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	handler = http.HandlerFunc(getUsers)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedUsersAfterDelete := make([]entity.User, 0)
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUsersAfterDelete); err != nil {
		t.Fatal(err)
	}

	// Check if the user was actually deleted
	if len(expectedUsersAfterDelete) != len(expectedUsers)-1 {
		t.Errorf("handler returned unexpected body: got %v want %v",
			len(expectedUsersAfterDelete), len(expectedUsers)-1)
	}
}

func TestPutUser(t *testing.T) {
	// First add a new user to the system
	user := entity.User{
		Friends:    []string{"user1", "user2"},
		LikedSong:  []string{"song1", "song2"},
		UserID:     "test-user-for-sprint3PUT",
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
	if expected.UserID != "test-user-for-sprint3PUT" {
		t.Errorf("handler returned unexpected body: got %v want user with ID test-user",
			expected)
	}

	//Now update the user
	user.LikedSong = []string{"song3", "song4"}
	body, err = json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}
	req, err = http.NewRequest("PUT", "/userPost", strings.NewReader(string(body)))
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	handler = http.HandlerFunc(putUsers)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	//expected = entity.User{}
	//json.Unmarshal(rr.Body.Bytes(), &expected)

	//Now get the user and make sure the changes were made (checking liked songs)
	req, err = http.NewRequest("GET", "/userPost/{userID}", nil)
	if err != nil {
		t.Fatal(err)
	}
	vars := map[string]string{"userID": "test-user-for-sprint3PUT"}
	req = mux.SetURLVars(req, vars)
	rr = httptest.NewRecorder()
	handler = http.HandlerFunc(getUser)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedUser := entity.User{}
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUser); err != nil {
		t.Fatal(err)
	}
	if expectedUser.LikedSong[0] != "song3" {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), `{"friends":["test","martin","example"],"likedSong":["test","i like this song"],"userID":"ADkvh36eR6MKlBQSJyzy","groupAdmin":{"group1":true,"group2":true}}`)
	}
}
