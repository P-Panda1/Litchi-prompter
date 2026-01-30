# Lychee-prompter Backend API

A production-ready RESTful API for transforming vague or complex prompts into clear, structured thinking steps. The API uses a stateless architecture where conversation state is managed client-side and passed between requests.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Setup & Installation](#setup--installation)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)

## Overview

Lychee-prompter helps learners and educators transform prompts through a multi-layer workflow:

1. **Middle Layer**: Improves English grammar, spelling, and clarity
2. **Clarification Check**: Determines if additional information is needed
3. **Final Answer**: Generates structured thinking steps, goals, and sentence starters

The API is designed to be:
- **Stateless**: All conversation state is passed between client and server
- **Scalable**: Can handle multiple concurrent requests
- **Production-ready**: Includes error handling, validation, and health checks

## Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application and routes
│   ├── models.py            # Pydantic models for validation
│   ├── services/
│   │   ├── __init__.py
│   │   └── chat_service.py  # Business logic
│   ├── core/
│   │   ├── __init__.py
│   │   ├── middle_layer.py  # English improvement
│   │   ├── final_layer.py   # Clarification & answer generation
│   │   └── prompts.json     # Prompt templates
│   └── utils/
│       ├── __init__.py
│       └── gemini_chat.py   # Gemini LLM integration
├── requirements.txt
├── Dockerfile
└── README.md
```

## State Management

The API uses a **stateless design** where conversation state is passed between client and server. This allows for horizontal scaling without session management.

### State Types

1. **`initial`**: Starting state (no conversation yet)
2. **`needs_clarification`**: Clarifying questions have been asked
3. **`final_output`**: Final answer has been generated

### State Object Structure

```json
{
  "state_type": "needs_clarification",
  "core_prompt": "Improved prompt text...",
  "clarification_questions": ["Question 1?", "Question 2?"],
  "user_answers": ["Answer 1", "Answer 2"]
}
```

### State Transitions

```
┌─────────┐
│ initial │
└────┬────┘
     │
     ├─────────────────┐
     │                 │
     ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│needs_clarification│  │ final_output │
└────────┬─────────┘  └──────────────┘
         │
         │ (with answers)
         │
         ▼
┌──────────────┐
│final_output  │
└──────────────┘
```

## API Endpoints

### Base URL

```
http://localhost:8000
```

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy"
}
```

### 2. Process Chat

**POST** `/api/v1/chat`

Process an initial user prompt or continue a conversation.

**Request Body:**
```json
{
  "user_prompt": "write a reflection about your project",
  "state": null  // Optional, for continuing conversations
}
```

**Response (Clarification Needed):**
```json
{
  "state": {
    "state_type": "needs_clarification",
    "core_prompt": "Write a reflection about your project.",
    "clarification_questions": [
      "What type of project are you reflecting on?",
      "What specific aspects should be included?"
    ],
    "user_answers": null
  },
  "improved_prompt": {
    "improved_prompt": "Write a reflection about your project.",
    "corrections": "- Fixed grammar: 'write' → 'Write'\n- Added clarity"
  },
  "clarification": {
    "questions": [
      "What type of project are you reflecting on?",
      "What specific aspects should be included?"
    ]
  },
  "final_answer": null,
  "message": "Your prompt has been improved. Please answer the clarifying questions to proceed."
}
```

**Response (No Clarification Needed):**
```json
{
  "state": {
    "state_type": "final_output",
    "core_prompt": "Write a reflection about your project.",
    "clarification_questions": null,
    "user_answers": null
  },
  "improved_prompt": {
    "improved_prompt": "Write a reflection about your project.",
    "corrections": "- Fixed grammar"
  },
  "clarification": null,
  "final_answer": {
    "goal": "You will explain what you built and what you learned.",
    "thinking_steps": [
      "What did you build?",
      "What was difficult?",
      "What did you learn?"
    ],
    "sentence_starters": [
      "My project is about...",
      "One challenge I had was...",
      "I learned that..."
    ]
  },
  "message": "Your prompt has been processed and the structured answer is ready."
}
```

### 3. Submit Clarification

**POST** `/api/v1/chat/clarify`

Submit answers to clarifying questions.

**Request Body:**
```json
{
  "answers": [
    "A web application for learning",
    "Technical challenges and learning outcomes"
  ],
  "state": {
    "state_type": "needs_clarification",
    "core_prompt": "Write a reflection about your project.",
    "clarification_questions": [
      "What type of project are you reflecting on?",
      "What specific aspects should be included?"
    ],
    "user_answers": null
  }
}
```

**Response:**
```json
{
  "state": {
    "state_type": "final_output",
    "core_prompt": "Write a reflection about your web application project, focusing on technical challenges and learning outcomes.",
    "clarification_questions": [
      "What type of project are you reflecting on?",
      "What specific aspects should be included?"
    ],
    "user_answers": [
      "A web application for learning",
      "Technical challenges and learning outcomes"
    ]
  },
  "improved_prompt": null,
  "clarification": null,
  "final_answer": {
    "goal": "You will explain your web application project, focusing on technical challenges and what you learned.",
    "thinking_steps": [
      "Describe the web application you built",
      "Identify the technical challenges you faced",
      "Reflect on what you learned from the project"
    ],
    "sentence_starters": [
      "I built a web application that...",
      "One technical challenge I encountered was...",
      "From this project, I learned..."
    ]
  },
  "message": "Your answers have been processed. Here is your structured answer."
}
```

## Request/Response Examples

### Example 1: Simple Prompt (No Clarification)

**Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "write a reflection about your project"
  }'
