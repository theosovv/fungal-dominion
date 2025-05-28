package models

import (
	"fmt"
	"time"
)

type ChunkedColony struct {
	Colony
	ChunkSize    int                    `json:"chunk_size"`
	Chunks       map[string]*Chunk      `json:"chunks"`
	ActiveChunks []string               `json:"active_chunks"`
	LoadedChunks map[string]time.Time   `json:"loaded_chunks"`
}

type Chunk struct {
	X     		int      `json:"x"`
	Y      		int      `json:"y"`
	Cells     [][]Cell `json:"cells"`
	IsActive  bool     `json:"is_active"`
	IsDirty   bool     `json:"is_dirty"`
	LastAccess time.Time `json:"last_access"`
	CellCount int      `json:"cell_count"`
}

func ChunkKey(x, y int) string {
	return fmt.Sprintf("%d,%d", x, y)
}