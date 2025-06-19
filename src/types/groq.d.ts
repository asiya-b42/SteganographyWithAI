declare global {
  interface GroqChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  interface GroqChatCompletionChoice {
    message: {
      content: string;
      role: 'assistant';
    };
    index: number;
    finish_reason: string;
  }

  interface GroqChatCompletion {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: GroqChatCompletionChoice[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  interface GroqErrorResponse {
    error: {
      message: string;
      type: string;
      param?: string;
      code?: string;
    };
  }
}
