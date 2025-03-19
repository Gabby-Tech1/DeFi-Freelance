"use client";

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { escrowContract } from '@/contracts/EscrowContract';

interface Transaction {
  id: string;
  type: 'deposit' | 'release' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  jobId: string;
  counterparty: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000,
    status: 'completed',
    timestamp: new Date('2023-10-01'),
    jobId: 'job1',
    counterparty: '0x1234...5678',
  },
  // Add more mock transactions...
];

export default function Escrow() {
  const { isConnected, connectWallet, address } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [activeEscrows, setActiveEscrows] = useState([
    {
      id: '1',
      jobTitle: 'Smart Contract Development',
      amount: 2000,
      freelancer: '0x1234...5678',
      status: 'FUNDED',
    },
    {
      id: '2',
      jobTitle: 'Blockchain Development',
      amount: 3000,
      freelancer: '0x1234...56548',
      status: 'FUNDED',
    },
    // Add more mock escrows...
  ]);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-6">Please connect your wallet to view escrow details.</p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Escrow & Payments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Escrows */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Active Escrows</h2>
          <div className="space-y-4">
            {activeEscrows.map(escrow => (
              <div key={escrow.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{escrow.jobTitle}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {escrow.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Amount: ${escrow.amount}</p>
                <p className="text-gray-600 mb-4">Freelancer: {escrow.freelancer}</p>
                <div className="flex space-x-2">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => {
                      // Handle release payment
                    }}
                  >
                    Release Payment
                  </button>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      // Handle dispute
                    }}
                  >
                    Raise Dispute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`capitalize ${
                      tx.type === 'deposit' ? 'text-blue-600' :
                      tx.type === 'release' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {tx.type}
                    </span>
                    <p className="text-gray-600 text-sm">
                      Amount: ${tx.amount}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Job ID: {tx.jobId}</p>
                  <p>Counterparty: {tx.counterparty}</p>
                  <p>{tx.timestamp.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 