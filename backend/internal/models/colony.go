package models

import "time"

type Colony struct {
	ID          string      `json:"id"`
	OwnerID     string      `json:"owner_id"`
	Name        string      `json:"name"`
	Width       int         `json:"width"`
	Height      int         `json:"height"`
	Cells       [][]Cell    `json:"cells"`
	CreatedAt   time.Time   `json:"created_at"`
	LastUpdate  time.Time   `json:"last_update"`
	TickCount   int64       `json:"tick_count"`
	Resources   Resources   `json:"resources"`
	ActiveDirectives []Directive `json:"active_directives"`
	AutoSave       bool     `json:"auto_save"`
}

type ColonyMetadata struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	OwnerID       string    `json:"owner_id"`
	Width         int       `json:"width"`
	Height        int       `json:"height"`
	CellCount     int       `json:"cell_count"`
	LastUpdate    time.Time `json:"last_update"`
	ThumbnailData []byte    `json:"thumbnail_data"`
}