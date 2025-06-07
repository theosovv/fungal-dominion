package models

import "time"

type MessageType string

const (
	SessionCreated MessageType = "session_created"
	Pong MessageType = "pong"
	ColonyState MessageType = "colony_state"
	ColonyUpdated MessageType = "colony_updated"
)

type GameMessage struct {
	Type      MessageType      `json:"type"`
	SessionID string      `json:"session_id,omitempty"`
	Data      interface{} `json:"data,omitempty"`
	Timestamp time.Time   `json:"timestamp"`
}
