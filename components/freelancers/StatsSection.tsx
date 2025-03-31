"use client";

import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface StatsSectionProps {
  hourlyRate?: number;
  completedJobs?: number;
  successRate?: number;
  responseTime?: number;
  totalEarned?: number;
  availability?: string;
}

export default function StatsSection({
  hourlyRate,
  completedJobs,
  successRate,
  responseTime,
  totalEarned,
  availability
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <StatCard
        label="Hourly Rate"
        value={hourlyRate ? `$${hourlyRate}` : 'N/A'}
        icon="💰"
        color="bg-green-500"
      />
      <StatCard
        label="Jobs Completed"
        value={completedJobs || 0}
        icon="✅"
        color="bg-blue-500"
      />
      <StatCard
        label="Success Rate"
        value={`${successRate || 0}%`}
        icon="⭐"
        color="bg-yellow-500"
      />
      <StatCard
        label="Response Time"
        value={responseTime ? `${responseTime}h` : 'N/A'}
        icon="⚡"
        color="bg-purple-500"
      />
      {totalEarned && (
        <StatCard
          label="Total Earned"
          value={`$${totalEarned.toLocaleString()}`}
          icon="💎"
          color="bg-indigo-500"
        />
      )}
      {availability && (
        <StatCard
          label="Availability"
          value={availability}
          icon="📅"
          color="bg-pink-500"
        />
      )}
    </div>
  );
} 