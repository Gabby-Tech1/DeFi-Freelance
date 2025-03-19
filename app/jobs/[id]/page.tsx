"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Job } from '@/types';

const MOCK_JOB: Job = {
  id: '1',
  title: 'DeFi Protocol Smart Contract Developer',
  description: `We're looking for an experienced Solidity developer to help build and audit our DeFi lending protocol. The ideal candidate will have extensive experience with:

• Smart contract development and security best practices
• DeFi protocols and tokenomics
• Automated testing and formal verification
• Code optimization and gas efficiency`,
  budget: 5000,
  deadline: new Date('2024-02-28'),
  clientId: '0xabc...123',
  skills: ['Solidity', 'DeFi', 'Smart Contracts', 'Security'],
  status: 'open',
  createdAt: new Date('2024-01-15'),
  proposals: [],
  requirements: [
    'At least 3 years of Solidity development experience',
    'Previous experience with DeFi protocols',
    'Strong understanding of blockchain security',
    'Excellent communication skills',
  ],
  scope: [
    'Smart contract development and testing',
    'Security audit and optimization',
    'Documentation and technical specifications',
    'Integration support',
  ]
};

export default function JobDetails() {
  const params = useParams();
  const [isApplying, setIsApplying] = useState(false);
  const [proposal, setProposal] = useState({
    coverLetter: '',
    bid: MOCK_JOB.budget,
    timeframe: 30,
  });

  // In a real app, fetch job data using params.id
  const job = MOCK_JOB;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle proposal submission
    console.log('Submitting proposal:', proposal);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{job.proposals?.length || 0} proposals</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">${job.budget}</p>
                  <p className="text-sm text-gray-500">Fixed Price</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Project Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Project Scope */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Project Scope</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.scope?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Application Form */}
            {isApplying && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Submit Proposal</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Cover Letter</label>
                    <textarea
                      value={proposal.coverLetter}
                      onChange={(e) => setProposal(prev => ({ ...prev, coverLetter: e.target.value }))}
                      className="w-full p-3 border rounded-lg h-40"
                      placeholder="Introduce yourself and explain why you're the best fit for this project..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Bid Amount ($)</label>
                      <input
                        type="number"
                        value={proposal.bid}
                        onChange={(e) => setProposal(prev => ({ ...prev, bid: Number(e.target.value) }))}
                        className="w-full p-3 border rounded-lg"
                        min={0}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Delivery Time (days)</label>
                      <input
                        type="number"
                        value={proposal.timeframe}
                        onChange={(e) => setProposal(prev => ({ ...prev, timeframe: Number(e.target.value) }))}
                        className="w-full p-3 border rounded-lg"
                        min={1}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit Proposal
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Button */}
            {!isApplying && (
              <button
                onClick={() => setIsApplying(true)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Apply Now
              </button>
            )}

            {/* Client Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">About the Client</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span>Remote</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Jobs Posted</span>
                  <span>12</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span>$25,000+</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span>Jan 2023</span>
                </p>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    href={`/jobs/${i}`}
                    className="block hover:bg-gray-50 -mx-6 px-6 py-3"
                  >
                    <h4 className="font-medium text-blue-600">Similar Job Title {i}</h4>
                    <p className="text-sm text-gray-500">$3000 - Fixed Price</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 