"use client";

import { useICP } from '@/contexts/ICPContext';

export default function ICPLoginButton() {
  const { isAuthenticated, principal, login, logout } = useICP();

  return (
    <div>
      {!isAuthenticated ? (
        <button
          onClick={() => login()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          Connect with Internet Identity
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Connected: {principal?.slice(0, 5)}...{principal?.slice(-3)}
          </span>
          <button
            onClick={() => logout()}
            className="text-red-600 hover:text-red-700"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 