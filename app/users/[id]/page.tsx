"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { User, NFTBadge, WorkHistory } from '@/types';

const MOCK_USER: User = {
  id: '1',
  address: '0x1234...5678',
  username: 'blockchain_dev',
  bio: 'Experienced Solidity developer with 5+ years in DeFi protocols.',
  skills: ['Solidity', 'Ethereum', 'DeFi', 'Smart Contracts'],
  rating: 4.8,
  nftBadges: [
    {
      id: '1',
      name: 'Solidity Expert',
      description: 'Completed 10+ smart contract projects',
      image: '/badges/solidity.png',
      attributes: {
        skill: 'Solidity',
        level: 'expert',
      },
    },
    {
      id: '2',
      name: 'Top Rated',
      description: 'Maintained 4.5+ rating for 6 months',
      image: '/badges/top-rated.png',
      attributes: {
        skill: 'General',
        level: 'expert',
      },
    },
  ],
  workHistory: [
    {
      id: '1',
      jobId: 'job1',
      clientId: 'client1',
      rating: 5,
      review: 'Excellent work on our DeFi protocol. Very professional.',
      completedDate: new Date('2023-09-01'),
    },
    {
      id: '2',
      jobId: 'job2',
      clientId: 'client2',
      rating: 4.5,
      review: 'Great communication and delivered on time.',
      completedDate: new Date('2023-08-15'),
    },
  ],
};

export default function UserProfile() {
  const params = useParams();
  const [user] = useState<User>(MOCK_USER);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{user.rating} / 5</span>
            </div>
            <p className="text-gray-600 mt-1 font-mono">{user.address}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600">{user.bio}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* NFT Badges */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.nftBadges?.map(badge => (
            <div key={badge.id} className="border rounded-lg p-4">
              <img
                src={badge.image}
                alt={badge.name}
                className="w-16 h-16 mx-auto mb-3"
              />
              <h3 className="text-lg font-semibold text-center mb-1">{badge.name}</h3>
              <p className="text-gray-600 text-sm text-center">{badge.description}</p>
              <div className="mt-2 text-center">
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {badge.attributes.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Work History</h2>
        <div className="space-y-6">
          {user.workHistory?.map(work => (
            <div key={work.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Job #{work.jobId}</h3>
                  <p className="text-gray-600 text-sm">
                    Completed {work.completedDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{work.rating}</span>
                </div>
              </div>
              <p className="text-gray-600">{work.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 