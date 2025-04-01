"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useICP } from '@/contexts/ICPContext';
import { WalletType } from '@/services/auth-service';
import toast from 'react-hot-toast';

export default function Auth() {
  const router = useRouter();
  const { isAuthenticated, connectWallet, isLoading, error } = useICP();
  const [selectedWallet, setSelectedWallet] = useState<WalletType>('icp');
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isNavigating) {
      setIsNavigating(true);
      // Add small delay to ensure state is updated
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    }
  }, [isAuthenticated, router]);

  const handleConnect = async (type: WalletType) => {
    try {
      setSelectedWallet(type);
      await connectWallet(type);
    } catch (err: any) {
      toast.error(err.message || `Failed to connect ${type.toUpperCase()} wallet`);
      console.error('Connection error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Connect to DeFi Freelance</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => handleConnect('icp')}
            className={`w-full ${
              selectedWallet === 'icp'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            } px-6 py-4 rounded-lg hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-center">
              {/* <img src="/icp-logo.svg" alt="ICP" className="w-6 h-6 mr-3" /> */}
              Connect with Internet Identity
            </div>
          </button>
          
          <button
            onClick={() => handleConnect('plug')}
            className={`w-full ${
              selectedWallet === 'plug'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            } px-6 py-4 rounded-lg hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-center">
              {/* <img src="/plug-logo.svg" alt="Plug" className="w-6 h-6 mr-3" /> */}
              Connect with Plug Wallet
            </div>
          </button>
          
          <button
            onClick={() => handleConnect('stoic')}
            className={`w-full ${
              selectedWallet === 'stoic'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            } px-6 py-4 rounded-lg hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-center">
              {/* <img src="/stoic-logo.svg" alt="Stoic" className="w-6 h-6 mr-3" /> */}
              Connect with Stoic Wallet
            </div>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
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