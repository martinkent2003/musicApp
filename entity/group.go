package entity

type Group struct {
	GroupID     string             `json:"groupID"`
	Users       []string           `json:"users"`
	PlaylistID  string             `json:"playlistID"`
	SemiMatched map[string]float64 `json:"semiMatched"`
	Matched     map[string]float64 `json:"matched"`
}
