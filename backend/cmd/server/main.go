package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/theosovv/fungal-dominion/internal/models"
	"github.com/theosovv/fungal-dominion/internal/session"
)

var (
	upgrader = websocket.Upgrader {
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	sessionManager = session.NewManager()
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/health", healthHandler).Methods("GET")

	r.HandleFunc("/ws", websocketHandler)

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "healthy"}`))
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}

	sess := sessionManager.CreateSession(conn)
	defer sessionManager.RemoveSession(sess.ID)

	welcomeMsg := session.Message {
		Type: "session_created",
		SessionID: sess.ID,
		Data: map[string]interface{}{
			"session_id": sess.ID,
			"colony": sess.Colony,
		},
	}

	if err := sess.SendMessage(welcomeMsg); err != nil {
		log.Printf("Failed to send welcome message: %v", err)
		return
	}

	for {
		var msg session.Message
		err := conn.ReadJSON(&msg)

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected close error: %v", err)
			}
			break
		}

		sess.UpdateActivity()
		handleMessage(sess, msg)
	}
}

func handleMessage(sess *session.Session, msg session.Message) {
	switch msg.Type {
	case "ping":
		response := session.Message {
			Type: "pong",
			SessionID: sess.ID,
			Data: map[string]interface{}{"timestamp": msg.Timestamp},
		}

		sess.SendMessage(response)

	case "get_colony":
		response := session.Message {
			Type: "colony_state",
			SessionID: sess.ID,
			Data: sess.Colony,
		}

		sess.SendMessage(response)

	case "directive":
		handleDirective(sess, msg.Data)

	default:
		log.Printf("Unknown message type: %s", msg.Type)
	}
}

func handleDirective(sess *session.Session, data interface{}) {
	directiveData, ok := data.(map[string]interface{})

	if !ok {
		log.Printf("Invalid directive data: %v", data)
		return
	}

	directiveType, _ := directiveData["type"].(string)

	switch directiveType {
	case "cell_click":
		handleCellClick(sess, directiveData)

	case "add_nutrients":
		handleAddNutrients(sess, directiveData)

	default:
		log.Printf("Unknown directive type: %s", directiveType)
	}
}

func handleCellClick(sess *session.Session, data map[string]interface{}) {
	positionData, ok := data["position"].(map[string]interface{})

	if !ok {
		return
	}

	x := int(positionData["x"].(float64))
	y := int(positionData["y"].(float64))

	if x >= 0 && x < sess.Colony.Width && y >= 0 && y < sess.Colony.Height {
		cell := &sess.Colony.Cells[y][x]

		if cell.Type != models.Empty {
			cell.State.Nutrition += 10
			cell.State.Energy += 5

			log.Printf("Added nutrients to cell at (%d, %d)", x, y)
		} else {
			cell.Type = models.Nutrient
			cell.State.Nutrition = 30
			cell.State.Health = 100

			log.Printf("Created nutrient at (%d, %d)", x, y)
		}

		response := session.Message {
			Type: "colony_state",
			SessionID: sess.ID,
			Data: sess.Colony,
		}

		sess.SendMessage(response)
	}
}

func handleAddNutrients(sess *session.Session, data map[string]interface{}) {
	amountFloat, ok := data["amount"].(float64)

	if !ok {
		return
	}

	amount := int(amountFloat)
	sess.Colony.Resources.Nutrients += amount

	log.Printf("Added %d nutrients to colony %s", amount, sess.Colony.ID)
}