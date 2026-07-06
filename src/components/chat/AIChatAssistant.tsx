import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, User, AlertTriangle, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm LexBot, your AI legal assistant. I can help answer general legal questions, explain legal concepts, and guide you through our platform. How can I assist you today?",
    timestamp: new Date(),
  },
];

const QUICK_PROMPTS = [
  "What types of lawyers can I find?",
  "How does AI matching work?",
  "What are the fees?",
  "How do I register as a lawyer?",
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('lawyer') && (lowerMsg.includes('type') || lowerMsg.includes('kind'))) {
      return "We have lawyers across various specializations including Criminal, Civil, Family, Property, Corporate, Tax, Intellectual Property, Immigration, and more. Our AI will match you with the right specialization based on your case description.";
    }

    if (lowerMsg.includes('ai') && lowerMsg.includes('match')) {
      return "Our AI analyzes your case description, identifies the legal category, considers your budget and location preferences, then matches you with verified lawyers who have the right expertise, experience, and availability. You'll see a compatibility score for each recommendation.";
    }

    if (lowerMsg.includes('fee') || lowerMsg.includes('cost') || lowerMsg.includes('price')) {
      return "Basic case analysis and lawyer matching is free! Premium features are available for Rs.999/month including priority matching and unlimited consultations. Lawyers pay Rs.1,999/month for enhanced visibility and tools. Consultation fees vary by lawyer (typically Rs.1,000-5,000).";
    }

    if (lowerMsg.includes('register') && lowerMsg.includes('lawyer')) {
      return "To register as a lawyer, click 'Register as a Lawyer' on the homepage or navigate to the Lawyer Registration page. You'll need to provide your bar registration number, education details, practice areas, and verification documents. Our team reviews applications within 2-3 business days.";
    }

    if (lowerMsg.includes('verify') || lowerMsg.includes('verified')) {
      return "All lawyers on our platform go through a verification process. We verify their bar registration number, educational credentials, and professional background. Verified lawyers have a blue checkmark badge on their profile.";
    }

    if (lowerMsg.includes('consultation') || lowerMsg.includes('book')) {
      return "You can book consultations directly from a lawyer's profile page. We offer in-person, video call, and chat consultation options. Simply select your preferred time slot and consultation type, then confirm your booking.";
    }

    if (lowerMsg.includes('document') || lowerMsg.includes('upload')) {
      return "You can securely upload documents (PDF, images, DOCX) when submitting your case. Maximum total size is 20MB. All documents are encrypted and only shared with lawyers you choose to consult.";
    }

    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
      return "Hello! I'm here to help you with any questions about LegalBridge AI. Feel free to ask about our features, how to find a lawyer, registration process, or anything else!";
    }

    return "I understand you have a question. For specific legal advice, I recommend submitting your case through our platform to get matched with a qualified lawyer who can provide professional guidance. For platform-related questions, I'm happy to help! Could you please be more specific about what you'd like to know?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(input);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-50 flex items-center justify-center group"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-xs animate-pulse">
          1
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 right-6 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 w-80 h-14'
          : 'bottom-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">LexBot AI</h3>
            <p className="text-xs text-white/80">Legal Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 className={`w-4 h-4 ${isMinimized ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary-50 h-[340px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-secondary-700 rounded-2xl rounded-bl-md shadow-sm'
                  } p-3`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && <Sparkles className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-secondary-700 rounded-2xl rounded-bl-md shadow-sm p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-white border-t border-secondary-100 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="flex-shrink-0 px-3 py-1.5 bg-secondary-50 text-secondary-600 rounded-full text-xs hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-secondary-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-secondary-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-secondary-400 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              AI responses are for informational purposes only. Consult a lawyer for legal advice.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
