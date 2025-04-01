"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { User, Job, NFTBadge } from '@/types';
import Link from 'next/link';
import JobCard from '@/components/dashboard/JobCard';
import StatCard from '@/components/dashboard/StatCard';
import { useWebSocket } from '@/hooks/useWebSocket';
import EarningsChart from '@/components/dashboard/EarningsChart';
import TaskList from '@/components/dashboard/TaskList';
import TaskModal from '@/components/dashboard/TaskModal';
import JobFilters from '@/components/dashboard/JobFilters';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { 
  BellIcon, 
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import { useRouter } from 'next/navigation';
import { useICP } from '@/contexts/ICPContext';


interface DashboardStats {
  totalEarnings: number;
  activeJobs: number;
  completedJobs: number;
  averageRating: number;
}

const MOCK_JOBS = [
  {
    id: '1',
    title: 'DeFi Protocol Development',
    description: 'Building a decentralized lending protocol',
    budget: 5000,
    deadline: new Date('2024-03-01'),
    clientId: 'client1',
    skills: ['Solidity', 'DeFi', 'Smart Contracts'],
    status: 'in_progress',
    createdAt: new Date(),
    category: 'defi',
    experienceLevel: 'expert',
    projectLength: 'medium',
    projectType: 'smart_contract',
    paymentType: 'fixed',
  },
  {
    id: '2',
    title: 'Smart Contract Audit',
    status: 'completed',
    budget: 1500,
    deadline: new Date('2023-11-15'),
    clientId: '0x5678...1234',
    paymentStatus: 'paid',
  },
];

const MOCK_CLIENT_JOBS = [
  {
    id: '1',
    title: 'DeFi Protocol Development',
    status: 'in_progress',
    budget: 2000,
    deadline: new Date('2023-12-31'),
    applicants: 5,
    hiredFreelancer: '0x8765...4321',
  },
  {
    id: '2',
    title: 'NFT Marketplace Development',
    status: 'open',
    budget: 3000,
    deadline: new Date('2024-01-15'),
    applicants: 3,
    hiredFreelancer: null,
  },
];

const MOCK_BADGES: NFTBadge[] = [
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
];

const MOCK_EARNINGS_DATA = [
  { month: 'Jan', earnings: 1200 },
  { month: 'Feb', earnings: 1800 },
  { month: 'Mar', earnings: 1500 },
  { month: 'Apr', earnings: 2200 },
  { month: 'May', earnings: 2800 },
  { month: 'Jun', earnings: 3200 },
];

const MOCK_TASKS = [
  {
    id: '1',
    title: 'Complete DeFi Protocol Frontend',
    deadline: new Date('2023-12-20'),
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Review Smart Contract Tests',
    deadline: new Date('2023-12-22'),
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Submit Project Documentation',
    deadline: new Date('2023-12-25'),
    priority: 'low',
    completed: true,
  },
] as const;

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useICP();
  const { isConnected, connectWallet, address } = useWallet();
  const [userType, setUserType] = useState<'freelancer' | 'client'>('freelancer');
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 12500,
    activeJobs: 2,
    completedJobs: 15,
    averageRating: 4.8,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const socket = useWebSocket();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Render auth check state
  if (!isAuthenticated) {
    return null;
  }

  // Render wallet connection prompt
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-6">Please connect your wallet to view your dashboard.</p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // Render main dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your projects.
          </p>
      </div>
      
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings}`}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            trend="+12.5%"
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs.toString()}
            icon={<ClockIcon className="h-6 w-6" />}
            trend="+2"
          />
          <StatCard
            title="Completed Jobs"
            value={stats.completedJobs.toString()}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            trend="+5"
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toString()}
            icon={<StarIcon className="h-6 w-6" />}
            trend="+0.2"
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
              <EarningsChart />
            </motion.div>

            {/* Active Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Active Jobs</h2>
              <div className="space-y-4">
                {MOCK_JOBS.map(job => (
                  <JobCard key={job.id} job={job} />
                  ))}
                </div>
            </motion.div>

            {/* Task Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Tasks</h2>
              <TaskList />
            </motion.div>
                </div>
                
          {/* Right Column */}
          <div className="space-y-8">
            {/* Notification Center */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <BellIcon className="h-6 w-6 text-gray-400" />
              </div>
              <NotificationCenter />
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Calendar</h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full"
              />
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Upcoming Deadlines
                </h3>
                <div className="space-y-2">
                  {MOCK_TASKS.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">
                          Due: {format(task.deadline, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {MOCK_TASKS.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0">
                      {task.completed ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{format(task.deadline, 'MMM dd, yyyy')}</p>
                    </div>
                      </div>
                    ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}