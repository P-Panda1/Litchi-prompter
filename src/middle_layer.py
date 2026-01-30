"""
Middle Layer: English Improvement

This module improves the user's prompt by fixing grammar, spelling, and clarity
issues while maintaining the original meaning. It also provides encouraging
explanations of the corrections made.
"""

import json
from typing import Dict, Tuple
from pathlib import Path

try:
    from .utils import chat_with_gemini
except ImportError:
    from utils import chat_with_gemini


def load_prompts() -> Dict[str, Dict[str, str]]:
    """Load prompts from prompts.json file."""
    prompts_path = Path(__file__).parent / "prompts.json"
    with open(prompts_path, 'r') as f:
        return json.load(f)


def improve_english(user_prompt: str) -> Tuple[str, str]:
    """
    Improve the English of the user's prompt and explain corrections.
    
    Args:
        user_prompt: The original user prompt (may have broken English)
        
    Returns:
        Tuple[str, str]: (improved_prompt, corrections_explanation)
    """
    prompts = load_prompts()
    prompt_template = prompts["middle_layer"]["prompt"]
    
    # Format the prompt with user input
    formatted_prompt = prompt_template.format(user_prompt=user_prompt)
    
    # Call Gemini to improve the English
    response = chat_with_gemini(formatted_prompt)
    
    # Parse the response
    improved_prompt = ""
    corrections = ""
    
    if "IMPROVED_PROMPT:" in response:
        parts = response.split("IMPROVED_PROMPT:", 1)
        if len(parts) > 1:
            improved_section = parts[1].split("CORRECTIONS:", 1)[0].strip()
            improved_prompt = improved_section.strip()
            
            if "CORRECTIONS:" in response:
                corrections = response.split("CORRECTIONS:", 1)[1].strip()
    else:
        # Fallback: if parsing fails, use the whole response as improved prompt
        improved_prompt = response.strip()
        corrections = "No specific corrections identified, but the prompt was reviewed for clarity."
    
    return improved_prompt, corrections

