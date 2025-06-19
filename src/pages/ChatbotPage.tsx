import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertTriangle, RefreshCcw } from 'lucide-react';
import { GroqService } from '../utils/groqService';

interface Message {
  content: string;
  isUser: boolean;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hi! I'm your steganography assistant. You can ask me anything about steganography concepts, techniques, or how to use StegoSafe.",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetChat = () => {
    setMessages([{
      content: "Hi! I'm your steganography assistant. You can ask me anything about steganography concepts, techniques, or how to use StegoSafe.",
      isUser: false
    }]);
    setError(null);
    GroqService.clearHistory();
    inputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setError(null);
    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await GroqService.chat(input);
      const botReply = { content: response, isUser: false };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 
        'Sorry, I encountered an error. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Steganography Assistant
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ask questions about steganography concepts, techniques, or how to use StegoSafe
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Chat messages container */}
          <div 
            className="h-[500px] overflow-y-auto p-6"
            role="log"
            aria-label="Chat messages"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                role="article"
                aria-label={`${message.isUser ? 'Your message' : 'Assistant response'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!message.isUser && index === 0 && (
                    <div className="flex items-center mb-2">
                      <Bot size={20} className="text-blue-600 mr-2" />
                      <span className="font-medium text-blue-600">StegoSafe Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 text-red-600 rounded-2xl px-4 py-2 flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question about steganography..."
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  isLoading || !input.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Send message"
              >
                <Send size={18} className="mr-2" />
                Send
              </button>
              <button
                onClick={resetChat}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 flex items-center"
                aria-label="Reset chat"
              >
                <RefreshCcw size={18} className="mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
