"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
}

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from your backend
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Alice Chen',
      avatar: '/avatars/alice.jpg',
      lastMessage: 'The smart contract looks good! When can we...',
      timestamp: new Date('2024-03-10T10:30:00'),
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: '/avatars/bob.jpg',
      lastMessage: "I've reviewed your proposal and I'm interested",
      timestamp: new Date('2024-03-09T15:45:00'),
      unread: 0,
      online: false,
    },
    // Add more mock chats...
  ];

  const messages: Message[] = [
    {
      id: '1',
      content: 'Hi, I saw your proposal for the DeFi project',
      sender: 'them',
      timestamp: new Date('2024-03-10T10:25:00'),
      read: true,
    },
    {
      id: '2',
      content: 'Yes, I specialize in DeFi development. Would you like to discuss the details?',
      sender: 'me',
      timestamp: new Date('2024-03-10T10:27:00'),
      read: true,
    },
    {
      id: '3',
      content: 'The smart contract looks good! When can we start?',
      sender: 'them',
      timestamp: new Date('2024-03-10T10:30:00'),
      read: false,
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Add message sending logic here
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* Chat List */}
            <div className="border-r border-gray-200">
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100vh-12rem)]">
                {chats.map(chat => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat === chat.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-2 lg:col-span-3 flex flex-col h-[calc(100vh-8rem)]">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={chats.find(c => c.id === selectedChat)?.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {chats.find(c => c.id === selectedChat)?.name}
                        </h3>
                        <p className="text-sm text-green-500">Online</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <EllipsisHorizontalIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          msg.sender === 'me' 
                            ? 'bg-blue-500 text-white rounded-l-xl rounded-tr-xl' 
                            : 'bg-gray-100 text-gray-900 rounded-r-xl rounded-tl-xl'
                        } p-4`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <PaperClipIcon className="w-6 h-6" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a chat to start messaging</h3>
                    <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 