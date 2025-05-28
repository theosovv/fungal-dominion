package models

type BasicStats struct {
    TotalCells      int     `json:"total_cells"`      // Общее количество клеток
    ActiveCells     int     `json:"active_cells"`     // Живые клетки
    Territory       int     `json:"territory"`        // Занимаемая площадь
    Density         float64 `json:"density"`          // Плотность заселения (0.0-1.0)
    Age             int64   `json:"age"`              // Возраст в тиках
    Uptime          float64 `json:"uptime"`           // Процент времени активности
    CellDistribution map[CellType]int `json:"cell_distribution"`
    BoundingBox     Area    `json:"bounding_box"`     // Ограничивающий прямоугольник
    CenterOfMass    Position `json:"center_of_mass"`  // Центр масс колонии
    Perimeter       int     `json:"perimeter"`        // Периметр (граничные клетки)
    ConnectedComponents int     `json:"connected_components"` // Количество отдельных групп
    LargestComponent    int     `json:"largest_component"`    // Размер крупнейшей группы
    Fragmentation      float64 `json:"fragmentation"`        // Степень фрагментации
}
