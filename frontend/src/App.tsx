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
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 md:p-12 flex flex-col items-center text-gray-200">
      
      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-8">
        <div className="inline-flex items-center gap-3">
          <Sparkles className="w-10 h-10 text-blue-400 animate-pulse" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
        GetItDone.ai
      </h1>
        </div>
        <p className="text-sm md:text-base text-gray-400 mt-2">Your AI-powered task management assistant</p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* AI Chat Assistant - Dynamic Sizing */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-5 flex flex-col border border-gray-700 hover:shadow-xl transition duration-300 min-h-[200px] max-h-[80vh] overflow-auto">
          <div className="flex items-center gap-3 mb-5">
            <Bot className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg md:text-xl font-semibold text-white">AI Chat Assistant</h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`p-2 rounded-full ${message.role === "user" ? "bg-blue-400" : "bg-gray-600"}`}>
                  {message.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-200" />}
                </div>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[75%] shadow ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="relative mt-4">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(chatInput)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button onClick={() => sendMessage(chatInput)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition">
              <Send className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Todo List - Dynamic Sizing */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-700 hover:shadow-xl transition duration-300 min-h-[200px] max-h-[80vh] overflow-auto">
          <div className="flex items-center gap-3 mb-5">
            <Brain className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg md:text-xl font-semibold text-white">Todo List</h2>
          </div>

          {/* Todo Items */}
          <div className="space-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                <div className="flex-shrink-0">
                  {todo.completed ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-400" />}
                </div>
                <span className={`flex-grow text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-300"}`}>
                  {todo.todo}
                </span>
                <span className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-900/30 rounded-full">
                  {todo.category || "General"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        © 2025 GetItDone.ai | <a href="http://www.codefolio.co.in" className="text-blue-400 hover:text-blue-300 transition">CodeFolio</a> | Built with ❤️ and AI
      </div>
    </div>
  );
}

export default AiAssistant;
