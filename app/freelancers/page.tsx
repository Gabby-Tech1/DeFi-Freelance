"use client";

import { useState } from 'react';
import { User } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReviewCard from '@/components/ReviewCard';
import RequestServiceModal from '@/components/RequestServiceModal';
import Pagination from '@/components/Pagination';

const MOCK_FREELANCERS: User[] = [
  {
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
    ],
  },
  {
    id: '2',
    address: '0x5678...1234',
    username: 'frontend_wizard',
    bio: 'Web3 frontend developer specializing in React and dApp integration.',
    skills: ['React', 'TypeScript', 'Web3.js', 'UI/UX'],
    rating: 4.6,
    nftBadges: [
      {
        id: '2',
        name: 'React Master',
        description: 'Built 20+ dApp frontends',
        image: '/badges/react.png',
        attributes: {
          skill: 'React',
          level: 'expert',
        },
      },
    ],
  },
];

interface SortOption {
  label: string;
  value: 'rating' | 'experience' | 'completedJobs' | 'hourlyRate' | 'recentActivity' | 'successRate' | 'responseTime';
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Rating: High to Low', value: 'rating' },
  { label: 'Experience: Most to Least', value: 'experience' },
  { label: 'Completed Jobs', value: 'completedJobs' },
  { label: 'Hourly Rate: Low to High', value: 'hourlyRate' },
  { label: 'Recent Activity', value: 'recentActivity' },
  { label: 'Success Rate', value: 'successRate' },
  { label: 'Response Time', value: 'responseTime' },
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const AVAILABILITY = ['Full-time', 'Part-time', 'Hourly'];

export default function Freelancers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption['value']>('rating');
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const allSkills = Array.from(
    new Set(MOCK_FREELANCERS.flatMap(f => f.skills))
  ).sort();

  const filteredFreelancers = MOCK_FREELANCERS.filter(freelancer => {
    const matchesSearch = 
      freelancer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = 
      selectedSkills.length === 0 ||
      selectedSkills.every(skill => freelancer.skills.includes(skill));
    
    const matchesRating = freelancer.rating >= minRating;

    return matchesSearch && matchesSkills && matchesRating;
  });

  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return (b.workHistory?.length || 0) - (a.workHistory?.length || 0);
      case 'completedJobs':
        return (
          (b.workHistory?.filter(w => w.status === 'completed').length || 0) -
          (a.workHistory?.filter(w => w.status === 'completed').length || 0)
        );
      case 'hourlyRate':
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      case 'recentActivity':
        return (
          new Date(b.lastActive || 0).getTime() -
          new Date(a.lastActive || 0).getTime()
        );
      case 'successRate':
        const getSuccessRate = (freelancer: User) => {
          const completed = freelancer.workHistory?.filter(
            w => w.status === 'completed'
          ).length || 0;
          const total = freelancer.workHistory?.length || 1;
          return completed / total;
        };
        return getSuccessRate(b) - getSuccessRate(a);
      case 'responseTime':
        return (a.averageResponseTime || 0) - (b.averageResponseTime || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedFreelancers.length / ITEMS_PER_PAGE);
  const paginatedFreelancers = sortedFreelancers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Find Expert Blockchain Developers
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8">
            Connect with top Web3 talent for your next project
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by skills, expertise, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Skills</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSelectedSkills(prev =>
                        prev.includes(skill)
                          ? prev.filter(s => s !== skill)
                          : [...prev, skill]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Minimum Rating
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-gray-600 min-w-[4rem]">
                  {minRating} stars
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFreelancers.map((freelancer, index) => (
            <motion.div
              key={freelancer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {freelancer.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {freelancer.username}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    {'★'.repeat(Math.floor(freelancer.rating))}
                    {'☆'.repeat(5 - Math.floor(freelancer.rating))}
                    <span className="ml-2 text-gray-600 text-sm">
                      ({freelancer.rating})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {freelancer.bio}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href={`/freelancers/${freelancer.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Profile →
                </Link>
                <Link
                  href={`/messages/${freelancer.id}`}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {paginatedFreelancers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">
              No freelancers found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add the request service modal */}
      {selectedFreelancer && (
        <RequestServiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFreelancer(null);
          }}
          onSubmit={(request) => {
            // Handle service request
            console.log('Service request:', request);
            setIsModalOpen(false);
            setSelectedFreelancer(null);
          }}
          freelancerName={selectedFreelancer.username}
        />
      )}
    </div>
  );
} 