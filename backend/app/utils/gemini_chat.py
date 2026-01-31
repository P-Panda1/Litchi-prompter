"""
Gemini LLM Chat Interface

This module provides a baseline chat interface for Google's Gemini LLM.
It handles API key loading from environment variables and provides a simple
interface for prompting the model.
"""

import os
from typing import Optional, List, Dict, Any
import google.generativeai as genai


def load_gemini_key() -> str:
    """
    Load Gemini API key from environment variables.

    Checks for GEMINI_KEY first, then GEMINI_KEY_PATH.
    If GEMINI_KEY_PATH is set, reads the key from that file.

    Returns:
        str: The API key

    Raises:
        ValueError: If neither GEMINI_KEY nor GEMINI_KEY_PATH is found
        FileNotFoundError: If GEMINI_KEY_PATH is set but file doesn't exist
    """
    # First, check for direct key in environment
    api_key = os.getenv("GEMINI_KEY")
    if api_key:
        return api_key.strip()

    # If not found, check for path to key file
    key_path = os.getenv("GEMINI_KEY_PATH")
    if key_path:
        if not os.path.exists(key_path):
            raise FileNotFoundError(
                f"GEMINI_KEY_PATH specified but file not found: {key_path}"
            )
        with open(key_path, 'r') as f:
            api_key = f.read().strip()
        if api_key:
            return api_key

    raise ValueError(
        "Neither GEMINI_KEY nor GEMINI_KEY_PATH found in environment variables. "
        "Please set one of these environment variables."
    )


def init_gemini_client(api_key: Optional[str] = None) -> None:
    """
    Initialize the Gemini API client with the API key.

    Args:
        api_key: Optional API key. If not provided, will be loaded from environment.
    """
    if api_key is None:
        api_key = load_gemini_key()
    genai.configure(api_key=api_key)


class GeminiChat:
    """
    A chat interface for Google's Gemini LLM.

    This class provides a simple interface for chatting with Gemini,
    maintaining conversation history if needed.
    """

    def __init__(
        self,
        model: str = "gemini-2.5-flash",
        api_key: Optional[str] = None,
        system_instruction: Optional[str] = None
    ):
        """
        Initialize the Gemini chat interface.

        Args:
            model: The Gemini model to use (default: "gemini-2.5-flash")
            api_key: Optional API key. If not provided, will be loaded from environment.
            system_instruction: Optional system instruction to set model behavior
        """
        init_gemini_client(api_key)
        self.model_name = model
        self.model = genai.GenerativeModel(
            model_name=model,
            system_instruction=system_instruction
        )
        self.chat = None
        self.conversation_history: List[Dict[str, str]] = []

    def start_chat(self) -> None:
        """Start a new chat session with conversation history."""
        self.chat = self.model.start_chat(history=[])
        self.conversation_history = []

    def send_message(
        self,
        prompt: str,
        stream: bool = False,
        **kwargs
    ) -> str:
        """
        Send a message to Gemini and get a response.

        Args:
            prompt: The message/prompt to send to the model
            stream: Whether to stream the response (default: False)
            **kwargs: Additional arguments to pass to generate_content

        Returns:
            str: The model's response text
        """
        if self.chat is None:
            # If no chat session, use simple generate_content
            response = self.model.generate_content(
                prompt,
                stream=stream,
                **kwargs
            )
            return response.text
        else:
            # Use chat session for conversation history
            response = self.chat.send_message(
                prompt,
                stream=stream,
                **kwargs
            )
            return response.text

    def reset_chat(self) -> None:
        """Reset the chat session and clear conversation history."""
        self.chat = None
        self.conversation_history = []

    def get_history(self) -> List[Dict[str, str]]:
        """
        Get the conversation history.

        Returns:
            List of dictionaries with 'role' and 'content' keys
        """
        if self.chat:
            return [
                {"role": msg.role, "content": msg.parts[0].text}
                for msg in self.chat.history
            ]
        return self.conversation_history


def chat_with_gemini(
    prompt: str,
    model: str = "gemini-2.5-flash",
    api_key: Optional[str] = None,
    system_instruction: Optional[str] = None,
    **kwargs
) -> str:
    """
    Simple function to send a prompt to Gemini and get a response.

    This is a convenience function for one-off prompts without conversation history.

    Args:
        prompt: The message/prompt to send to the model
        model: The Gemini model to use (default: "gemini-2.5-flash")
        api_key: Optional API key. If not provided, will be loaded from environment.
        system_instruction: Optional system instruction to set model behavior
        **kwargs: Additional arguments to pass to generate_content

    Returns:
        str: The model's response text
    """
    init_gemini_client(api_key)
    gemini_model = genai.GenerativeModel(
        model_name=model,
        system_instruction=system_instruction
    )
    response = gemini_model.generate_content(prompt, **kwargs)
    return response.text
