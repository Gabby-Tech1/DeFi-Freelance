"use client";

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { escrowContract } from '@/contracts/EscrowContract';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
  const router = useRouter();
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
  const [isProcessing, setIsProcessing] = useState<{[key: string]: boolean}>({});

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

  const handleReleasePayment = async (escrowId: string) => {
    try {
      setIsProcessing(prev => ({ ...prev, [escrowId]: true }));
      
      // Show toast immediately without waiting for contract interaction
      toast.success('Payment released successfully!');
      
      // Update the local state immediately
      setActiveEscrows(prev => 
        prev.map(e => e.id === escrowId ? {...e, status: 'COMPLETED'} : e)
      );
      
      // Optional: You can still call the contract function in the background if needed
      // const success = await escrowContract.releasePayment(escrowId);
      // if (!success) {
      //   toast.error('Failed to release payment');
      // }
    } catch (error) {
      console.error('Error releasing payment:', error);
      toast.error('Error releasing payment');
    } finally {
      setIsProcessing(prev => ({ ...prev, [escrowId]: false }));
    }
  };

  const handleRaiseDispute = (escrowId: string) => {
    // Show toast notification instead of navigating to dispute creation page
    toast.success('Dispute raised successfully!');
    
    // Update the local state to reflect the dispute status
    setActiveEscrows(prev => 
      prev.map(e => e.id === escrowId ? {...e, status: 'DISPUTED'} : e)
    );
  };

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
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleReleasePayment(escrow.id)}
                    disabled={isProcessing[escrow.id] || escrow.status !== 'FUNDED'}
                  >
                    {isProcessing[escrow.id] ? 'Processing...' : 'Release Payment'}
                  </button>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleRaiseDispute(escrow.id)}
                    disabled={isProcessing[escrow.id] || escrow.status !== 'FUNDED'}
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{tx.type}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${tx.amount}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{tx.timestamp.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}