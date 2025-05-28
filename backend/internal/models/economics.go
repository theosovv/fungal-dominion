package models

import "time"

type EconomicState struct {
	Current     Resources            `json:"current"`
	Production  ResourceProduction   `json:"production"`
	Consumption ResourceConsumption  `json:"consumption"`
	Storage     ResourceStorage      `json:"storage"`
	Efficiency  float64             `json:"efficiency"`  // Общая эффективность (0.0-2.0)\
	ProjectedBalance Resources `json:"projected_balance"` // Баланс на следующий тик
	TimeToEmpty      map[string]int `json:"time_to_empty"` // Время до исчерпания ресурса
	TimeToFull       map[string]int `json:"time_to_full"`  // Время до заполнения хранилища
}

type ResourceTransaction struct {
	ID        string    `json:"id"`
	ColonyID  string    `json:"colony_id"`
	Type      string    `json:"type"`      // "production", "consumption", "directive", etc.
	Resources Resources `json:"resources"` // Изменения (могут быть отрицательными)
	Reason    string    `json:"reason"`    // Причина изменения
	Timestamp time.Time `json:"timestamp"`
	Position  *Position `json:"position,omitempty"` // Где произошло изменение
}