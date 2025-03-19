"use client";

import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

class MockWebSocket {
  private callbacks: { [key: string]: ((data: any) => void)[] } = {};
  private isConnected = false;

  constructor() {
    this.isConnected = true;
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event: string) {
    delete this.callbacks[event];
  }

  emit(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  close() {
    this.isConnected = false;
  }
}

export function useWebSocket() {
  const socket = useRef<MockWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In a real app, this would be a real WebSocket connection
    socket.current = new MockWebSocket();
    setIsConnected(true);

    // Simulate some real-time updates
    const interval = setInterval(() => {
      if (socket.current) {
        // Simulate job updates
        if (Math.random() > 0.7) {
          socket.current.emit('job_update', {
            jobId: Math.floor(Math.random() * 5) + 1,
            updates: {
              status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)]
            }
          });
        }

        // Simulate payment updates
        if (Math.random() > 0.8) {
          socket.current.emit('payment_update', {
            jobId: Math.floor(Math.random() * 5) + 1,
            status: ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)]
          });
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  return socket.current;
} 