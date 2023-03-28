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

// projectID and collectionName for groups in Firebase
const (
	projectId      string = "vibeshare-c2a22"
	collectionName string = "groups"
)

type GroupRepository interface {
	Save(group *entity.Group) (*entity.Group, error)
	FindAll() ([]entity.Group, error)
	FindGroup(id string) (*entity.Group, error)
	DeleteGroup(groupID string) error
}

type groupRepo struct{}

// newGroupPostRepository
func NewGroupRepository() GroupRepository {
	return &groupRepo{}
}

/*
The Save method in GroupRepostitory takes a group object input
and adds the group to the group collection in the firestore database
*/
func (*groupRepo) Save(group *entity.Group) (*entity.Group, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()
	_, _, err = client.Collection(collectionName).Add(ctx, map[string]interface{}{
		"GroupID":     group.GroupID,
		"Users":       group.Users,
		"PlaylistID":  group.PlaylistID,
		"SemiMatched": group.SemiMatched,
		"Matched":     group.Matched,
	})

	if err != nil {
		log.Fatalf("Failed addding a new group: %v", err)
		return nil, err
	}
	return group, nil
}

/*
The FindAll method in GroupRepository takes no input and returns a string of
group objects which are collected from the groups collection in firebase.This method
uses the convertToStringSlice and convertToMap functions to convert the interface type
used by firebase into slices and maps that match the type of the fields in the group model.
*/
func (*groupRepo) FindAll() ([]entity.Group, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()
	var groups []entity.Group
	itr := client.Collection(collectionName).Documents(ctx)
	for {
		doc, err := itr.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Failed to iterate the groups: %v", err)
			return nil, err
		}
		users, _ := convertToStringSlice(doc.Data()["Users"])
		semiMatched, _ := convertToMap(doc.Data()["SemiMatched"])
		matched, _ := convertToMap(doc.Data()["Matched"])
		group := entity.Group{
			GroupID:     doc.Data()["GroupID"].(string),
			Users:       users,
			PlaylistID:  doc.Data()["PlaylistID"].(string),
			SemiMatched: semiMatched,
			Matched:     matched,
		}
		groups = append(groups, group)
	}
	return groups, nil
}

/*
The FindGroup method in GroupRepository takes in a groupID input and then searches
the collection of groups in firestore to check for matching ID. Then it returns a
group object with the contents of the correspoding document in firestore. However,
since the groupID is already known as it is used to search, the returned object groupID
is the document ID for the group in firebase.
*/
func (*groupRepo) FindGroup(groupID string) (*entity.Group, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Fatalf("Failed to create a Firestore Client: %v", err)
		return nil, err
	}
	defer client.Close()

	q := client.Collection("groups").Where("GroupID", "==", groupID)
	snap, err := q.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	if len(snap) == 0 {
		return nil, errors.New("user not found")
	}

	var group entity.Group
	snap[0].DataTo(&group)
	group.GroupID = snap[0].Ref.ID

	return &group, nil
}

func (*groupRepo) DeleteGroup(groupID string) error {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		return err
	}

	defer client.Close()

	q := client.Collection("groups").Where("GroupID", "==", groupID)
	snap, err := q.Documents(ctx).GetAll()
	if err != nil {
		return err
	}

	if len(snap) == 0 {
		return errors.New("group not found")
	}

	_, err = snap[0].Ref.Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}

// convertToStringSlice converts an interface{} to a []string slice
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

// convertToMap converts an interface{} to a map with a string key and float value
func convertToMap(val interface{}) (map[string]float64, error) {
	if val == nil {
		return nil, nil
	}
	if data, ok := val.(map[string]interface{}); ok {
		result := make(map[string]float64)
		for k, v := range data {
			if floatVal, ok := v.(float64); ok {
				result[k] = floatVal
			} else {
				return nil, fmt.Errorf("invalid value type for key %s: expected float64, got %T", k, v)
			}
		}
		return result, nil
	}
	return nil, fmt.Errorf("invalid value type: expected map[string]interface{}, got %T", val)
}
