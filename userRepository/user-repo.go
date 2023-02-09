package groupRepository

import (
	"context"
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
	FindAll() ([]entity.User, error)
}

type userRepo struct{}

// newUserRepository
func NewUserRepository() UserRepository {
	return &userRepo{}
}

func (*userRepo) Save(user *entity.User) (*entity.User, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()
	_, _, err = client.Collection(collectionName).Add(ctx, map[string]interface{}{
		"Friends":   user.Friends,
		"LikedSong": user.LikedSong,
		"UserID":    user.UserID,
	})

	if err != nil {
		log.Fatalf("Failed addding a new user: %v", err)
		return nil, err
	}
	return user, nil
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
		user := entity.User{
			Friends:   doc.Data()["Friends"].(string),
			LikedSong: doc.Data()["LikedSong"].(string),
			UserID:    doc.Data()["UserID"].(string),
		}
		users = append(users, user)
	}
	return users, nil
}
