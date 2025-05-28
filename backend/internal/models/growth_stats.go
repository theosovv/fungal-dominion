package models

type GrowthStats struct {
    GrowthRate        float64 `json:"growth_rate"`         // Клеток в тик
    ExpansionRate     float64 `json:"expansion_rate"`      // Расширение территории
    ReproductionRate  float64 `json:"reproduction_rate"`   // Скорость размножения
    
    BirthRate         float64 `json:"birth_rate"`          // Новые клетки в тик
    DeathRate         float64 `json:"death_rate"`          // Погибшие клетки в тик
    LifeExpectancy    float64 `json:"life_expectancy"`     // Средняя продолжительность жизни клетки
    
    MutationRate      float64 `json:"mutation_rate"`       // Частота мутаций
    AdaptationScore   float64 `json:"adaptation_score"`    // Степень адаптированности
    EvolutionEvents   int     `json:"evolution_events"`    // Количество эволюционных событий
    
    SpreadPattern     string  `json:"spread_pattern"`      // "radial", "directional", "clustered"
    SpreadEfficiency  float64 `json:"spread_efficiency"`   // Эффективность распространения
    SpreadResistance  float64 `json:"spread_resistance"`   // Сопротивление среды
    
    DevelopmentStage  string  `json:"development_stage"`   // "spore", "juvenile", "mature", "senescent"
    StageProgress     float64 `json:"stage_progress"`      // Прогресс текущей стадии (0.0-1.0)
    TimeToNextStage   int     `json:"time_to_next_stage"`  // Тики до следующей стадии
}
