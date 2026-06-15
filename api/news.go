package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"
)

type Source struct {
	ID   interface{} `json:"id"`
	Name string      `json:"name"`
}

type Article struct {
	Source      Source `json:"source"`
	Author      string `json:"author"`
	Title       string `json:"title"`
	Description string `json:"description"`
	URL         string `json:"url"`
	URLToImage  string `json:"urlToImage"`
	PublishedAt string `json:"publishedAt"`
	Content     string `json:"content"`
}

type NewsAPIResponse struct {
	Status       string    `json:"status"`
	TotalResults int       `json:"totalResults"`
	Articles     []Article `json:"articles"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	apiKey := os.Getenv("NEWS_API_KEY")
	if apiKey == "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse{
			Error: "NEWS_API_KEY is not set. Get a free key at newsapi.org and add it to your Vercel environment variables.",
		})
		return
	}

	from := time.Now().UTC().AddDate(0, 0, -7).Format("2006-01-02")
	query := url.QueryEscape(
		"artificial intelligence OR machine learning OR large language model OR LLM OR generative AI OR OpenAI OR Anthropic OR Google Gemini OR AI model OR deep learning OR neural network OR AI safety OR AI regulation OR GPT OR Claude OR Mistral OR Llama",
	)
	apiURL := fmt.Sprintf(
		"https://newsapi.org/v2/everything?q=%s&language=en&sortBy=publishedAt&from=%s&pageSize=100&apiKey=%s",
		query, from, apiKey,
	)

	resp, err := http.Get(apiURL)
	if err != nil {
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(errorResponse{Error: "Failed to reach NewsAPI: " + err.Error()})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse{Error: "Failed to read NewsAPI response"})
		return
	}

	var news NewsAPIResponse
	if err := json.Unmarshal(body, &news); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse{Error: "Failed to parse NewsAPI response"})
		return
	}

	titleBlocklist := []string{
		"connections", "wordle", "nyt puzzle", "spelling bee",
		"crossword", "strands", "mini quiz", "trivia", "hints and answers",
		"answers for", "today's answers", "answer key",
	}

	nonAlpha := regexp.MustCompile(`[^a-z0-9 ]+`)
	seen := make(map[string]bool)

	filtered := news.Articles[:0]
	for _, a := range news.Articles {
		if a.Title == "" || a.Title == "[Removed]" || a.URL == "" {
			continue
		}
		lower := strings.ToLower(a.Title)

		blocked := false
		for _, term := range titleBlocklist {
			if strings.Contains(lower, term) {
				blocked = true
				break
			}
		}
		if blocked {
			continue
		}

		// Deduplicate by normalized title (strips punctuation/whitespace variations)
		key := strings.Join(strings.Fields(nonAlpha.ReplaceAllString(lower, "")), " ")
		if seen[key] {
			continue
		}
		seen[key] = true

		filtered = append(filtered, a)
	}
	news.Articles = filtered
	news.TotalResults = len(filtered)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(news)
}
