package models

type DirectiveTemplate struct {
    Name        string        `json:"name"`
    Description string        `json:"description"`
    Type        DirectiveType `json:"type"`
    
    DefaultIntensity int       `json:"default_intensity"`
    DefaultDuration  int       `json:"default_duration"`
    DefaultPriority  int       `json:"default_priority"`
    
    MinIntensity    int       `json:"min_intensity"`
    MaxIntensity    int       `json:"max_intensity"`
    RequiredResources Resources `json:"required_resources"`
    
    Prerequisites   []string  `json:"prerequisites"`   // ID других директив
    ForbiddenStates []string  `json:"forbidden_states"` // Состояния, при которых нельзя
}

type DirectiveCombo struct {
    ID          string      `json:"id"`
    Name        string      `json:"name"`
    Description string      `json:"description"`
    Directives  []Directive `json:"directives"`
    
    IsSequential bool        `json:"is_sequential"` // Выполнять по очереди или параллельно
    Timing       []int       `json:"timing"`        // Задержки между директивами
    
    SuccessConditions []string `json:"success_conditions"`
    FailureConditions []string `json:"failure_conditions"`
}
