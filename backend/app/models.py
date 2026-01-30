"""
Pydantic models for request/response validation and state management.

The API uses a stateful flow where the client passes state back and forth,
keeping the server stateless.
"""

from typing import Optional, List, Literal
from pydantic import BaseModel, Field


class ConversationState(BaseModel):
    """
    Conversation state that is passed between client and server.
    This keeps the server stateless while maintaining conversation context.
    """
    state_type: Literal["initial", "needs_clarification", "final_output"] = Field(
        ...,
        description="Current state of the conversation"
    )
    core_prompt: Optional[str] = Field(
        None,
        description="The improved core prompt (set after initial request)"
    )
    clarification_questions: Optional[List[str]] = Field(
        None,
        description="List of clarifying questions (set when state_type is 'needs_clarification')"
    )
    user_answers: Optional[List[str]] = Field(
        None,
        description="User's answers to clarifying questions"
    )


class InitialRequest(BaseModel):
    """Request model for initial prompt submission."""
    user_prompt: str = Field(
        ..., description="The user's original prompt (may have broken English)")
    state: Optional[ConversationState] = Field(
        None,
        description="Optional state if continuing a conversation"
    )


class ClarificationRequest(BaseModel):
    """Request model for submitting answers to clarifying questions."""
    answers: List[str] = Field(...,
                               description="User's answers to clarifying questions")
    state: ConversationState = Field(...,
                                     description="Current conversation state")


class ImprovedPromptResponse(BaseModel):
    """Response containing improved prompt and corrections."""
    improved_prompt: str = Field(...,
                                 description="The improved English version")
    corrections: str = Field(...,
                             description="Explanation of corrections made")


class ClarificationResponse(BaseModel):
    """Response when clarification is needed."""
    questions: List[str] = Field(...,
                                 description="List of clarifying questions (1-3 questions)")


class FinalAnswerResponse(BaseModel):
    """Response containing the final structured answer."""
    goal: str = Field(..., description="Clear restated goal")
    thinking_steps: List[str] = Field(...,
                                      description="Structured thinking steps")
    sentence_starters: List[str] = Field(...,
                                         description="Optional sentence starters")


class ChatResponse(BaseModel):
    """
    Unified response model for the chat API.
    The response structure varies based on the state_type.
    """
    state: ConversationState = Field(...,
                                     description="Updated conversation state")
    improved_prompt: Optional[ImprovedPromptResponse] = Field(
        None,
        description="Present when state_type is 'initial' or 'needs_clarification'"
    )
    clarification: Optional[ClarificationResponse] = Field(
        None,
        description="Present when state_type is 'needs_clarification'"
    )
    final_answer: Optional[FinalAnswerResponse] = Field(
        None,
        description="Present when state_type is 'final_output'"
    )
    message: str = Field(..., description="Human-readable status message")
