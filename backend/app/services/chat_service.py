"""
Chat Service: Business logic for processing prompts.

This service handles the workflow:
1. Improve English (middle layer)
2. Check if clarification is needed
3. Generate final answer or request clarification
"""

from typing import Dict, Any, List
from app.core import (
    improve_english,
    check_clarification_needed,
    update_core_prompt,
    generate_final_answer
)
from app.models import (
    ConversationState,
    ImprovedPromptResponse,
    ClarificationResponse,
    FinalAnswerResponse,
    ChatResponse
)


class ChatService:
    """Service for handling chat conversations."""

    def process_initial_request(self, user_prompt: str) -> ChatResponse:
        """
        Process the initial user prompt.

        Args:
            user_prompt: The user's original prompt (may have broken English)

        Returns:
            ChatResponse with either clarification needed or final answer
        """
        # Step 1: Middle layer - Improve English
        improved_prompt, corrections = improve_english(user_prompt)

        # Step 2: Check if clarification is needed
        needs_clarification, questions = check_clarification_needed(
            improved_prompt)

        # Create improved prompt response
        improved_prompt_response = ImprovedPromptResponse(
            improved_prompt=improved_prompt,
            corrections=corrections
        )

        if needs_clarification:
            # Need clarification
            state = ConversationState(
                state_type="needs_clarification",
                core_prompt=improved_prompt,
                clarification_questions=questions
            )

            return ChatResponse(
                state=state,
                improved_prompt=improved_prompt_response,
                clarification=ClarificationResponse(questions=questions),
                message="Your prompt has been improved. Please answer the clarifying questions to proceed."
            )
        else:
            # No clarification needed, generate final answer
            final_answer_dict = generate_final_answer(improved_prompt)

            state = ConversationState(
                state_type="final_output",
                core_prompt=improved_prompt
            )

            return ChatResponse(
                state=state,
                improved_prompt=improved_prompt_response,
                final_answer=FinalAnswerResponse(
                    goal=final_answer_dict["goal"],
                    thinking_steps=final_answer_dict["thinking_steps"],
                    sentence_starters=final_answer_dict["sentence_starters"]
                ),
                message="Your prompt has been processed and the structured answer is ready."
            )

    def process_clarification_answers(
        self,
        state: ConversationState,
        answers: List[str]
    ) -> ChatResponse:
        """
        Process user's answers to clarifying questions.

        Args:
            state: Current conversation state
            answers: User's answers to clarifying questions

        Returns:
            ChatResponse with final answer
        """
        if state.state_type != "needs_clarification":
            raise ValueError(
                f"Invalid state type: {state.state_type}. "
                "Expected 'needs_clarification'."
            )

        if not state.core_prompt:
            raise ValueError("Core prompt is missing from state.")

        if not state.clarification_questions:
            raise ValueError("Clarification questions are missing from state.")

        if len(answers) != len(state.clarification_questions):
            raise ValueError(
                f"Expected {len(state.clarification_questions)} answers, "
                f"got {len(answers)}"
            )

        # Update core prompt with clarifications
        updated_prompt = update_core_prompt(
            state.core_prompt,
            state.clarification_questions,
            answers
        )

        # Generate final answer
        final_answer_dict = generate_final_answer(updated_prompt)

        # Update state
        updated_state = ConversationState(
            state_type="final_output",
            core_prompt=updated_prompt,
            clarification_questions=state.clarification_questions,
            user_answers=answers
        )

        return ChatResponse(
            state=updated_state,
            final_answer=FinalAnswerResponse(
                goal=final_answer_dict["goal"],
                thinking_steps=final_answer_dict["thinking_steps"],
                sentence_starters=final_answer_dict["sentence_starters"]
            ),
            message="Your answers have been processed. Here is your structured answer."
        )
