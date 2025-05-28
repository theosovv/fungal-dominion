package models

import "time"

type HistoricalStats struct {
    SampleInterval int `json:"sample_interval"` // Интервал выборки (в тиках)
    MaxSamples     int `json:"max_samples"`     // Максимум хранимых образцов
    
    CellCount      []DataPoint `json:"cell_count"`
    ResourceLevels []ResourceDataPoint `json:"resource_levels"`
    GrowthRates    []DataPoint `json:"growth_rates"`
    Efficiency     []DataPoint `json:"efficiency"`
    Activity       []DataPoint `json:"activity"`
    
    DailyAverages  map[string]float64 `json:"daily_averages"`   // Средние за периоды
    WeeklyTrends   map[string]float64 `json:"weekly_trends"`    // Тренды
    MonthlyPeaks   map[string]float64 `json:"monthly_peaks"`    // Пиковые значения
    
    Correlations   map[string]float64 `json:"correlations"`     // Корреляции между метриками
    Predictions    map[string]float64 `json:"predictions"`      // Прогнозы на будущее
}

type DataPoint struct {
    Timestamp time.Time `json:"timestamp"`
    Value     float64   `json:"value"`
    Tick      int64     `json:"tick"`
}

type ResourceDataPoint struct {
    Timestamp time.Time `json:"timestamp"`
    Resources Resources `json:"resources"`
    Tick      int64     `json:"tick"`
}
