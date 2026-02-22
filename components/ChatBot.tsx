import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';

export const ChatBot = () => {
  const { isChatOpen, toggleChat } = useApp();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: 'Hi! I\'m the Credexus AI assistant. How can I help you find verified accounts today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showContact]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare history for API (convert 'model' to 'assistant' for standard role naming if needed, though frontend uses 'model')
      const history = messages.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
      }));

      const response = await api.sendChatMessage(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the server. Please try using the contact buttons for support." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center z-50 transition-transform hover:scale-105"
        aria-label="Open Support Chat"
      >
        {isChatOpen ? <i className="fa-solid fa-xmark text-2xl"></i> : <i className="fa-solid fa-message text-2xl"></i>}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-150 max-h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col z-50 overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">Credexus Support</h3>
                <span className="text-xs text-brand-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setShowContact(!showContact)}
              className={`text-xs px-2 py-1 rounded border transition ${showContact ? 'bg-white text-brand-600 border-white' : 'border-white/50 hover:bg-white/10'}`}
            >
              Contact Owner
            </button>
          </div>

          {/* Contact Buttons Overlay */}
          <div className={`bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 transition-all duration-300 overflow-hidden ${showContact ? 'max-h-96 py-2' : 'max-h-0'}`}>
            <div className="px-4 space-y-2 text-sm">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-2 text-center">Direct Support Channels</p>
              
              <a href="https://t.me/credexusmarket" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-[#229ED9] text-white rounded-lg hover:opacity-90 transition">
                <i className="fa-brands fa-telegram w-6 text-center text-lg"></i> 
                <span className="ml-2 font-medium">Telegram</span>
              </a>
              
              <a href="https://wa.me/447749062458" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition">
                <i className="fa-brands fa-whatsapp w-6 text-center text-lg"></i>
                <span className="ml-2 font-medium">WhatsApp</span>
              </a>

              <a href="https://discord.gg/9C6ZcScp" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-[#5865F2] text-white rounded-lg hover:opacity-90 transition">
                <i className="fa-brands fa-discord w-6 text-center text-lg"></i>
                <span className="ml-2 font-medium">Discord (@employverify)</span>
              </a>

              <a href="https://teams.live.com/l/invite/FBAHivBBV187MSG7QE?v=g1" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-[#6264A7] text-white rounded-lg hover:opacity-90 transition">
                <i className="fa-brands fa-microsoft w-6 text-center text-lg"></i>
                <span className="ml-2 font-medium">Microsoft Teams</span>
              </a>

              <a href="https://join.slack.com/t/credexus-market/shared_invite/zt-3n2sw70yb-7sKp7tv6F5BK4N3xzsMQeQ" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-[#4A154B] text-white rounded-lg hover:opacity-90 transition">
                <i className="fa-brands fa-slack w-6 text-center text-lg"></i>
                <span className="ml-2 font-medium">Slack</span>
              </a>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-100 dark:border-slate-600 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 dark:border-slate-600 shadow-sm">
                   <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                   </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about accounts..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-900 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:ring-0 transition-colors text-gray-900 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};