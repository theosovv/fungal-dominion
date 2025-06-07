package session

import (
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/theosovv/fungal-dominion/internal/models"
)

type Session struct {
	ID         string    `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	LastActive time.Time `json:"last_active"`
	Conn       *websocket.Conn
	Colony     *models.Colony `json:"colony,omitempty"`
}

func NewSession(conn *websocket.Conn) *Session {
	sessionID := uuid.New().String()
	now := time.Now()

	session := &Session{
		ID:         sessionID,
		CreatedAt:  now,
		LastActive: now,
		Conn:       conn,
	}

	session.Colony = createInitialColony(sessionID)

	return session
}

func createInitialColony(sessionID string) *models.Colony {
	width, height := 20, 20

	cells := make([][]models.Cell, height)

	for y := 0; y < height; y++ {
		cells[y] = make([]models.Cell, width)

		for x := 0; x < width; x++ {
			cells[y][x] = models.Cell{
				Type: models.Empty,
				State: models.CellState{
					Health: 100,
					Nutrition: 0,
					Toxicity: 0,
					Age: 0,
					Energy: 0,
					Growth: 0.0,
				},
				Position: models.Position{
					X: x,
					Y: y,
				},
				OwnerID: sessionID,
				LastUpdate: time.Now().Unix(),
			}
		}
	}

	centerX, centerY := width/2, height/2

	for dy := -1; dy <= 1; dy++ {
		for dx := -1; dx <= 1; dx++ {

			x, y := centerX+dx, centerY+dy

			if x >= 0 && x < width && y >= 0 && y < height {
				cells[y][x] = models.Cell{
					Type: models.Spore,
					State: models.CellState{
						Health: 100,
						Nutrition: 50,
						Toxicity: 0,
						Age: 0,
						Energy: 30,
						Growth: 0.1,
					},
					Position: models.Position{
						X: x,
						Y: y,
					},
					OwnerID: sessionID,
					LastUpdate: time.Now().Unix(),
				}
			}
		}
	}

	now := time.Now()

	return &models.Colony{
		ID: sessionID + "_colony",
		OwnerID: sessionID,
		Name: "New Fungal Colony",
		Width: width,
		Height: height,
		Cells: cells,
		CreatedAt: now,
		LastUpdate: now,
		TickCount: 0,
		Resources: models.Resources{
			Nutrients: 100,
			Energy: 50,
			Biomass: 9,
			Spores: 0,
			Toxins: 0,
			Research: 5,
		},
		ActiveDirectives: []models.Directive{},
		AutoSave: true,
	}
}

func (s *Session) UpdateActivity() {
	s.LastActive = time.Now()
}

func (s *Session) SendMessage(msg models.GameMessage) error {
	msg.Timestamp = time.Now()

	return s.Conn.WriteJSON(msg)
}

func (s *Session) IsExpired(timeout time.Duration) bool {
	return time.Since(s.LastActive) > timeout
}

func (s *Session) UpdateColony() {
	if s.Colony == nil {
		return
	}

	s.Colony.TickCount++
	s.Colony.LastUpdate = time.Now()

	s.simulateGrowth()
}

func (s *Session) simulateGrowth() {
	if s.Colony == nil {
		return
	}

	newCells := []models.Cell{}

	for y := 0; y < s.Colony.Height; y++ {
		for x := 0; x < s.Colony.Width; x ++ {
			cell := &s.Colony.Cells[y][x]

			if cell.Type == models.Spore || cell.Type == models.Mycelium {
				cell.State.Age++

				if cell.Type == models.Spore && cell.State.Growth >= 1.0 {
					cell.Type = models.Mycelium
					cell.State.Growth = 0.0
					cell.State.Energy = 50
				}

				if cell.State.Nutrition > 0 {
					cell.State.Growth += 0.1
					cell.State.Nutrition -= 1
					cell.State.Energy += 2
				}

				if cell.Type == models.Mycelium && cell.State.Energy >= 30 {
					neighbors := s.getEmptyNeighbors(x, y)

					if len(neighbors) > 0 && len(newCells) < 3 {
						neighbor := neighbors[0]
						newCell := models.Cell{
							Type: models.Spore,
							State: models.CellState{
								Health: 100,
								Nutrition: 20,
								Toxicity: 0,
								Age: 0,
								Energy: 10,
								Growth: 0.0,
							},
							Position: models.Position{
								X: neighbor.X,
								Y: neighbor.Y,
							},
							OwnerID: s.ID,
							LastUpdate: time.Now().Unix(),
						}
						newCells = append(newCells, newCell)
						cell.State.Energy -= 20
					}
				}

				cell.LastUpdate = time.Now().Unix()
			}
		}
	}

	for _, newCell := range newCells {
		if newCell.Position.Y < s.Colony.Height && newCell.Position.X < s.Colony.Width {
			s.Colony.Cells[newCell.Position.Y][newCell.Position.X] = newCell
		}
	}
}

func (s *Session) getEmptyNeighbors(x, y int) []models.Position {
	neighbors := []models.Position{}
	directions := [][]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

	for _, dir := range directions {
		nx, ny := x + dir[0], y + dir[1]

		if nx >= 0 && nx < s.Colony.Width && ny >= 0 && ny < s.Colony.Height {
			if s.Colony.Cells[ny][nx].Type == models.Empty {
				neighbors = append(neighbors, models.Position{X: nx, Y: ny})
			}
		}
	}

	return neighbors
}
