package models

type ResourceStats struct {
    CurrentProduction  ResourceProduction `json:"current_production"`
    CurrentConsumption ResourceConsumption `json:"current_consumption"`
    NetProduction     Resources          `json:"net_production"`     // Чистое производство
    
    ProductionEfficiency  float64 `json:"production_efficiency"`  // 0.0-2.0
    ConsumptionEfficiency float64 `json:"consumption_efficiency"` // Экономность расходов
    WasteLevel           float64 `json:"waste_level"`            // Уровень потерь
    
    TotalProduced     Resources `json:"total_produced"`     // За все время
    TotalConsumed     Resources `json:"total_consumed"`     // За все время
    TotalWasted       Resources `json:"total_wasted"`       // Потери
    
    ResourceSecurity  map[string]float64 `json:"resource_security"`  // Устойчивость по ресурсам
    DaysSupply       map[string]int     `json:"days_supply"`        // Запас в тиках
    BottleneckResource string           `json:"bottleneck_resource"` // Ограничивающий ресурс
    
    EconomicCycles   []EconomicCycle `json:"economic_cycles"`
    CycleStability   float64        `json:"cycle_stability"`   // Стабильность экономики
}

type EconomicCycle struct {
    StartTick    int64   `json:"start_tick"`
    EndTick      int64   `json:"end_tick"`
    Type         string  `json:"type"`         // "growth", "recession", "boom", "crisis"
    Magnitude    float64 `json:"magnitude"`    // Сила цикла
    Trigger      string  `json:"trigger"`      // Причина начала цикла
}
