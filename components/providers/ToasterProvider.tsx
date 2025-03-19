"use client";

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return <Toaster 
    position="top-right"
    toastOptions={{
      duration: 5000,
      style: {
        background: '#fff',
        color: '#333',
      },
      success: {
        style: {
          border: '1px solid #22c55e',
        },
      },
      error: {
        style: {
          border: '1px solid #ef4444',
        },
      },
    }}
  />;
} 