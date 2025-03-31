"use client";

import { Job } from '@/types';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
  showActions?: boolean;
}

export default function JobCard({ job, showActions = true }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          </Link>
          <p className="text-gray-600 mt-1">
            {job.description}
          </p>
          <div className="mt-2 flex gap-2">
            {job.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-600">Client: {job.clientId}</p>
          <p className="text-gray-600">
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">${job.budget}</p>
          <span className={`text-sm ${
            job.status === 'completed' ? 'text-green-600' :
            job.status === 'in_progress' ? 'text-blue-600' :
            'text-yellow-600'
          }`}>
            {job.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      {showActions && (
        <div className="mt-4 flex gap-4">
          <Link
            href={`/messages/${job.clientId}`}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Message Client
          </Link>
          <Link
            href={`/escrow/${job.id}`}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            View Escrow
          </Link>
        </div>
      )}
    </div>
  );
} 