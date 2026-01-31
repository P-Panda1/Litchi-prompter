/**
 * Type definitions for API responses and state management
 * These match the backend API models
 */

export type StateType = "initial" | "needs_clarification" | "final_output";

export interface ConversationState {
  state_type: StateType;
  core_prompt: string | null;
  clarification_questions: string[] | null;
  user_answers: string[] | null;
}

export interface ImprovedPromptResponse {
  improved_prompt: string;
  corrections: string;
}

export interface ClarificationResponse {
  questions: string[];
}

export interface FinalAnswerResponse {
  goal: string;
  thinking_steps: string[];
  sentence_starters: string[];
}

export interface ChatResponse {
  state: ConversationState;
  improved_prompt: ImprovedPromptResponse | null;
  clarification: ClarificationResponse | null;
  final_answer: FinalAnswerResponse | null;
  message: string;
}

export interface InitialRequest {
  user_prompt: string;
  state?: ConversationState | null;
}

export interface ClarificationRequest {
  answers: string[];
  state: ConversationState;
}

