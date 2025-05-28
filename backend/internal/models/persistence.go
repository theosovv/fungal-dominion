package models

import "time"

type GameSnapshot struct {
    ID          string    `json:"id"`
    ColonyID    string    `json:"colony_id"`
    Version     int       `json:"version"`     // Версия формата данных
    Timestamp   time.Time `json:"timestamp"`
    
    Colony      Colony    `json:"colony"`
    Metadata    map[string]interface{} `json:"metadata"`
    
    IsCompressed bool      `json:"is_compressed"`
    Checksum     string    `json:"checksum"`
    Size         int64     `json:"size"`        // Размер в байтах
}

type IncrementalSave struct {
    ID          string    `json:"id"`
    BaseSnapshot string   `json:"base_snapshot"` // ID базового снэпшота
    TickCount   int64     `json:"tick_count"`
    
    CellChanges []CellChange `json:"cell_changes"`
    ResourceChanges ResourceTransaction `json:"resource_changes"`
    DirectiveChanges []DirectiveChange `json:"directive_changes"`
    
    Timestamp   time.Time `json:"timestamp"`
}

type CellChange struct {
    Position Position `json:"position"`
    OldCell  Cell     `json:"old_cell"`
    NewCell  Cell     `json:"new_cell"`
    ChangeType string `json:"change_type"` // "created", "modified", "destroyed"
}

type DirectiveChange struct {
    DirectiveID string          `json:"directive_id"`
    ChangeType  string          `json:"change_type"` // "created", "updated", "completed", "cancelled"
    OldState    *Directive      `json:"old_state,omitempty"`
    NewState    *Directive      `json:"new_state,omitempty"`
}
