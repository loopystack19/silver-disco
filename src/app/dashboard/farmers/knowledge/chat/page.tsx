'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Load messages from session storage
    const savedMessages = sessionStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }

    // Check for article context
    const context = sessionStorage.getItem('chatbotContext');
    if (context) {
      try {
        const { articleTitle, articleDescription } = JSON.parse(context);
        setInputMessage(`Tell me more about: ${articleTitle}`);
        sessionStorage.removeItem('chatbotContext');
        
        // Focus input after a short delay
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error('Error loading context:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to session storage (keep last 10)
    const messagesToSave = messages.slice(-10);
    sessionStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/knowledge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (data.warning) {
          setError(data.warning);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get response from the assistant. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      sessionStorage.removeItem('chatMessages');
      setError(null);
    }
  };

  const suggestedQuestions = [
    'How can I prevent maize blight?',
    'What are the best irrigation methods for my farm?',
    'How do I improve soil fertility naturally?',
    'When is the best time to plant tomatoes?',
    'How can I control pests without chemicals?',
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/farmers/knowledge"
                className="text-sm text-green-600 hover:text-green-700 mb-2 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Knowledge Hub
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Farming Assistant</h1>
              <p className="text-sm text-gray-600">Ask me anything about farming</p>
            </div>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm mb-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to Your Farming Assistant!
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Ask me anything about farming, crops, pest control, irrigation, or any agricultural topic.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(question)}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="px-6 pb-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about farming..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Powered by Ollama</h4>
              <p className="text-sm text-blue-800 mt-1">
                This chatbot runs locally on your machine using Ollama. For best results, ensure Ollama is installed
                and running with a model like llama3, mistral, or phi3.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
