"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  freelancerName: string;
  isOnline?: boolean;
  lastActive?: Date;
  responseTime?: number;
}

export default function ContactSection({ 
  freelancerName, 
  isOnline, 
  lastActive,
  responseTime 
}: ContactSectionProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Implement message sending logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500">Contact</h3>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-gray-600">
            {isOnline ? 'Online' : lastActive ? `Last active ${new Date(lastActive).toLocaleDateString()}` : 'Offline'}
          </span>
        </div>
      </div>

      {responseTime && (
        <div className="mb-4 text-sm text-gray-600">
          <span>Average Response Time: </span>
          <span className="font-medium">{responseTime} hours</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${freelancerName}...`}
          className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
} 