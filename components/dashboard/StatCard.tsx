"use client";

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  const isPositive = trend.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="text-blue-600">{icon}</div>
        </div>
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </span>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </motion.div>
  );
} 