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
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object is not available');
      }

      if (!window.ethereum) {
        throw new Error(
          'No wallet found. Please install MetaMask or another web3 wallet'
        );
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          return accounts[0];
        } else {
          throw new Error('No accounts found');
        }
      } catch (err) {
        // Handle specific MetaMask errors
        if (err instanceof Error) {
          if ('code' in err) {
            const ethErr = err as { code: number; message: string };
            switch (ethErr.code) {
              case 4001:
                throw new Error('Please approve the connection request in your wallet');
              case -32002:
                throw new Error('Please check your MetaMask wallet - a connection request is pending');
              default:
                throw new Error(`Wallet connection failed: ${ethErr.message}`);
            }
          }
          throw err;
        }
        throw new Error('Failed to connect wallet');
      }
    } catch (err) {
      let errorMessage = 'Failed to connect wallet';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      const walletError: WalletError = {
        message: errorMessage,
        code: err instanceof Error && 'code' in err ? (err as any).code : undefined
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