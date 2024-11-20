package publisher

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/open-policy-agent/gatekeeper/v3/pkg/pubsub/connection"
)

type Publisher struct {
	client http.Client
}

const (
	Name = "publisher"
)

func (r *Publisher) Publish(_ context.Context, data interface{}, topic string) error {
    jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("error marshaling data: %w", err)
	}
    resp, err := r.client.Post("http://localhost:8081/process", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        log.Println("Error: request failed: %w", err)
        return nil
    }
    defer resp.Body.Close()

    // Handle non-200 responses as errors
    if resp.StatusCode != http.StatusOK {
        body, _ := io.ReadAll(resp.Body)
        log.Printf("Error: unexpected status %d: %s", resp.StatusCode, string(body))
        return nil
    }

    // // Read and log response body
    // body, err := io.ReadAll(resp.Body)
    // if err != nil {
    //     log.Println("failed to read response body: %w", err)
    //     return nil
    // }
    // log.Printf("Response from server: %d", resp.StatusCode)

	return nil
}

func (r *Publisher) CloseConnection() error {
	return nil
}

func (r *Publisher) UpdateConnection(_ context.Context, config interface{}) error {
	// m, ok := config.(map[string]interface{})
	// if !ok {
	// 	return fmt.Errorf("invalid type assertion, config is not in expected format")
	// }
	// path, ok := m["path"].(string)
	// if !ok {
	// 	return fmt.Errorf("failed to get value of path")
	// }
	// r.Path = path
	return nil
}

// Returns a new client for dapr.
func NewConnection(_ context.Context, config interface{}) (connection.Connection, error) {
	var publisher Publisher
	publisher.client = http.Client{}
	return &publisher, nil
}