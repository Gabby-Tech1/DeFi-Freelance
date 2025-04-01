"use client";

import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useICP } from '@/contexts/ICPContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { isConnected, disconnectWallet, address, isConnecting } = useWallet();
  const { isAuthenticated, principal, logout } = useICP();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    router.push('/auth');
  };

  const handleLogout = async () => {
    if (isConnected) {
      await disconnectWallet();
    }
    if (isAuthenticated) {
      await logout();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">DF</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeFi Freelance
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Find Jobs
            </Link>
            <Link href="/freelancers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Find Freelancers
            </Link>

            {isAuthenticated || isConnected ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {principal ? principal.slice(0, 2) : address?.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {principal ? `${principal.slice(0, 6)}...${principal.slice(-4)}` : 
                       address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-10 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Connected as</p>
                        <p className="font-mono text-sm truncate">{principal || address}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link 
                        href="/messages" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Messages
                      </Link>
                      <Link 
                        href="/contracts/create" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Create Contract
                      </Link>
                      <Link 
                        href="/jobs/create" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Post a Job
                      </Link>
                      <Link 
                        href="/disputes" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Disputes
                      </Link>
                      <div className="border-t border-gray-100 mt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fadeIn">
            <Link 
              href="/jobs" 
              className="block py-3 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link 
              href="/freelancers" 
              className="block py-3 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Freelancers
            </Link>

            {isAuthenticated || isConnected ? (
              <>
                <div className="py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Connected as</p>
                  <p className="font-mono text-sm truncate">{principal || address}</p>
                </div>
                <Link 
                  href="/dashboard" 
                  className="block py-3 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/messages" 
                  className="block py-3 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  href="/contracts/create" 
                  className="block py-3 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Contract
                </Link>
                <Link 
                  href="/escrow" 
                  className="block py-3 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Escrow
                </Link>
                <Link 
                  href="/jobs/create" 
                  className="block py-3 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post a Job
                </Link>
                <Link 
                  href="/disputes" 
                  className="block py-3 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Disputes
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 text-red-600 hover:text-red-700 border-t border-gray-100 mt-2"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthClick}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;