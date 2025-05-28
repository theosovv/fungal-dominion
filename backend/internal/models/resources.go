package models

type Resources struct {
	Energy   int `json:"energy"`   // Энергия - для роста и действий
	Biomass  int `json:"biomass"`  // Биомасса - для создания структур
	Spores   int `json:"spores"`   // Споры - для размножения
	Nutrients int `json:"nutrients"` // Питательные вещества
	Toxins   int `json:"toxins"`   // Токсины - для защиты
	Research int `json:"research"` // Очки исследований
}

type ResourceProduction struct {
	EnergyPerTick   float64 `json:"energy_per_tick"`
	BiomassPerTick  float64 `json:"biomass_per_tick"`
	SporesPerTick   float64 `json:"spores_per_tick"`
	NutrientsPerTick float64 `json:"nutrients_per_tick"`
	ToxinsPerTick   float64 `json:"toxins_per_tick"`
	ResearchPerTick float64 `json:"research_per_tick"`
}

type ResourceConsumption struct {
	Maintenance  Resources `json:"maintenance"`  // Затраты на поддержание
	Growth       Resources `json:"growth"`       // Затраты на рост
	Reproduction Resources `json:"reproduction"` // Затраты на размножение
	Defense      Resources `json:"defense"`      // Затраты на защиту
}

type ResourceStorage struct {
	MaxEnergy    int `json:"max_energy"`
	MaxBiomass   int `json:"max_biomass"`
	MaxSpores    int `json:"max_spores"`
	MaxNutrients int `json:"max_nutrients"`
	MaxToxins    int `json:"max_toxins"`
	MaxResearch  int `json:"max_research"`
}