"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useICP } from '@/contexts/ICPContext';

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
  terms: string[];
  paymentSchedule: {
    amount: number;
    date: string;
    description: string;
    status: 'pending' | 'paid';
  }[];
  deliverables: {
    title: string;
    description: string;
    deadline: string;
    status: 'pending' | 'completed';
  }[];
  disputeResolution: string;
}

// Mock data for a single contract
const MOCK_CONTRACT: Contract = {
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
  terms: [
    'All deliverables must pass security audit',
    'Code must be well-documented',
    'Regular progress updates required',
    'Final delivery includes deployment to testnet'
  ],
  paymentSchedule: [
    {
      amount: 1000,
      date: '2023-11-20',
      description: 'Initial payment',
      status: 'paid'
    },
    {
      amount: 2000,
      date: '2023-12-15',
      description: 'Milestone 1: Core functionality',
      status: 'pending'
    },
    {
      amount: 2000,
      date: '2024-01-15',
      description: 'Final delivery',
      status: 'pending'
    }
  ],
  deliverables: [
    {
      title: 'Smart Contract Architecture',
      description: 'Detailed technical specification and architecture',
      deadline: '2023-11-30',
      status: 'completed'
    },
    {
      title: 'Core Smart Contracts',
      description: 'Implementation of core lending protocol contracts',
      deadline: '2023-12-15',
      status: 'pending'
    },
    {
      title: 'Testing and Deployment',
      description: 'Comprehensive tests and testnet deployment',
      deadline: '2024-01-10',
      status: 'pending'
    }
  ],
  disputeResolution: 'Any disputes will be resolved through arbitration by a mutually agreed third party.'
};

export default function ContractDetails() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useICP();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch contract data using params.id
    // For now, use mock data
    const timer = setTimeout(() => {
      setContract(MOCK_CONTRACT);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [params.id]);
  
  const handleCompleteDeliverable = (index: number) => {
    if (!contract) return;
    
    const updatedDeliverables = [...contract.deliverables];
    updatedDeliverables[index] = {
      ...updatedDeliverables[index],
      status: 'completed'
    };
    
    setContract({
      ...contract,
      deliverables: updatedDeliverables
    });
    
    toast.success('Deliverable marked as completed!');
  };
  
  const handleReleasePayment = (index: number) => {
    if (!contract) return;
    
    const updatedPayments = [...contract.paymentSchedule];
    updatedPayments[index] = {
      ...updatedPayments[index],
      status: 'paid'
    };
    
    setContract({
      ...contract,
      paymentSchedule: updatedPayments
    });
    
    toast.success('Payment released successfully!');
  };
  
  const handleDisputeContract = () => {
    toast.success('Dispute filed. An arbitrator will contact you shortly.');
    router.push('/disputes/create');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Contract Not Found</h1>
          <p className="text-gray-600 mb-8">The contract you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/contracts" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/contracts" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Contracts
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{contract.title}</h1>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            contract.status === 'active' ? 'bg-green-100 text-green-800' :
            contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Contract Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Contract Overview</h2>
              <p className="text-gray-600 mb-4">{contract.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {contract.createdAt.toLocaleDateString()}</span>
                <span>Value: ${contract.value}</span>
              </div>
            </motion.div>
            
            {/* Terms and Conditions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {contract.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </motion.div>
            
            {/* Deliverables */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Deliverables</h2>
              <div className="space-y-4">
                {contract.deliverables.map((deliverable, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{deliverable.title}</h3>
                        <p className="text-sm text-gray-600">{deliverable.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Due: {deliverable.deadline}</p>
                      </div>
                      <div className="flex items-center">
                        {deliverable.status === 'completed' ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCompleteDeliverable(index)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Dispute Resolution */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Dispute Resolution</h2>
              <p className="text-gray-600">{contract.disputeResolution}</p>
              <div className="mt-4">
                <button
                  onClick={handleDisputeContract}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  File a Dispute
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parties */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Contract Parties</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Client</h3>
                  <p className="text-sm font-mono text-gray-500">{contract.parties.clientId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Freelancer</h3>
                  <p className="text-sm font-mono text-gray-500">{contract.parties.freelancerId}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Payment Schedule */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Payment Schedule</h2>
              <div className="space-y-4">
                {contract.paymentSchedule.map((payment, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">${payment.amount}</h3>
                        <p className="text-sm text-gray-600">{payment.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Due: {payment.date}</p>
                      </div>
                      <div>
                        {payment.status === 'paid' ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReleasePayment(index)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Release Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Contract Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download Contract
                </button>
                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                  Send Message
                </button>
                {contract.status === 'active' && (
                  <button className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                    Mark as Completed
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}