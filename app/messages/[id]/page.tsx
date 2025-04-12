"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  LinkIcon,
  ArrowLeftIcon,
  FaceSmileIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useICP } from '@/contexts/ICPContext';
import toast from 'react-hot-toast';

interface MessageDetails {
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

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  online: boolean;
  lastSeen?: Date;
  skills?: string[];
}

export default function MessageDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  // Mock data - replace with actual data
  const user: UserProfile = {
    id: '1',
    name: 'Alice Chen',
    avatar: '/avatars/alice.jpg',
    title: 'Senior Blockchain Developer',
    rating: 4.9,
    online: true,
    lastSeen: new Date(),
    skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Web3']
  };

  const messages: MessageDetails[] = [
    {
      id: '1',
      content: 'Hi, I saw your proposal for the DeFi project',
      sender: 'them',
      timestamp: new Date('2024-03-10T10:25:00'),
      read: true,
    },
    {
      id: '2',
      content: 'Yes, I specialize in DeFi development. Here are some examples of my previous work:',
      sender: 'me',
      timestamp: new Date('2024-03-10T10:27:00'),
      read: true,
      attachments: [
        {
          type: 'document',
          url: '/documents/defi-portfolio.pdf',
          name: 'DeFi Portfolio.pdf',
        },
      ],
    },
    {
      id: '3',
      content: "The smart contract architecture looks impressive! Here's my proposed timeline:",
      sender: 'them',
      timestamp: new Date('2024-03-10T10:30:00'),
      read: false,
      attachments: [
        {
          type: 'image',
          url: '/images/timeline.png',
          name: 'Project Timeline',
        },
      ],
    },
    {
      id: '4',
      content: "I think we can optimize the gas usage in the lending protocol. Let me work on that and get back to you with some improvements.",
      sender: 'me',
      timestamp: new Date('2024-03-10T10:35:00'),
      read: false,
    },
    {
      id: '5',
      content: "That would be great! I'm also concerned about security. Can you ensure the contract is resistant to common attacks?",
      sender: 'them',
      timestamp: new Date('2024-03-10T10:40:00'),
      read: false,
    },
  ];

  // Simulate typing indicator
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTyping(true);
      
      // Hide typing indicator after 3 seconds
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }, 5000);
    
    return () => clearTimeout(typingTimer);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const handleAttachment = (type: string) => {
    toast.success(`${type} attachment option selected`);
    setShowAttachmentOptions(false);
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push('/messages')}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors mr-1"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="relative cursor-pointer" onClick={() => setShowUserInfo(!showUserInfo)}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{user.name}</h2>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">{user.online ? 'Online' : 'Offline'}</span>
                    <div className="flex items-center text-yellow-500">
                      <StarIcon className="w-4 h-4 mr-1" />
                      <span>{user.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <VideoCameraIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Info Panel - Conditionally rendered */}
            <AnimatePresence>
              {showUserInfo && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-gray-100 bg-gray-50"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">{user.title}</h3>
                      <Link 
                        href={`/freelancers/${user.id}`}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        View Full Profile
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {user.skills?.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Member since Jan 2023</span>
                      <span>Last seen {user.online ? 'now' : formatDate(user.lastSeen || new Date())}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/30 to-purple-50/30 p-4 space-y-4">
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
                        {attachment.type === 'link' && <LinkIcon className="w-5 h-5" />}
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

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white p-3 px-4 rounded-tr-xl rounded-tl-xl rounded-br-xl shadow-sm">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
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
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                // Handle file upload
                if (e.target.files && e.target.files[0]) {
                  toast.success(`File ${e.target.files[0].name} selected`);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}