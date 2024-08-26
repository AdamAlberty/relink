package types

type Link struct {
	Id          int    `json:"id"`
	Shortpath   string `json:"shortpath"`
	Domain      string `json:"domain"`
	Destination string `json:"destination"`
}
