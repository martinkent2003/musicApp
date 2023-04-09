package entity

/*
Model for a group object, which holds:
- a unique GroupID string for identification
- a slice of strings which holds userIDs for users in the group
- a playlistID string which stores the ID for the playlist made by the group
- a map named SemiMatched which contains stores song IDs for they key, and the ratio of
users in the group who like the song divided by the number of users in the group
- a map named Matched which contains stores song IDs for they key, and the ratio of
users in the group who like the song divided by the number of users in the group
- when the ratio of likes/users in SemiMatched goes above a certain threshold, the song is
removed from SemiMatched and added to Matched, meaning a significant amount of users in the
group like the song.
*/
type Group struct {
	GroupID     string             `json:"groupID"`
	Users       []string           `json:"users"`
	PlaylistID  string             `json:"playlistID"`
	SemiMatched map[string]float64 `json:"semiMatched"`
	Matched     []string           `json:"matched"`
}
