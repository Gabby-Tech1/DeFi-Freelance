"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useICP } from '@/contexts/ICPContext';
import toast from 'react-hot-toast';

interface Contract {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'disputed';
  parties: {
    clientId: string;
    freelancerId: string;
  };
  value: number;
}

// Mock data for contracts
const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    title: 'DeFi Protocol Development',
    description: 'Smart contract development for a decentralized lending protocol',
    createdAt: new Date('2023-11-15'),
    status: 'active',
    parties: {
      clientId: '0xabc...123',
      freelancerId: '0xdef...456',
    },
    value: 5000,
  },
  {
    id: '2',
    title: 'NFT Marketplace Integration',
    description: 'Integration of NFT marketplace with existing platform',
    createdAt: new Date('2023-10-20'),
    status: 'completed',
    parties: {
      clientId: '0xabc...123',
      freelancerId: '0xghi...789',
    },
    value: 3500,
  },
  {
    id: '3',
    title: 'Smart Contract Audit',
    description: 'Security audit for token contract',
    createdAt: new Date('2023-12-01'),
    status: 'disputed',
    parties: {
      clientId: '0xjkl...012',
      freelancerId: '0xdef...456',
    },
    value: 2000,
  },
];

export default function Contracts() {
  const router = useRouter();
  const { isAuthenticated } = useICP();
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'disputed'>('all');

  useEffect(() => {
    // Simulate loading contracts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    return contract.status === filter;
  });

  const handleCreateContract = () => {
    router.push('/contracts/create');
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Smart Contracts</h1>
          <button
            onClick={handleCreateContract}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Contract
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              All Contracts
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('disputed')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'disputed' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Disputed
            </button>
          </div>
        </div>

        {/* Contracts List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredContracts.length > 0 ? (
          <div className="space-y-6">
            {filteredContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      href={`/contracts/${contract.id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {contract.title}
                    </Link>
                    <p className="text-gray-600 mt-1">{contract.description}</p>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <span>Created {contract.createdAt.toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Value: ${contract.value}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(contract.status)}`}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No contracts found</h3>
            <p className="text-gray-500 mb-6">You don't have any contracts matching the selected filter.</p>
            <button
              onClick={handleCreateContract}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
}