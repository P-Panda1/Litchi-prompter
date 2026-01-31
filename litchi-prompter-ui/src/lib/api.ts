/**
 * API client for communicating with the backend
 */

import type {
  ChatResponse,
  InitialRequest,
  ClarificationRequest,
} from './types';

// Get API URL from environment variable, with fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000');

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public detail?: string
  ) {
    super(detail || statusText);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      response.statusText,
      errorData.detail || errorData.message || 'An error occurred'
    );
  }

  return response.json();
}

/**
 * Check if the API is healthy
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchApi<{ status: string }>('/health');
}

/**
 * Process an initial user prompt
 */
export async function processChat(
  request: InitialRequest
): Promise<ChatResponse> {
  return fetchApi<ChatResponse>('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Submit answers to clarifying questions
 */
export async function submitClarification(
  request: ClarificationRequest
): Promise<ChatResponse> {
  return fetchApi<ChatResponse>('/api/v1/chat/clarify', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

