"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { useICP } from '@/contexts/ICPContext';

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
}

export default function MessageDetails() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual data
  const user: UserProfile = {
    id: '1',
    name: 'Alice Chen',
    avatar: '/avatars/alice.jpg',
    title: 'Senior Blockchain Developer',
    rating: 4.9,
    online: true,
    lastSeen: new Date(),
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
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Add message sending logic here
    setMessage('');
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              {user.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <PhoneIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <VideoCameraIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] space-y-2 ${
              msg.sender === 'me' ? 'items-end' : 'items-start'
            }`}>
              <div className={`${
                msg.sender === 'me' 
                  ? 'bg-blue-500 text-white rounded-l-xl rounded-tr-xl' 
                  : 'bg-white text-gray-900 rounded-r-xl rounded-tl-xl shadow-sm'
              } p-4`}>
                <p>{msg.content}</p>
                {msg.attachments?.map((attachment, index) => (
                  <div 
                    key={index}
                    className="mt-2 flex items-center space-x-2 p-2 bg-opacity-10 bg-black rounded"
                  >
                    {attachment.type === 'document' && <DocumentIcon className="w-5 h-5" />}
                    {attachment.type === 'image' && <PhotoIcon className="w-5 h-5" />}
                    {attachment.type === 'link' && <LinkIcon className="w-5 h-5" />}
                    <span className="text-sm">{attachment.name}</span>
                  </div>
                ))}
                <p className={`text-xs mt-1 ${
                  msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                  {msg.read && msg.sender === 'me' && (
                    <span className="ml-1">✓✓</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        {isAttaching && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Add attachments</span>
              <button 
                onClick={() => setIsAttaching(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="mt-2 flex space-x-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <PhotoIcon className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <DocumentIcon className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <LinkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsAttaching(!isAttaching)}
            className="text-gray-400 hover:text-gray-600"
          >
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
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            // Handle file upload
          }}
        />
      </div>
    </div>
  );
} 