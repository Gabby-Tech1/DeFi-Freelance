"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'payment';
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment',
      message: 'Payment received for DeFi Protocol',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'success',
      message: 'Smart contract successfully deployed',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      message: 'Project deadline approaching',
      time: '1 day ago',
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`flex items-start space-x-3 p-4 rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 