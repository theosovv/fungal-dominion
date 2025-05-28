package models

import "time"

type RecordStats struct {
    MaxCells          int       `json:"max_cells"`           // Максимум клеток
    MaxCellsTime      time.Time `json:"max_cells_time"`      // Когда достигнут
    MaxTerritory      int       `json:"max_territory"`       // Максимальная территория
    MaxResources      Resources `json:"max_resources"`       // Пиковые ресурсы
    
    FastestGrowth     float64   `json:"fastest_growth"`      // Максимальная скорость роста
    FastestExpansion  float64   `json:"fastest_expansion"`   // Максимальная скорость расширения
    LongestSurvival   int64     `json:"longest_survival"`    // Максимальное время выживания
    
    HighestEfficiency float64   `json:"highest_efficiency"`  // Пиковая эффективность
    BestResourceRatio float64   `json:"best_resource_ratio"` // Лучшее соотношение ресурсов
    
    Achievements      []Achievement `json:"achievements"`
    AchievementScore  int          `json:"achievement_score"`  // Общий счет достижений
    RarityIndex       float64      `json:"rarity_index"`       // Индекс редкости достижений
    
    GlobalRank        int     `json:"global_rank"`        // Место в глобальном рейтинге
    LocalRank         int     `json:"local_rank"`         // Место среди соседних колоний
    PercentileRank    float64 `json:"percentile_rank"`    // Процентиль (0.0-1.0)
}

type Achievement struct {
    ID          string    `json:"id"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    Category    string    `json:"category"`    // "growth", "survival", "efficiency", "exploration"
    Rarity      string    `json:"rarity"`      // "common", "rare", "epic", "legendary"
    UnlockedAt  time.Time `json:"unlocked_at"`
    Progress    float64   `json:"progress"`    // Прогресс к разблокировке (0.0-1.0)
    Condition   string    `json:"condition"`   // Условие получения
}
