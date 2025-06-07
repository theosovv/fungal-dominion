package session

import (
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Manager struct {
	sessions map[string]*Session
	mutex sync.RWMutex
	sessionTimeout time.Duration
	simulationTicker *time.Ticker
}

func NewManager() *Manager {
	manager := &Manager{
		sessions: make(map[string]*Session),
		sessionTimeout: 30 * time.Minute,
	}

	go manager.cleanupExpiredSessions()

	go manager.runSimulation()

	return manager
}

func (m *Manager) CreateSession(conn *websocket.Conn) *Session {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	session := NewSession(conn)
	m.sessions[session.ID] = session

	log.Printf("Created session with ID: %s", session.ID)

	return session
}

func (m *Manager) GetSession(sessionID string) (*Session, bool) {
	m.mutex.RLock()
	defer m.mutex.Unlock()

	session, exists := m.sessions[sessionID]
	if exists {
		session.UpdateActivity()
	}
	return session, exists
}

func (m *Manager) RemoveSession(sessionID string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	
	if session, exists := m.sessions[sessionID]; exists {
		session.Conn.Close()
		delete(m.sessions, sessionID)
		log.Printf("Removed session: %s", sessionID)
	}
}

func (m *Manager) BroadcastToAll(msg Message) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()
	
	for _, session := range m.sessions {
		if err := session.SendMessage(msg); err != nil {
			log.Printf("Failed to send message to session %s: %v", session.ID, err)
		}
	}
}

func (m *Manager) GetActiveSessionsCount() int {
	m.mutex.RLock()
	defer m.mutex.Unlock()

	return len(m.sessions)
}

func (m *Manager) runSimulation() {
	m.simulationTicker = time.NewTicker(5 * time.Second)
	defer m.simulationTicker.Stop()

	for range m.simulationTicker.C {
		m.mutex.RLock()
		
		sessions := make([]*Session, 0, len(m.sessions))

		for _, session := range m.sessions {
			sessions = append(sessions, session)
		}

		m.mutex.RUnlock()

		for _, session := range sessions {
			session.UpdateColony()

			msg := Message {
				Type: "colony_updated",
				SessionID: session.ID,
				Data: session.Colony,
			}

			session.SendMessage(msg)
		}
	}
}

func (m *Manager) cleanupExpiredSessions() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		m.mutex.Lock()

		var expiredSessions []string

		for sessionID, session := range m.sessions {
			if session.IsExpired(m.sessionTimeout) {
				expiredSessions = append(expiredSessions, sessionID)
			}
		}

		for _, sessionID := range expiredSessions {
			if session := m.sessions[sessionID]; session != nil {
				session.Conn.Close()

				delete(m.sessions, sessionID)

				log.Printf("Removed expired session: %s", sessionID)
			}
		}

		m.mutex.Unlock()

		if len(expiredSessions) > 0 {
			log.Printf("Removed %d expired sessions", len(expiredSessions))
		}
	}
}