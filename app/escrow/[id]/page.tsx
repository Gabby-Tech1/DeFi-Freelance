"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  BanknotesIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useICP } from '@/contexts/ICPContext';
import toast from 'react-hot-toast';

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed';
  dueDate: Date;
  description: string;
}

interface EscrowDetails {
  id: string;
  jobId: string;
  clientId: string;
  freelancerId: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'disputed';
  milestones: Milestone[];
  createdAt: Date;
  lastUpdated: Date;
}

export default function EscrowDetails() {
  const { id } = useParams();
  const { getEscrowDetails, releaseMilestone } = useICP();
  const [isLoading, setIsLoading] = useState(true);
  const [escrow, setEscrow] = useState<EscrowDetails | null>(null);

  // Mock data - replace with actual data from your backend
  const mockEscrow: EscrowDetails = {
    id: '1',
    jobId: 'job123',
    clientId: 'client456',
    freelancerId: 'freelancer789',
    totalAmount: 5000,
    status: 'active',
    milestones: [
      {
        id: 'm1',
        title: 'Smart Contract Development',
        amount: 2000,
        status: 'released',
        dueDate: new Date('2024-03-15'),
        description: 'Develop core smart contract functionality',
      },
      {
        id: 'm2',
        title: 'Testing and Audit',
        amount: 1500,
        status: 'locked',
        dueDate: new Date('2024-03-30'),
        description: 'Complete testing and security audit',
      },
      {
        id: 'm3',
        title: 'Deployment and Documentation',
        amount: 1500,
        status: 'pending',
        dueDate: new Date('2024-04-15'),
        description: 'Deploy to mainnet and provide documentation',
      },
    ],
    createdAt: new Date('2024-02-01'),
    lastUpdated: new Date('2024-02-15'),
  };

  useEffect(() => {
    // Replace with actual API call
    setEscrow(mockEscrow);
    setIsLoading(false);
  }, [id]);

  const handleReleaseMilestone = async (milestoneId: string) => {
    try {
      await releaseMilestone(escrow!.id, milestoneId);
      toast.success('Milestone payment released successfully');
      // Update the local state
      setEscrow(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          milestones: prev.milestones.map(m =>
            m.id === milestoneId ? { ...m, status: 'released' } : m
          ),
        };
      });
    } catch (error) {
      toast.error('Failed to release milestone payment');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">Escrow not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Escrow Details</h1>
                <p className="text-gray-500">ID: {escrow.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                <span className="text-green-600 font-medium">Protected</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">${escrow.totalAmount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{escrow.status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-xl font-bold text-gray-900">
                  {escrow.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Milestones</h2>
            <div className="space-y-6">
              {escrow.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="border-2 border-gray-100 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {index + 1}. {milestone.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{milestone.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Due: {milestone.dueDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${milestone.amount}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        {milestone.status === 'pending' && (
                          <ClockIcon className="w-5 h-5 text-yellow-500" />
                        )}
                        {milestone.status === 'locked' && (
                          <LockClosedIcon className="w-5 h-5 text-blue-500" />
                        )}
                        {milestone.status === 'released' && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                        <span className={`text-sm font-medium capitalize ${
                          milestone.status === 'released' ? 'text-green-600' :
                          milestone.status === 'locked' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {milestone.status === 'locked' && (
                    <button
                      onClick={() => handleReleaseMilestone(milestone.id)}
                      className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <BanknotesIcon className="w-5 h-5" />
                      <span>Release Payment</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Log</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <p className="text-gray-600">Milestone 1 payment released</p>
                <span className="text-gray-400">2 days ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <LockClosedIcon className="w-5 h-5 text-blue-500" />
                <p className="text-gray-600">Milestone 2 funds locked in escrow</p>
                <span className="text-gray-400">5 days ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 