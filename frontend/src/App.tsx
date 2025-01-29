import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Brain, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: string;
  todo: string;
  completed: boolean;
  category: string;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

function AiAssistant() {
  const SYSTEM_PROMPT = "Hello! I'm your AI assistant. How can I help you today?";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: SYSTEM_PROMPT },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Fetch the to-do list when component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        console.log("Fetching todos...");
        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/get-todo`);
   
        if (response.data && Array.isArray(response.data.tasks)) {
          console.log("Fetched Todos:", response.data.tasks);
          setTodos(response.data.tasks);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching to-do list:", error);
      }
    };

    fetchTodos(); // Call the function
  }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    // Add user message to chat
    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    try {
      // Send the message to the backend
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/ai-response`, {
        message: query,
      });

      // Add the AI response to the chat
      const aiMessage: Message = {
        role: 'ai',
        content: response.data.response || "I'm sorry, I couldn't understand that.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = {
        role: 'ai',
        content: "An error occurred while communicating with the server.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      {/* Main Heading */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-3">
          <Sparkles className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-800">GetItDone.ai</h1>
        </div>
        <p className="text-gray-600 mt-2">Your AI-powered task management assistant</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chat Section - Left side */}
        <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">AI Chat Assistant</h2>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[calc(100vh-300px)] mb-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.role === 'user' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(chatInput)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={() => sendMessage(chatInput)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Send className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Todo List Section - Right side */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Todo List</h2>
          </div>

          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span
                  className={`flex-grow ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {todo.todo}
                </span>
                <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                  {todo.category || "General"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAssistant;
