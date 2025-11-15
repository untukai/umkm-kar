
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { conversations as initialConversations, addMessageToConversation } from '../../data/dummyData';
import { Conversation, ChatMessage } from '../../types';
// FIX: Import ChatBubbleIcon to fix a component not found error.
import { UserIcon, SendIcon, ChatBubbleIcon } from '../../components/Icons';

const SellerChatPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedConversation) return;

    const message: ChatMessage = {
      sender: 'penjual',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    // Update state directly for UI reactivity
    const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
            const updatedMessages = [...conv.messages, message];
            return { ...conv, messages: updatedMessages, lastMessage: message.text, timestamp: message.timestamp };
        }
        return conv;
    });
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    
    // In a real app, this would be an API call. Here we mutate dummy data.
    addMessageToConversation(selectedConversation.id, message);

    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex overflow-hidden">
      {/* Conversation List */}
      <div className={`w-full md:w-1/3 border-r border-neutral-200 flex-col ${selectedConversation && 'hidden md:flex'}`}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Pesan Masuk</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${selectedConversation?.id === conv.id ? 'bg-primary/10' : 'hover:bg-neutral-50'}`}
            >
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-neutral-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-neutral-800 truncate">{conv.customerName}</p>
                  <p className="text-xs text-neutral-400 flex-shrink-0">{conv.timestamp}</p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-neutral-500 truncate">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && <span className="text-xs bg-primary text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation && 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <button onClick={() => setSelectedConversation(null)} className="md:hidden p-1 mr-2">&larr;</button>
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-neutral-500" />
              </div>
              <h2 className="text-lg font-bold">{selectedConversation.customerName}</h2>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-neutral-50">
                {selectedConversation.messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'penjual' ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender === 'pembeli' && <div className="w-6 h-6 rounded-full bg-neutral-300 flex-shrink-0"></div>}
                        <div className={`max-w-md rounded-lg px-3 py-2 ${msg.sender === 'penjual' ? 'bg-primary text-white rounded-br-none' : 'bg-neutral-200 text-neutral-800 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'penjual' ? 'text-white/70 text-right' : 'text-neutral-500 text-left'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex items-center gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Ketik balasan Anda..."
                    className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-neutral-100"
                    autoComplete="off"
                />
                <button type="submit" className="p-3 bg-primary hover:bg-primary-dark rounded-full text-white transition-colors flex-shrink-0">
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-neutral-50">
             <ChatBubbleIcon className="w-16 h-16 text-neutral-300" />
             <h2 className="text-xl font-bold mt-4">Selamat Datang di Pusat Pesan</h2>
             <p className="text-neutral-500 mt-2">Pilih percakapan dari daftar untuk mulai membalas pesan pelanggan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChatPage;