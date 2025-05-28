package models

type MyceliumProperties struct {
	Connections []Position `json:"connections"` // Связи с соседними клетками
	Density     float64    `json:"density"`     // Плотность сети (влияет на эффективность)
	BranchCount int        `json:"branch_count"` // Количество отростков
}

type SporeProperties struct {
	Maturity     float64 `json:"maturity"`      // Зрелость споры (0.0-1.0)
	Germination  float64 `json:"germination"`   // Прогресс прорастания
	Source       Position `json:"source"`       // Откуда появилась спора
	Dispersal    int     `json:"dispersal"`     // Дальность распространения
}

type FruitingBodyProperties struct {
	SporeProduction int     `json:"spore_production"` // Споры в тик
	Efficiency      float64 `json:"efficiency"`       // Эффективность производства
	Size            int     `json:"size"`             // Размер плодового тела
	Lifetime        int     `json:"lifetime"`         // Оставшееся время жизни
}

type ExtendedCell struct {
	Cell
	MyceliumProps    *MyceliumProperties    `json:"mycelium_props,omitempty"`
	SporeProps       *SporeProperties       `json:"spore_props,omitempty"`
	FruitingBodyProps *FruitingBodyProperties `json:"fruiting_body_props,omitempty"`
}