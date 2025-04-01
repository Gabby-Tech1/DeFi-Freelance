"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletError {
  message: string;
  code?: number;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<WalletError | null>(null);

  useEffect(() => {
    // Check if previously connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setError(null);
        } else {
          setAddress(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }

    // Cleanup function to handle unmounting
    return () => {
      setAddress(null);
      setIsConnecting(false);
      setError(null);
    };
  }, []);

  const connectWallet = async () => {
    if (isConnecting) return; // Prevent multiple connection attempts
    
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object is not available');
      }

      if (!window.ethereum) {
        throw new Error('No wallet found. Please install MetaMask or another web3 wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        // Add timeout to prevent hanging
        const accounts = await Promise.race([
          provider.send("eth_requestAccounts", []),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 10000)
          )
        ]) as string[];

        if (accounts.length > 0) {
          setAddress(accounts[0]);
          return accounts[0];
        } else {
          throw new Error('No accounts found');
        }
      } catch (err: any) {
        if (err.code === -32002) {
          throw new Error('Wallet connection already pending. Please check your wallet');
        }
        throw err;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      const walletError: WalletError = {
        message: errorMessage,
        code: err.code
      };
      setError(walletError);
      throw walletError;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setError(null);
  };

  return {
    address,
    isConnected: !!address,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };
}

// Add this to make TypeScript recognize the ethereum object on window
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
      selectedAddress?: string;
    };
  }
}