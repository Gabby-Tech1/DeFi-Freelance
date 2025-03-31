"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';

export default function Auth() {
  const router = useRouter();
  const { isConnected, connectWallet } = useWallet();
  const [authMethod, setAuthMethod] = useState<'icp' | 'stoic' | 'plug'>('icp');

  if (isConnected) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Connect to DeFi Freelance</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              setAuthMethod('icp');
              connectWallet();
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-center">
              <img src="/icp-logo.svg" alt="ICP" className="w-6 h-6 mr-3" />
              Connect with Internet Identity
            </div>
          </button>
          
          <button
            onClick={() => {
              setAuthMethod('plug');
              connectWallet();
            }}
            className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-center">
              <img src="/plug-logo.svg" alt="Plug" className="w-6 h-6 mr-3" />
              Connect with Plug Wallet
            </div>
          </button>
          
          <button
            onClick={() => {
              setAuthMethod('stoic');
              connectWallet();
            }}
            className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-center">
              <img src="/stoic-logo.svg" alt="Stoic" className="w-6 h-6 mr-3" />
              Connect with Stoic Wallet
            </div>
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            By connecting your wallet, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
} 