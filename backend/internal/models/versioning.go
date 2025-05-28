package models

import "time"

type SavedGame struct {
    ID          string    `json:"id"`
    PlayerID    string    `json:"player_id"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    
    Version     string    `json:"version"`     // Версия игры
    FormatVersion int     `json:"format_version"` // Версия формата сохранения
    
    CreatedAt   time.Time `json:"created_at"`
    LastPlayed  time.Time `json:"last_played"`
    PlayTime    int64     `json:"play_time"`   // Время игры в секундах
    
    CurrentSnapshot string   `json:"current_snapshot"`
    Snapshots      []string  `json:"snapshots"`        // ID всех снэпшотов
    
    MaxCells       int       `json:"max_cells"`
    TotalTicks     int64     `json:"total_ticks"`
    Achievements   []string  `json:"achievements"`
    
    IsCorrupted    bool      `json:"is_corrupted"`
    NeedsMigration bool      `json:"needs_migration"`
}

type MigrationRule struct {
    FromVersion string `json:"from_version"`
    ToVersion   string `json:"to_version"`
    Converter   string `json:"converter"`   // Имя функции-конвертера
    Description string `json:"description"`
}
