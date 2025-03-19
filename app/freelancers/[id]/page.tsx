"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@/types';
import { Chart } from 'chart.js/auto';
import { motion } from 'framer-motion';
import ReviewCard from '@/components/ReviewCard';
import RequestServiceModal from '@/components/RequestServiceModal';
import PortfolioSection from '@/components/freelancers/PortfolioSection';
import ContactSection from '@/components/freelancers/ContactSection';
import StatsSection from '@/components/freelancers/StatsSection';

const MOCK_FREELANCER: User = {
  id: '1',
  address: '0x1234...5678',
  username: 'blockchain_dev',
  bio: 'Experienced Solidity developer with 5+ years in DeFi protocols.',
  skills: ['Solidity', 'Ethereum', 'DeFi', 'Smart Contracts'],
  rating: 4.8,
  hourlyRate: 150,
  availability: 'Full-time',
  location: 'Remote',
  languages: ['English', 'Spanish'],
  lastActive: new Date(),
  completedJobs: 45,
  successRate: 98,
  responseTime: 2,
  skillStats: {
    'Smart Contracts': 95,
    'DeFi': 90,
    'Security': 85,
    'Frontend': 75,
    'Testing': 80
  },
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
  workHistory: [
    {
      id: '1',
      jobId: '1',
      clientId: '1',
      rating: 5,
      review: 'Excellent work on our DeFi protocol. Highly recommended!',
      completedDate: new Date('2024-01-15'),
      status: 'completed',
    },
  ],
  portfolio: [
    {
      id: '1',
      title: 'DeFi Lending Protocol',
      description: 'Developed a decentralized lending protocol with automated interest rate adjustment.',
      imageUrl: '/projects/defi-lending.jpg',
      technologies: ['Solidity', 'React', 'Web3.js', 'TypeScript'],
      completionDate: new Date('2024-01-15'),
      category: 'DeFi',
      clientFeedback: 'Excellent work on implementing complex financial logic securely.',
      link: 'https://example.com/defi-project',
    },
  ],
};

export default function FreelancerProfile() {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [freelancer, setFreelancer] = useState<User>(MOCK_FREELANCER);

  useEffect(() => {
    // In a real app, fetch freelancer data using params.id
    setFreelancer(MOCK_FREELANCER);
  }, [params.id]);

  useEffect(() => {
    if (!chartRef.current || !freelancer.skillStats) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const skillLabels = Object.keys(freelancer.skillStats);
    const skillValues = Object.values(freelancer.skillStats);

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: skillLabels,
        datasets: [{
          label: 'Skill Proficiency',
          data: skillValues,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)',
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    return () => chart.destroy();
  }, [freelancer.skillStats]);

  const handleRequestService = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-40 h-40"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-5xl font-bold shadow-xl">
                {freelancer.username.charAt(0).toUpperCase()}
              </div>
              {freelancer.isOnline && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              )}
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{freelancer.username}</h1>
                <p className="text-blue-100 text-lg mb-4">{freelancer.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {freelancer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-white/10 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-blue-100">
                  <span className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span> {freelancer.rating}
                    <span className="text-blue-200">({freelancer.workHistory?.length || 0} reviews)</span>
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-2">
                    <span>🌍</span> {freelancer.location || 'Remote'}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-2">
                    <span>🕒</span> Last active {freelancer.lastActive ? new Date(freelancer.lastActive).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={handleRequestService}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Hire Me
              </button>
              <button className="bg-blue-500/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors">
                View Portfolio
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Skills Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Skills Proficiency</h2>
              <canvas ref={chartRef} className="w-full max-w-2xl mx-auto"></canvas>
            </motion.div>

            {/* Portfolio Section */}
            {freelancer.portfolio && freelancer.portfolio.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PortfolioSection projects={freelancer.portfolio} />
              </motion.div>
            )}

            {/* Work History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Work History</h2>
              <div className="space-y-6">
                {freelancer.workHistory?.map((work) => (
                  <ReviewCard key={work.id} review={work} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <ContactSection
              freelancerName={freelancer.username}
              isOnline={true}
              lastActive={freelancer.lastActive}
              responseTime={freelancer.responseTime}
            />
            
            <StatsSection
              hourlyRate={freelancer.hourlyRate}
              completedJobs={freelancer.completedJobs}
              successRate={freelancer.successRate}
              responseTime={freelancer.responseTime}
              totalEarned={25000}
              availability={freelancer.availability}
            />

            {/* Languages */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.languages?.map((language, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* NFT Badges */}
            {freelancer.nftBadges && freelancer.nftBadges.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">NFT Badges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {freelancer.nftBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg hover:from-purple-500/20 hover:to-pink-500/20 transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                        🏆
                      </div>
                      <p className="text-sm font-medium text-center text-gray-700">{badge.name}</p>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white rounded-lg p-3 transition-opacity">
                        <p className="text-xs text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <RequestServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log('Service request:', data);
          setIsModalOpen(false);
        }}
        freelancerName={freelancer.username}
      />
    </div>
  );
} 