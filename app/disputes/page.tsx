"use client";

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Dispute } from '@/types';
import Link from 'next/link';
import { disputeContract } from '@/contracts/DisputeContract';

const MOCK_DISPUTES: Dispute[] = [
  {
    id: '1',
    jobId: 'job1',
    clientId: '0x1234...5678',
    freelancerId: '0x8765...4321',
    reason: 'Work not meeting requirements',
    evidence: 'https://evidence.link/1',
    status: 'pending',
    createdAt: new Date('2023-10-01'),
  },
  {
    id: '2',
    jobId: 'job2',
    clientId: '0x2345...6789',
    freelancerId: '0x9876...5432',
    reason: 'Missed deadline without communication',
    evidence: 'https://evidence.link/2',
    status: 'resolved',
    resolution: 'Partial refund issued to client',
    createdAt: new Date('2023-09-15'),
  },
];

export default function Disputes() {
  const { isConnected, connectWallet, address } = useWallet();
  const [activeTab, setActiveTab] = useState<'my-disputes' | 'all-disputes'>('my-disputes');
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-6">Please connect your wallet to view disputes.</p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const filteredDisputes = activeTab === 'my-disputes'
    ? disputes.filter(d => d.clientId === address || d.freelancerId === address)
    : disputes;

  const handleVoteForClient = async (disputeId: string) => {
    try {
      const tx = await disputeContract.voteOnDispute(disputeId, true);
      alert('Vote submitted successfully! Transaction: ' + tx);
      const updatedDisputes = disputes.map(d => 
        d.id === disputeId 
          ? { ...d, votes: (d.votes || 0) + 1 }
          : d
      );
      setDisputes(updatedDisputes);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleVoteForFreelancer = async (disputeId: string) => {
    try {
      const tx = await disputeContract.voteOnDispute(disputeId, false);
      alert('Vote submitted successfully! Transaction: ' + tx);
      const updatedDisputes = disputes.map(d => 
        d.id === disputeId 
          ? { ...d, votes: (d.votes || 0) + 1 }
          : d
      );
      setDisputes(updatedDisputes);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleRequestMediation = async (disputeId: string) => {
    try {
      const tx = await disputeContract.requestMediation(disputeId);
      alert('Mediation requested successfully! Transaction: ' + tx);
      const updatedDisputes = disputes.map(d => 
        d.id === disputeId 
          ? { ...d, mediationRequested: true }
          : d
      );
      setDisputes(updatedDisputes);
    } catch (error) {
      console.error('Error requesting mediation:', error);
      alert('Failed to request mediation. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dispute Resolution</h1>
        <Link
          href="/disputes/create"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Create Dispute
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'my-disputes' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('my-disputes')}
          >
            My Disputes
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'all-disputes' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all-disputes')}
          >
            All Disputes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredDisputes.map(dispute => (
          <div key={dispute.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Dispute #{dispute.id}</h2>
                <p className="text-gray-600">{dispute.reason}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {dispute.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-mono">{dispute.clientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Freelancer</p>
                <p className="font-mono">{dispute.freelancerId}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Evidence</p>
              <a 
                href={dispute.evidence}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                View Evidence →
              </a>
            </div>

            {dispute.resolution && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Resolution</p>
                <p className="text-gray-800">{dispute.resolution}</p>
              </div>
            )}

            <div className="text-sm text-gray-500">
              Created: {dispute.createdAt.toLocaleDateString()}
            </div>

            {dispute.status === 'pending' && (
              <div className="mt-6 flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleVoteForClient(dispute.id)}
                >
                  Vote for Client
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleVoteForFreelancer(dispute.id)}
                >
                  Vote for Freelancer
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => handleRequestMediation(dispute.id)}
                >
                  Request Mediation
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredDisputes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No disputes found.</p>
          </div>
        )}
      </div>
    </div>
  );
} 