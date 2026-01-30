"""
FastAPI Application for Lychee-prompter

This RESTful API provides endpoints for processing prompts through a multi-layer
workflow: English improvement, clarification checking, and structured answer generation.

The API is stateless - all conversation state is passed between client and server.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import InitialRequest, ClarificationRequest, ChatResponse
from app.services import ChatService

# Initialize FastAPI app
app = FastAPI(
    title="Lychee-prompter API",
    description="RESTful API for transforming prompts into clear, structured thinking steps",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
chat_service = ChatService()


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Lychee-prompter API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/api/v1/chat", response_model=ChatResponse)
async def process_chat(request: InitialRequest) -> ChatResponse:
    """
    Process an initial user prompt or continue a conversation.
    
    This endpoint handles:
    - Initial prompt submission (improves English, checks for clarification)
    - Returns either clarification questions or final answer
    
    **State Flow:**
    - `initial` → `needs_clarification` (if questions needed)
    - `initial` → `final_output` (if no questions needed)
    
    **Request Body:**
    - `user_prompt`: The user's original prompt (required for new conversations)
    - `state`: Optional conversation state (for continuing conversations)
    
    **Response:**
    - `state`: Updated conversation state (must be passed back in subsequent requests)
    - `improved_prompt`: The improved English version with corrections
    - `clarification`: Present if clarification is needed (contains questions)
    - `final_answer`: Present if no clarification needed (contains structured answer)
    """
    try:
        # Process the initial request
        response = chat_service.process_initial_request(request.user_prompt)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@app.post("/api/v1/chat/clarify", response_model=ChatResponse)
async def submit_clarification(request: ClarificationRequest) -> ChatResponse:
    """
    Submit answers to clarifying questions.
    
    This endpoint processes user's answers to clarifying questions and generates
    the final structured answer.
    
    **State Flow:**
    - `needs_clarification` → `final_output`
    
    **Request Body:**
    - `answers`: List of answers to clarifying questions (must match order of questions)
    - `state`: Current conversation state (must have state_type='needs_clarification')
    
    **Response:**
    - `state`: Updated conversation state (state_type='final_output')
    - `final_answer`: The structured answer with goal, thinking steps, and sentence starters
    
    **Validation:**
    - Number of answers must match number of questions in state
    - State must have state_type='needs_clarification'
    """
    try:
        # Validate state
        if request.state.state_type != "needs_clarification":
            raise HTTPException(
                status_code=400,
                detail=f"Invalid state type: {request.state.state_type}. "
                       "Expected 'needs_clarification'."
            )
        
        # Process clarification answers
        response = chat_service.process_clarification_answers(
            request.state,
            request.answers
        )
        return response
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing clarification: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

