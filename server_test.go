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

func TestAddUser(t *testing.T) {
	user := entity.User{
		Friends:   []string{"akshatpant3002"},
		LikedSong: []string{"Song1", "Song2"},
		UserID:    "test-sprint4",
		Groups:    []string{"TestingMartinAccount"},
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
	expectedUser := entity.User{}
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUser); err != nil {
		t.Fatal(err)
	}
	if expectedUser.UserID != "test-sprint4" {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.UserID, "test-sprint4")
	}
}
func TestGetUser(t *testing.T) {
	req, err := http.NewRequest("GET", "/userPost/{userID}", nil)
	if err != nil {
		t.Fatal(err)
	}
	vars := map[string]string{"userID": "test-sprint4"}
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
	if expectedUser.UserID != "test-sprint4" {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.UserID, "test-sprint4")
	}
	if expectedUser.Friends == nil {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.Friends, []string{"akshatpant3002"})
	}
	if expectedUser.LikedSong == nil {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.LikedSong, []string{"Song1", "Song2"})
	}
	if expectedUser.Groups == nil {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.Groups, []string{"TestingMartinAccount"})
	}
}

func TestGetAllUsers(t *testing.T) {
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
	expectedUsers := []entity.User{}
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUsers); err != nil {
		t.Fatal(err)
	}
	if len(expectedUsers) != 4 {
		t.Errorf("handler returned unexpected body: got %v want %v", len(expectedUsers), 4)
	}
}

func TestUpdateUser(t *testing.T) {
	user := entity.User{
		Friends:   []string{"akshatpant3002"},
		LikedSong: []string{"Song1", "Song2"},
		UserID:    "test-sprint4",
		Groups:    []string{"TestingTeam"},
	}

	body, err := json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("PUT", "/userPost/{userID}", strings.NewReader(string(body)))
	if err != nil {
		t.Fatal(err)
	}
	vars := map[string]string{"userID": "test-sprint4"}
	req = mux.SetURLVars(req, vars)
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(putUsers)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	expectedUser := entity.User{}
	if err := json.Unmarshal(rr.Body.Bytes(), &expectedUser); err != nil {
		t.Fatal(err)
	}
	if expectedUser.UserID != "test-sprint4" {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.UserID, "test-sprint4")
	}
	if expectedUser.Friends == nil {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.Friends, []string{"akshatpant3002"})
	}
	if expectedUser.LikedSong == nil {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.LikedSong, []string{"Song1", "Song2"})
	}
	if expectedUser.Groups == nil {
		t.Errorf("handler returned unexpected body: got %v want %v", expectedUser.Groups, []string{"TestingMartinAccount"})
	}

}

func TestDeleteUser(t *testing.T) {
	newUser := entity.User{
		Friends:   []string{"akshatpant3002"},
		LikedSong: []string{"Song1", "Song2"},
		UserID:    "test-deleteuser-for-sprint4",
		Groups:    []string{"TestingTeam"},
	}
	body, err := json.Marshal(newUser)
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
	expectedUser := entity.User{}
	json.Unmarshal(rr.Body.Bytes(), &expectedUser)
	if expectedUser.UserID != "test-deleteuser-for-sprint4" {
		t.Errorf("handler returned unexpected body: got %v want user with ID test-deleteuser-for-sprint4",
			expectedUser)
	}
	// Then get all users
	req, err = http.NewRequest("GET", "/userPost", nil)
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
	req1, err1 := http.NewRequest("DELETE", "/userPost/{userID}", nil)
	if err1 != nil {
		t.Fatal(err1)
	}
	vars := map[string]string{"userID": "test-deleteuser-for-sprint4"}
	req1 = mux.SetURLVars(req1, vars)
	rr1 := httptest.NewRecorder()
	handler = http.HandlerFunc(deleteUser)
	handler.ServeHTTP(rr1, req1)
	if status := rr1.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	// Then get all users again
	req, err = http.NewRequest("GET", "/userPost", nil)
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

func TestUpdateUserFriends(t *testing.T) {
	// create a new http request
	user := entity.User{
		UserID:  "test-sprint4",
		Friends: []string{"31furtgoascpojlk76vcalfbyqle", "12153577671"},
	}

	body, err := json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("PUT", "/userUpdateFriends/", strings.NewReader(string(body)))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(updateUserFriends)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := entity.User{}
	json.Unmarshal(rr.Body.Bytes(), &expected)

	if expected.UserID != "test-sprint4" {
		t.Errorf("handler returned unexpected body: got %v want user with friends [akshatpant3002, 31furtgoascpojlk76vcalfbyqle, 12153577671]",
			expected)
	}

}

func TestUpdateUserGroups(t *testing.T) {
	// create a new http request
	user := entity.User{
		UserID: "test-sprint4",
		Groups: []string{"TestingTeam", "4174"},
	}

	body, err := json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("PUT", "/userUpdateGroups/", strings.NewReader(string(body)))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(updateUserGroups)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := entity.User{}
	json.Unmarshal(rr.Body.Bytes(), &expected)

	if expected.UserID != "test-sprint4" {
		t.Errorf("handler returned unexpected body: got %v want user with groups [TestingTeam, 4174, test417, 4172, AMAmerged]",
			expected)
	}

}
