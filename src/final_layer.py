"""
Final Layer: Clarification Checking and Answer Generation

This module checks if a prompt needs clarification, asks questions if needed,
and generates the final structured answer.
"""

import json
from typing import Dict, List, Optional, Tuple
from pathlib import Path

try:
    from .utils import chat_with_gemini
except ImportError:
    from utils import chat_with_gemini


def load_prompts() -> Dict[str, Dict[str, str]]:
    """
    Load prompts from prompts.json file.
    Handles both string and array formats (arrays are joined with newlines).
    """
    prompts_path = Path(__file__).parent / "prompts.json"
    with open(prompts_path, 'r') as f:
        prompts = json.load(f)

    # Convert array prompts to strings by joining with newlines
    processed_prompts = {}
    for key, value in prompts.items():
        if isinstance(value.get("prompt"), list):
            processed_prompts[key] = {"prompt": "\n".join(value["prompt"])}
        else:
            processed_prompts[key] = value

    return processed_prompts


def check_clarification_needed(improved_prompt: str) -> Tuple[bool, List[str]]:
    """
    Check if the improved prompt needs clarification.

    Args:
        improved_prompt: The improved English version of the prompt

    Returns:
        Tuple[bool, List[str]]: (needs_clarification, questions_list)
    """
    prompts = load_prompts()
    prompt_template = prompts["clarification_check"]["prompt"]

    # Format the prompt
    formatted_prompt = prompt_template.format(improved_prompt=improved_prompt)

    # Call Gemini to check if clarification is needed
    response = chat_with_gemini(formatted_prompt)

    # Parse the response
    needs_clarification = False
    questions = []

    if "NEEDS_CLARIFICATION: yes" in response.lower():
        needs_clarification = True
        if "QUESTIONS:" in response:
            questions_section = response.split("QUESTIONS:", 1)[1].strip()
            # Extract numbered questions
            for line in questions_section.split('\n'):
                line = line.strip()
                if line and (line[0].isdigit() or line.startswith('-')):
                    # Remove numbering/bullets
                    question = line.split('.', 1)[-1].strip()
                    if question:
                        questions.append(question)
    elif "NEEDS_CLARIFICATION: no" in response.lower():
        needs_clarification = False

    return needs_clarification, questions


def update_core_prompt(
    core_prompt: str,
    questions_asked: List[str],
    user_answers: List[str]
) -> str:
    """
    Update the core prompt with user's answers to clarifying questions.

    Args:
        core_prompt: The original core prompt
        questions_asked: List of questions that were asked
        user_answers: List of user's answers (in same order as questions)

    Returns:
        str: Updated prompt with clarifications incorporated
    """
    prompts = load_prompts()
    prompt_template = prompts["clarification_prompt"]["prompt"]

    # Format questions and answers as strings
    questions_str = "\n".join(
        [f"{i+1}. {q}" for i, q in enumerate(questions_asked)])
    answers_str = "\n".join(
        [f"{i+1}. {a}" for i, a in enumerate(user_answers)])

    # Format the prompt
    formatted_prompt = prompt_template.format(
        core_prompt=core_prompt,
        questions_asked=questions_str,
        user_answers=answers_str
    )

    # Call Gemini to update the prompt
    response = chat_with_gemini(formatted_prompt)

    # Parse the response
    if "UPDATED_PROMPT:" in response:
        updated_prompt = response.split("UPDATED_PROMPT:", 1)[1].strip()
        return updated_prompt
    else:
        # Fallback: manually combine
        return f"{core_prompt}\n\nAdditional context:\n{answers_str}"


def generate_final_answer(final_prompt: str) -> Dict[str, any]:
    """
    Generate the final structured answer based on the complete prompt.

    Args:
        final_prompt: The complete prompt (with all clarifications if any)

    Returns:
        Dict with keys: 'goal', 'thinking_steps', 'sentence_starters'
    """
    prompts = load_prompts()
    prompt_template = prompts["final_answer"]["prompt"]

    # Format the prompt
    formatted_prompt = prompt_template.format(final_prompt=final_prompt)

    # Call Gemini to generate the answer
    response = chat_with_gemini(formatted_prompt)

    # Parse the response
    result = {
        "goal": "",
        "thinking_steps": [],
        "sentence_starters": []
    }

    if "CLEAR_GOAL:" in response:
        goal_section = response.split("CLEAR_GOAL:", 1)[1]
        if "THINKING_STEPS:" in goal_section:
            result["goal"] = goal_section.split(
                "THINKING_STEPS:", 1)[0].strip()
        else:
            result["goal"] = goal_section.strip()

    if "THINKING_STEPS:" in response:
        steps_section = response.split("THINKING_STEPS:", 1)[1]
        if "SENTENCE_STARTERS:" in steps_section:
            steps_text = steps_section.split("SENTENCE_STARTERS:", 1)[0]
        else:
            steps_text = steps_section

        # Extract numbered steps
        for line in steps_text.split('\n'):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-')):
                step = line.split('.', 1)[-1].strip()
                if step:
                    result["thinking_steps"].append(step)

    if "SENTENCE_STARTERS:" in response:
        starters_section = response.split("SENTENCE_STARTERS:", 1)[1].strip()
        for line in starters_section.split('\n'):
            line = line.strip()
            if line and (line.startswith('-') or line.startswith('•')):
                starter = line[1:].strip()
                if starter:
                    result["sentence_starters"].append(starter)

    return result
