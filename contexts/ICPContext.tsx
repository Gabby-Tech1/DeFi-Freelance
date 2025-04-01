"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { icpService } from '@/services/icp-service';
import { authService, WalletType } from '@/services/auth-service';

interface ICPContextType {
  isAuthenticated: boolean;
  principal: string | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  createJob: (job: any) => Promise<any>;
  getJob: (id: string) => Promise<any>;
  listJobs: () => Promise<any>;
  createUser: (user: any) => Promise<any>;
  getUser: (principal: Principal) => Promise<any>;
  submitProposal: (jobId: string, proposal: any) => Promise<any>;
  getEscrowDetails: (id: string) => Promise<any>;
  releaseMilestone: (escrowId: string, milestoneId: string) => Promise<void>;
  walletType: WalletType | null;
  connectWallet: (type: WalletType) => Promise<void>;
}

const ICPContext = createContext<ICPContextType>({} as ICPContextType);

export function ICPProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const isAuthed = await authService.init();
        if (!mounted) return;
        
        if (isAuthed) {
          const identity = authService.getIdentity();
          if (identity) {
            setIsAuthenticated(true);
            setPrincipal(identity.getPrincipal().toString());
            setWalletType(authService.getWalletType());
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        if (mounted) {
          setError('Failed to initialize authentication');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const connectWallet = async (type: WalletType) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const identity = await authService.connect(type);
      setIsAuthenticated(true);
      setPrincipal(identity.getPrincipal().toString());
      setWalletType(type);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await icpService.login();
      const identity = await icpService.getIdentity();
      setIsAuthenticated(true);
      setPrincipal(identity.getPrincipal().toString());
    } catch (err) {
      setError('Failed to login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await icpService.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <ICPContext.Provider value={{
      isAuthenticated,
      principal,
      isLoading,
      error,
      walletType,
      connectWallet,
      login,
      logout,
      createJob: icpService.createJob.bind(icpService),
      getJob: icpService.getJob.bind(icpService),
      listJobs: icpService.listJobs.bind(icpService),
      createUser: icpService.createUser.bind(icpService),
      getUser: icpService.getUser.bind(icpService),
      submitProposal: icpService.submitProposal.bind(icpService),
      getEscrowDetails: icpService.getEscrowDetails.bind(icpService),
      releaseMilestone: icpService.releaseMilestone.bind(icpService),
    }}>
      {children}
    </ICPContext.Provider>
  );
}

export const useICP = () => useContext(ICPContext);