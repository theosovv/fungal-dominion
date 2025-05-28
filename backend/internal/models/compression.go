package models

import "fmt"

type CompressedColony struct {
    ID             string    `json:"id"`
    Metadata       ColonyMetadata `json:"metadata"`
    
    CellData       []byte    `json:"cell_data"`       // Сжатая сетка клеток
    ResourceData   []byte    `json:"resource_data"`   // Сжатое состояние ресурсов
    DirectiveData  []byte    `json:"directive_data"`  // Сжатые директивы
    
    CompressionType string   `json:"compression_type"` // "gzip", "lz4", etc.
    OriginalSize   int64     `json:"original_size"`
    CompressedSize int64     `json:"compressed_size"`
    CompressionRatio float64 `json:"compression_ratio"`
}

type CellGrid struct {
    Width     int           `json:"width"`
    Height    int           `json:"height"`
    
    Cells     map[string]Cell `json:"cells"` // key = "x,y"
    CellCount int           `json:"cell_count"`
    
    CellsByType   map[CellType][]Position `json:"cells_by_type"`
    CellsByOwner  map[string][]Position   `json:"cells_by_owner"`
}

func PositionKey(x, y int) string {
    return fmt.Sprintf("%d,%d", x, y)
}
