"""
Main Chat Interface

This module orchestrates the complete workflow:
1. User enters prompt (may be in broken English)
2. Middle layer improves English and explains corrections
3. Final layer checks if clarification is needed
4. If clarification needed, asks questions and updates core prompt
5. Generates final structured answer
"""

from typing import Dict, List, Optional

try:
    from .middle_layer import improve_english
    from .final_layer import (
        check_clarification_needed,
        update_core_prompt,
        generate_final_answer
    )
except ImportError:
    from middle_layer import improve_english
    from final_layer import (
        check_clarification_needed,
        update_core_prompt,
        generate_final_answer
    )


class MainChat:
    """
    Main chat interface that orchestrates the complete workflow.
    """
    
    def __init__(self):
        """Initialize the main chat interface."""
        self.core_prompt: Optional[str] = None
        self.clarification_questions: List[str] = []
        self.user_answers: List[str] = []
    
    def process_user_prompt(self, user_prompt: str) -> Dict[str, any]:
        """
        Process the user's initial prompt through the complete workflow.
        
        Args:
            user_prompt: The user's original prompt (may have broken English)
            
        Returns:
            Dict containing:
            - 'improved_prompt': The improved English version
            - 'corrections': Explanation of corrections made
            - 'needs_clarification': Boolean indicating if clarification is needed
            - 'questions': List of clarifying questions (if any)
            - 'final_answer': Final structured answer (if no clarification needed)
        """
        # Step 1: Middle layer - Improve English
        print("🔄 Improving your prompt...")
        improved_prompt, corrections = improve_english(user_prompt)
        
        # Store the improved prompt as the core prompt
        self.core_prompt = improved_prompt
        
        # Step 2: Final layer - Check if clarification is needed
        print("🔍 Checking if clarification is needed...")
        needs_clarification, questions = check_clarification_needed(improved_prompt)
        
        result = {
            "improved_prompt": improved_prompt,
            "corrections": corrections,
            "needs_clarification": needs_clarification,
            "questions": questions,
            "final_answer": None
        }
        
        if not needs_clarification:
            # No clarification needed, generate final answer
            print("✅ Generating your structured answer...")
            final_answer = generate_final_answer(improved_prompt)
            result["final_answer"] = final_answer
        else:
            # Store questions for later
            self.clarification_questions = questions
        
        return result
    
    def answer_clarifying_questions(self, answers: List[str]) -> Dict[str, any]:
        """
        Process user's answers to clarifying questions and generate final answer.
        
        Args:
            answers: List of user's answers (in same order as questions)
            
        Returns:
            Dict containing the final structured answer
        """
        if not self.core_prompt:
            raise ValueError("No core prompt set. Please process a user prompt first.")
        
        if len(answers) != len(self.clarification_questions):
            raise ValueError(
                f"Expected {len(self.clarification_questions)} answers, "
                f"got {len(answers)}"
            )
        
        # Store answers
        self.user_answers = answers
        
        # Update core prompt with clarifications
        print("🔄 Updating prompt with your answers...")
        updated_prompt = update_core_prompt(
            self.core_prompt,
            self.clarification_questions,
            answers
        )
        
        # Generate final answer
        print("✅ Generating your structured answer...")
        final_answer = generate_final_answer(updated_prompt)
        
        return {
            "updated_prompt": updated_prompt,
            "final_answer": final_answer
        }
    
    def reset(self):
        """Reset the chat state for a new conversation."""
        self.core_prompt = None
        self.clarification_questions = []
        self.user_answers = []


def chat_loop():
    """
    Interactive chat loop for command-line usage.
    """
    chat = MainChat()
    
    print("=" * 60)
    print("Welcome to Lychee-prompter!")
    print("Enter your prompt (it's okay if your English isn't perfect).")
    print("Type 'quit' to exit, 'reset' to start a new conversation.")
    print("=" * 60)
    print()
    
    while True:
        # Get user input
        user_input = input("You: ").strip()
        
        if user_input.lower() == 'quit':
            print("Goodbye!")
            break
        
        if user_input.lower() == 'reset':
            chat.reset()
            print("Conversation reset. Enter a new prompt.")
            continue
        
        if not user_input:
            continue
        
        # Process the prompt
        try:
            result = chat.process_user_prompt(user_input)
            
            # Display improved prompt and corrections
            print("\n" + "=" * 60)
            print("IMPROVED PROMPT:")
            print(result["improved_prompt"])
            print()
            
            if result["corrections"]:
                print("CORRECTIONS MADE:")
                print(result["corrections"])
                print()
            
            # Check if clarification is needed
            if result["needs_clarification"]:
                print("I need some clarification:")
                for i, question in enumerate(result["questions"], 1):
                    print(f"{i}. {question}")
                print()
                print("Please answer these questions (one per line):")
                
                # Get answers
                answers = []
                for i in range(len(result["questions"])):
                    answer = input(f"Answer {i+1}: ").strip()
                    answers.append(answer)
                
                # Process answers and get final result
                final_result = chat.answer_clarifying_questions(answers)
                
                print("\n" + "=" * 60)
                print("FINAL ANSWER:")
                print()
                print("CLEAR GOAL:")
                print(final_result["final_answer"]["goal"])
                print()
                
                if final_result["final_answer"]["thinking_steps"]:
                    print("THINKING STEPS:")
                    for i, step in enumerate(final_result["final_answer"]["thinking_steps"], 1):
                        print(f"{i}. {step}")
                    print()
                
                if final_result["final_answer"]["sentence_starters"]:
                    print("SENTENCE STARTERS:")
                    for starter in final_result["final_answer"]["sentence_starters"]:
                        print(f"- {starter}")
                    print()
                
                # Reset for next conversation
                chat.reset()
            else:
                # Display final answer directly
                print("FINAL ANSWER:")
                print()
                print("CLEAR GOAL:")
                print(result["final_answer"]["goal"])
                print()
                
                if result["final_answer"]["thinking_steps"]:
                    print("THINKING STEPS:")
                    for i, step in enumerate(result["final_answer"]["thinking_steps"], 1):
                        print(f"{i}. {step}")
                    print()
                
                if result["final_answer"]["sentence_starters"]:
                    print("SENTENCE STARTERS:")
                    for starter in result["final_answer"]["sentence_starters"]:
                        print(f"- {starter}")
                    print()
                
                # Reset for next conversation
                chat.reset()
            
            print("=" * 60)
            print()
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            print()


if __name__ == "__main__":
    chat_loop()

