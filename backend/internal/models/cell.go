package models

type CellType int

const (
	Empty CellType = iota // Пустая клетка - может быть заселена
	Nutrient 							// Клетка с питательными веществами
	Spore 								// Спора - начальная стадия гриба
	Mycelium 							// Мицелий - основная растущая структура
	FruitingBody 					// Плодовое тело - производит споры и ресурсы
	Toxin 								// Токсин - препятствие или защита
)

type CellState struct {
	Health      int     `json:"health"`       // Здоровье клетки (0-100)
	Nutrition   int     `json:"nutrition"`    // Количество питательных веществ
	Toxicity    int     `json:"toxicity"`     // Уровень токсичности
	Age         int     `json:"age"`          // Возраст в тиках симуляции
	Energy      int     `json:"energy"`       // Локальная энергия клетки
	Growth      float64 `json:"growth"`       // Прогресс роста (0.0-1.0)
}

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Cell struct {
	Type        CellType  `json:"type"`
	State       CellState `json:"state"`
	Position    Position  `json:"position"`
	OwnerID     string    `json:"owner_id"`
	LastUpdate  int64     `json:"last_update"`
}