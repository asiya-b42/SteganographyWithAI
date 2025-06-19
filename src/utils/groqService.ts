interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a steganography expert assistant for the StegoSafe application. Your role is to:
1. Explain steganography concepts clearly and accurately
2. Help users understand different steganography techniques
3. Answer questions about image and audio steganography
4. Guide users on StegoSafe's features (hiding messages, extracting hidden content, detecting steganography)
5. Discuss encryption methods used in steganography (AES, DES, RSA)
6. Provide security best practices for steganography
Keep responses concise and focused on steganography topics.`;

export class GroqService {
  private static messageHistory: ChatMessage[] = [];
  static async chat(userMessage: string): Promise<string> {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
      }

      // Add user message to history
      this.messageHistory.push({ role: 'user', content: userMessage });      // Keep only last 10 messages to avoid token limits
      const recentMessages = this.messageHistory.slice(-10);
      const messages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recentMessages
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        throw new Error(`Failed to parse response: ${response.statusText}`);
      }

      if (!response.ok) {
        const errorMessage = responseData?.error?.message || 
                           responseData?.error?.type ||
                           `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (!responseData?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from Groq API');
      }

      const result = responseData.choices[0].message.content;

      // Add assistant response to history
      this.messageHistory.push({ role: 'assistant', content: result });

      return result;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  }

  static clearHistory(): void {
    this.messageHistory = [];
  }
}
