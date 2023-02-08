package entity

type User struct {
	Friends   string `json:"Friends"`
	LikedSong string `json:"LikedSong"`
	UserID    string `json:"UserID"`
}
