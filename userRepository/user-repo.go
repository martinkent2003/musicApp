package groupRepository

import (
	"context"
	"errors"
	"fmt"
	"log"

	"Golang-API/entity"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const (
	projectId      string = "vibeshare-c2a22"
	collectionName string = "users"
)

type UserRepository interface {
	Save(user *entity.User) (*entity.User, error)
	Update(user *entity.User) (*entity.User, error)
	FindAll() ([]entity.User, error)
	FindUser(userID string) (*entity.User, error)
	DeleteUser(userID string) error
}

type userRepo struct{}

// newUserRepository
func NewUserRepository() UserRepository {
	return &userRepo{}
}

// saves a new user to the database
func (*userRepo) Save(user *entity.User) (*entity.User, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()

	q := client.Collection("users").Where("UserID", "==", user.UserID)
	snap, err := q.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	if len(snap) != 0 {
		return nil, errors.New("duplicate user found")
	}

	_, _, err = client.Collection(collectionName).Add(ctx, map[string]interface{}{
		"Friends":    user.Friends,
		"LikedSong":  user.LikedSong,
		"GroupAdmin": user.GroupAdmin,
		"UserID":     user.UserID,
		"Groups":     user.Groups,
	})

	if err != nil {
		log.Fatalf("Failed addding a new user: %v", err)
		return nil, err
	}
	return user, nil
}

func (*userRepo) Update(user *entity.User) (*entity.User, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()

	q := client.Collection("users").Where("UserID", "==", user.UserID)
	snap, err := q.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	if len(snap) == 0 {
		log.Fatalf("Pre-existing user not found: %v", err)
		return nil, err
	}

	// Create a map to hold the fields to update
	updateFields := make(map[string]interface{})

	// Update only the fields provided in the user entity

	if user.Friends != nil {
		updateFields["Friends"] = user.Friends
	}
	if user.LikedSong != nil {
		updateFields["LikedSong"] = user.LikedSong
	}

	if user.GroupAdmin != nil {
		updateFields["GroupAdmin"] = user.GroupAdmin
	}
	if user.Groups != nil {
		updateFields["Groups"] = user.Groups
	}

	// Update the user document with the provided fields
	_, err = client.Collection("users").Doc(snap[0].Ref.ID).Set(ctx, updateFields, firestore.MergeAll)

	if err != nil {
		log.Fatalf("Failed updating the user: %v", err)
		return nil, err
	}

	return user, nil
}

// function to find a specific user with specified userID
func (*userRepo) FindUser(userID string) (*entity.User, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		return nil, err
	}

	defer client.Close()

	q := client.Collection("users").Where("UserID", "==", userID)
	snap, err := q.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	if len(snap) == 0 {
		return nil, errors.New("user not found")
	}

	var user entity.User
	snap[0].DataTo(&user)
	user.UserID = snap[0].Ref.ID

	return &user, nil
}

func (*userRepo) FindAll() ([]entity.User, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()
	var users []entity.User
	itr := client.Collection(collectionName).Documents(ctx)
	for {
		doc, err := itr.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Failed to iterate the users: %v", err)
			return nil, err
		}
		friends, _ := convertToStringSlice(doc.Data()["Friends"])
		likedSongs, _ := convertToStringSlice(doc.Data()["LikedSong"])
		groupAdmin, _ := convertToMap(doc.Data()["GroupAdmin"])
		groups, _ := convertToStringSlice(doc.Data()["Groups"])

		user := entity.User{
			Friends:    friends,
			LikedSong:  likedSongs,
			GroupAdmin: groupAdmin,
			UserID:     doc.Data()["UserID"].(string),
			Groups:     groups,
		}
		users = append(users, user)
	}
	return users, nil
}

// deletes existing user document with giver UserID
func (*userRepo) DeleteUser(userID string) error {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		return err
	}

	defer client.Close()

	q := client.Collection("users").Where("UserID", "==", userID)
	snap, err := q.Documents(ctx).GetAll()
	if err != nil {
		return err
	}

	if len(snap) == 0 {
		return errors.New("user not found")
	}

	_, err = snap[0].Ref.Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}

// convertToStringSlice converts an interface{} slice to a []string slice
func convertToStringSlice(slice interface{}) ([]string, error) {
	// type assertion to []interface{}
	iSlice, ok := slice.([]interface{})
	if !ok {
		return nil, fmt.Errorf("input is not a []interface{}")
	}
	// create the []string slice
	sSlice := make([]string, len(iSlice))
	for i, v := range iSlice {
		// type assertion to string
		s, ok := v.(string)
		if !ok {
			return nil, fmt.Errorf("element %d is not a string", i)
		}
		sSlice[i] = s
	}
	return sSlice, nil
}

/*
convertToMap converts an interface{} map to a map[string]bool map
It returns an error if the input is not a map[string]interface{} or if any of the values are not bools
*/
func convertToMap(val interface{}) (map[string]bool, error) {
	if val == nil {
		return nil, nil
	}
	if data, ok := val.(map[string]interface{}); ok {
		result := make(map[string]bool)
		for k, v := range data {
			if boolVal, ok := v.(bool); ok {
				result[k] = boolVal
			} else {
				return nil, fmt.Errorf("invalid value type for key %s: expected bool, got %T", k, v)
			}
		}
		return result, nil
	}
	return nil, fmt.Errorf("invalid value type: expected map[string]interface{}, got %T", val)
}
