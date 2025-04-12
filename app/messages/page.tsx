"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  FaceSmileIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { useICP } from '@/contexts/ICPContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    type: 'image' | 'document' | 'link';
    url: string;
    name?: string;
  }[];
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
  isTyping?: boolean;
}

export default function Messages() {
  const router = useRouter();
  const { isAuthenticated } = useICP();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data - replace with actual data from your backend
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Alice Chen',
      avatar: '/avatars/alice.svg',
      lastMessage: 'The smart contract looks good! When can we...',
      timestamp: new Date('2024-03-10T10:30:00'),
      unread: 2,
      online: true,
      isTyping: false,
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: '/avatars/bob.svg',
      lastMessage: "I've reviewed your proposal and I'm interested",
      timestamp: new Date('2024-03-09T15:45:00'),
      unread: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Carol Johnson',
      avatar: '/avatars/carol.svg',
      lastMessage: "Can you help with my DeFi project?",
      timestamp: new Date('2024-03-08T09:15:00'),
      unread: 1,
      online: true,
    },
    {
      id: '4',
      name: 'David Wilson',
      avatar: '/avatars/default.svg',
      lastMessage: "Thanks for the quick response!",
      timestamp: new Date('2024-03-07T14:22:00'),
      unread: 0,
      online: false,
    },
    {
      id: '5',
      name: 'Eva Martinez',
      avatar: '/avatars/bob.svg',
      lastMessage: "Let's schedule a call to discuss the details",
      timestamp: new Date('2024-03-06T11:05:00'),
      unread: 3,
      online: true,
    },
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
      attachments: [
        {
          type: 'document',
          url: '/documents/contract.pdf',
          name: 'Contract Draft.pdf',
        },
      ],
    },
  ];

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Add message sending logic here
    toast.success('Message sent!');
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    // On mobile, this should also show the chat window and hide the chat list
    if (window.innerWidth < 768) {
      // Add logic to show chat window on mobile
    }
  };

  const handleAttachment = (type: string) => {
    toast.success(`${type} attachment option selected`);
    setShowAttachmentOptions(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
            {/* Chat List */}
            <div className="border-r border-gray-200 md:col-span-1 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No conversations found</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredChats.map(chat => (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                          selectedChat === chat.id 
                            ? 'bg-blue-50 border-l-blue-500' 
                            : 'border-l-transparent'
                        }`}
                        onClick={() => handleChatSelect(chat.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative flex-shrink-0">
                            {chat.avatar ? (
                              <img
                                src={chat.avatar}
                                alt={chat.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-medium text-lg">
                                  {chat.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            {chat.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                              <span className="text-xs text-gray-500">{formatDate(chat.timestamp)}</span>
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {chat.isTyping ? (
                                <span className="text-blue-500 flex items-center">
                                  <span className="mr-1">Typing</span>
                                  <span className="flex space-x-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                  </span>
                                </span>
                              ) : (
                                chat.lastMessage
                              )}
                            </div>
                          </div>
                          {chat.unread > 0 && (
                            <div className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-2 lg:col-span-3 flex flex-col h-full">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {chats.find(c => c.id === selectedChat)?.avatar ? (
                          <img
                            src={chats.find(c => c.id === selectedChat)?.avatar}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {chats.find(c => c.id === selectedChat)?.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {chats.find(c => c.id === selectedChat)?.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {chats.find(c => c.id === selectedChat)?.name}
                        </h3>
                        <p className="text-xs text-green-500">
                          {chats.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
                    {messages.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] space-y-1`}>
                          <div className={`${
                            msg.sender === 'me' 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                              : 'bg-white text-gray-800 rounded-tr-xl rounded-tl-xl rounded-br-xl shadow-sm'
                          } p-3 px-4`}>
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            {msg.attachments?.map((attachment, index) => (
                              <div 
                                key={index}
                                className={`mt-2 flex items-center space-x-2 p-2 rounded ${msg.sender === 'me' ? 'bg-blue-400/20' : 'bg-gray-100'}`}
                              >
                                {attachment.type === 'document' && <DocumentIcon className="w-5 h-5" />}
                                {attachment.type === 'image' && <PhotoIcon className="w-5 h-5" />}
                                <span className="text-sm truncate">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                          <div className={`flex items-center text-xs ${msg.sender === 'me' ? 'justify-end text-gray-500' : 'justify-start text-gray-500'}`}>
                            <span>{formatTime(msg.timestamp)}</span>
                            {msg.read && msg.sender === 'me' && (
                              <CheckCircleIcon className="w-3 h-3 ml-1 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full pl-4 pr-20 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                        rows={1}
                      />
                      <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                        <div className="relative">
                          <button 
                            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                          >
                            <PaperClipIcon className="w-5 h-5" />
                          </button>
                          {showAttachmentOptions && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 w-48">
                              <button 
                                onClick={() => handleAttachment('Photo')}
                                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded text-left"
                              >
                                <PhotoIcon className="w-5 h-5 text-blue-500" />
                                <span>Photo</span>
                              </button>
                              <button 
                                onClick={() => handleAttachment('Document')}
                                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded text-left"
                              >
                                <DocumentIcon className="w-5 h-5 text-blue-500" />
                                <span>Document</span>
                              </button>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                          <FaceSmileIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                          className={`p-2 rounded-full ${message.trim() ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-400'} transition-colors`}
                        >
                          <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-50/50 to-purple-50/50 p-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                    <UserCircleIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Messages</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Select a conversation or start a new one to begin messaging with freelancers and clients.
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all">
                    Start New Conversation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}