```

**Response:** Returns final answer directly (see above)

### Example 2: Prompt Requiring Clarification

**Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "create a landing page"
  }'
```

**Response:** Returns clarification questions

**Follow-up Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/chat/clarify" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": ["For a SaaS product", "Sign up for free trial"],
    "state": {
      "state_type": "needs_clarification",
      "core_prompt": "Create a landing page.",
      "clarification_questions": [
        "What is the landing page for?",
        "What is the main call-to-action?"
      ]
    }
  }'
```

**Response:** Returns final answer with updated prompt

## Setup & Installation

### Prerequisites

- Python 3.11 or higher
- Google Gemini API key

### Local Development

1. **Clone the repository** (if applicable) or navigate to the backend directory:
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**
   ```bash
   export GEMINI_KEY="your-api-key-here"
   # OR
   export GEMINI_KEY_PATH="/path/to/key/file"
   ```

5. **Run the application:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Docker Deployment

### Build the Docker Image

```bash
cd backend
docker build -t lychee-prompter-api .
```

### Run the Container

```bash
docker run -d \
  --name lychee-prompter \
  -p 8000:8000 \
  -e GEMINI_KEY="your-api-key-here" \
  lychee-prompter-api
```

### Using Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GEMINI_KEY=${GEMINI_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with:
```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_KEY` | Google Gemini API key | Yes* | - |
| `GEMINI_KEY_PATH` | Path to file containing API key | Yes* | - |

*Either `GEMINI_KEY` or `GEMINI_KEY_PATH` must be set.

## Error Handling

The API returns standard HTTP status codes:

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request data or state
- **500 Internal Server Error**: Server error

**Error Response Format:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common Errors:**

1. **Invalid State Type:**
   ```json
   {
     "detail": "Invalid state type: initial. Expected 'needs_clarification'."
   }
   ```

2. **Missing API Key:**
   ```json
   {
     "detail": "Neither GEMINI_KEY nor GEMINI_KEY_PATH found in environment variables."
   }
   ```

3. **Answer Count Mismatch:**
   ```json
   {
     "detail": "Expected 2 answers, got 1"
   }
   ```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Process prompt
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_prompt": "write a reflection"}'
```

### Using Python

```python
import requests

# Process initial prompt
response = requests.post(
    "http://localhost:8000/api/v1/chat",
    json={"user_prompt": "write a reflection about your project"}
)
data = response.json()

# If clarification needed
if data["state"]["state_type"] == "needs_clarification":
    # Submit answers
    response = requests.post(
        "http://localhost:8000/api/v1/chat/clarify",
        json={
            "answers": ["A web app", "Technical challenges"],
            "state": data["state"]
        }
    )
    final_data = response.json()
    print(final_data["final_answer"])
```

## License

[Add your license information here]

## Support

For issues and questions, please [create an issue](link-to-issues) or contact the development team.

