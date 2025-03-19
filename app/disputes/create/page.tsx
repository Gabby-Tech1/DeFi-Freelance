"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { disputeContract } from '@/contracts/DisputeContract';

export default function CreateDispute() {
  const router = useRouter();
  const { isConnected, connectWallet } = useWallet();
  
  const [formData, setFormData] = useState({
    jobId: '',
    reason: '',
    evidence: '',
    description: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-6">Please connect your wallet to create a dispute.</p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const tx = await disputeContract.createDispute(
        formData.jobId,
        formData.reason,
        formData.evidence
      );
      alert('Dispute created successfully! Transaction: ' + tx);
      router.push('/disputes');
    } catch (error) {
      console.error('Error creating dispute:', error);
      alert('Failed to create dispute. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Dispute</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Job ID</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.jobId}
                onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
                placeholder="Enter the job ID"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Reason for Dispute</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                required
              >
                <option value="">Select a reason</option>
                <option value="quality">Work Quality Issues</option>
                <option value="deadline">Missed Deadline</option>
                <option value="communication">Communication Problems</option>
                <option value="payment">Payment Dispute</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Detailed Description</label>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of the issue..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Evidence Link</label>
              <input
                type="url"
                className="w-full p-3 border rounded-lg"
                value={formData.evidence}
                onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
                placeholder="Link to evidence (documents, screenshots, etc.)"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Dispute'}
        </button>
      </form>
    </div>
  );
} 