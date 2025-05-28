package models

import "time"

type DirectiveType int

const (
	DirectiveExpand      DirectiveType = iota // Расширение территории
	DirectiveConcentrate                      // Концентрация ресурсов
	DirectiveReproduce                        // Размножение/споруляция
	DirectiveDefend                           // Защита территории
	DirectiveHarvest                          // Сбор ресурсов
	DirectiveResearch                         // Исследования/адаптация
	DirectiveMigrate                          // Миграция в новую область
	DirectiveSymbiosis                        // Установление симбиоза
)

type DirectiveTarget struct {
	Type     TargetType `json:"type"`
	Position Position   `json:"position,omitempty"` // Точечная цель
	Area     Area       `json:"area,omitempty"`     // Область
	CellType CellType   `json:"cell_type,omitempty"` // Тип клеток
}

type TargetType int

const (
	TargetPoint TargetType = iota // Точечная цель
	TargetArea                    // Прямоугольная область
	TargetCircle                  // Круглая область
	TargetPath                    // Путь/направление
	TargetCellType                // Все клетки определенного типа
)

type Area struct {
	TopLeft     Position `json:"top_left"`
	BottomRight Position `json:"bottom_right"`
	Radius      int      `json:"radius,omitempty"` // Для круглых областей
}

type Directive struct {
	ID          string          `json:"id"`
	Type        DirectiveType   `json:"type"`
	Target      DirectiveTarget `json:"target"`
	
	Intensity   int     `json:"intensity"`   // Интенсивность (1-10)
	Duration    int     `json:"duration"`    // Длительность в тиках
	Priority    int     `json:"priority"`    // Приоритет (1-10)
	
	Cost        Resources `json:"cost"`        // Стоимость активации
	Upkeep      Resources `json:"upkeep"`      // Стоимость за тик
	
	IsActive    bool      `json:"is_active"`
	StartedAt   time.Time `json:"started_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	Progress    float64   `json:"progress"`    // Прогресс выполнения (0.0-1.0)
	
	Efficiency  float64   `json:"efficiency"`  // Текущая эффективность
	Conflicts   []string  `json:"conflicts"`   // ID конфликтующих директив
}