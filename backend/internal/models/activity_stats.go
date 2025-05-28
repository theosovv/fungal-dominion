package models

import "time"

type ActivityStats struct {
    ActivityLevel     float64 `json:"activity_level"`      // Текущий уровень активности (0.0-1.0)
    RestingTime       int     `json:"resting_time"`        // Тики в неактивном состоянии
    ActiveTime        int     `json:"active_time"`         // Тики в активном состоянии
    
    RecentEvents      []GameEvent `json:"recent_events"`      // Последние события
    EventFrequency    float64     `json:"event_frequency"`    // Событий в тик
    CriticalEvents    int         `json:"critical_events"`    // Критические события
    
    DirectivesIssued    int     `json:"directives_issued"`     // Всего директив
    DirectivesCompleted int     `json:"directives_completed"`  // Выполненных директив
    DirectiveSuccess    float64 `json:"directive_success"`     // Процент успешных (0.0-1.0)
    AverageDirectiveTime float64 `json:"avg_directive_time"`   // Среднее время выполнения
    
    Interactions        []Interaction `json:"interactions"`        // Взаимодействия с другими колониями
    ConflictCount       int          `json:"conflict_count"`       // Количество конфликтов
    CooperationCount    int          `json:"cooperation_count"`    // Количество кооперации
    CompetitionScore    float64      `json:"competition_score"`    // Конкурентоспособность
}

type GameEvent struct {
    ID          string                 `json:"id"`
    Type        string                 `json:"type"`        // "growth", "death", "mutation", "conflict"
    Severity    string                 `json:"severity"`    // "low", "medium", "high", "critical"
    Description string                 `json:"description"`
    Position    *Position              `json:"position,omitempty"`
    Timestamp   time.Time              `json:"timestamp"`
    Impact      map[string]interface{} `json:"impact"`      // Влияние на колонию
    Duration    int                    `json:"duration"`    // Длительность эффекта
}

type Interaction struct {
    TargetColonyID string    `json:"target_colony_id"`
    Type          string    `json:"type"`           // "competition", "cooperation", "predation", "symbiosis"
    Intensity     float64   `json:"intensity"`      // Интенсивность взаимодействия
    Outcome       string    `json:"outcome"`        // "positive", "negative", "neutral"
    Timestamp     time.Time `json:"timestamp"`
    Duration      int       `json:"duration"`
}
