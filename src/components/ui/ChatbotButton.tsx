import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';

const ChatbotButton = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isBot: boolean}[]>([
    { text: "Hello! I'm the RIT Links In assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot response (In a real app, this would call an API)
    setTimeout(() => {
      let botResponse;
      const userText = inputValue.toLowerCase();
      
      if (userText.includes('add skill') || userText.includes('upload certificate')) {
        botResponse = { 
          text: "To add a skill, go to 'Add Skills and Project' in the sidebar. You can upload your certification and provide details about your projects there.", 
          isBot: true 
        };
      } else if (userText.includes('project') || userText.includes('apply')) {
        botResponse = { 
          text: "You can view available projects in the 'My Projects' section. To apply, click on a project and select 'Apply'.", 
          isBot: true 
        };
      } else if (userText.includes('seminar') || userText.includes('workshop')) {
        botResponse = { 
          text: "Upcoming seminars are displayed on your dashboard. You can join them by clicking the 'Join Seminar' button.", 
          isBot: true 
        };
      } else {
        botResponse = { 
          text: "I'm here to help you navigate the RIT Links In platform. You can ask me about adding skills, finding projects, joining seminars, or any other features.", 
          isBot: true 
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="relative p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
        aria-label="Open AI Assistant"
      >
        <Bot size={22} />
      </button>
      
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot 
                    ? 'bg-gray-100 self-start rounded-bl-none' 
                    : 'bg-blue-100 self-end rounded-br-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;