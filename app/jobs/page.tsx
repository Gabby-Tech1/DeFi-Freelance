"use client";

import { useState } from 'react';
import { Job } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'DeFi Protocol Smart Contract Developer',
    description: 'Looking for an experienced Solidity developer to build and audit our DeFi lending protocol.',
    budget: 5000,
    deadline: new Date('2024-02-28'),
    clientId: '0xabc...123',
    skills: ['Solidity', 'DeFi', 'Smart Contracts', 'Security'],
    status: 'open',
    createdAt: new Date('2024-01-15'),
    proposals: [],
    paymentType: 'fixed',
    experienceLevel: 'expert',
    projectLength: 'medium',
    projectType: 'smart_contract',
  },
  // Add more mock jobs...
];

const CATEGORIES = [
  { id: 'smart_contract', name: 'Smart Contracts', icon: '📝' },
  { id: 'defi', name: 'DeFi', icon: '💰' },
  { id: 'nft', name: 'NFT', icon: '🎨' },
  { id: 'frontend', name: 'Frontend', icon: '💻' },
  { id: 'backend', name: 'Backend', icon: '⚙️' },
  { id: 'security', name: 'Security', icon: '🔒' },
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 10000 });
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const allSkills = Array.from(
    new Set(MOCK_JOBS.flatMap(job => job.skills))
  ).sort();

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || job.projectType === selectedCategory;
    
    const matchesSkills = 
      selectedSkills.length === 0 ||
      selectedSkills.every(skill => job.skills.includes(skill));
    
    const matchesBudget = 
      job.budget >= budgetRange.min && job.budget <= budgetRange.max;
    
    const matchesExperience = !experienceLevel || job.experienceLevel === experienceLevel;

    return matchesSearch && matchesCategory && matchesSkills && matchesBudget && matchesExperience;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Find Web3 Projects
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8">
            Discover opportunities in blockchain development
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
              placeholder="Search jobs by title, skills, or keywords..."
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

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? '' : category.id
                )}
                className={`p-4 rounded-lg text-center transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl mb-2 block">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <label className="block text-gray-700 mb-2 font-medium">Budget Range</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={budgetRange.max}
                  onChange={(e) => setBudgetRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${budgetRange.min}</span>
                  <span>${budgetRange.max}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Any Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-xl font-semibold hover:text-blue-600 transition-colors"
                  >
                    {job.title}
                  </Link>
                  <p className="text-gray-600 mt-2">{job.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${job.budget}</p>
                  <p className="text-sm text-gray-500">{job.paymentType}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{job.proposals.length} proposals</span>
                  <span>•</span>
                  <span>{job.experienceLevel}</span>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Apply Now →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">
              No jobs found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}