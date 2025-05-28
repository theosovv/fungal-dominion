package models

import "time"

type Statistics struct {
    Basic           BasicStats      `json:"basic"`
    Resources       ResourceStats   `json:"resources"`
    Growth          GrowthStats     `json:"growth"`
    Activity        ActivityStats   `json:"activity"`
    Records         RecordStats     `json:"records"`
    History         HistoricalStats `json:"history"`
    LastCalculated  time.Time       `json:"last_calculated"`
    CalculationTime time.Duration   `json:"calculation_time"` // Время расчета статистик
}
