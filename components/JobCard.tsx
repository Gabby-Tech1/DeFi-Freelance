"use client";

import { Job } from '@/types';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          job.status === 'open' 
            ? 'bg-green-100 text-green-800' 
            : job.status === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : job.status === 'completed'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {job.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-5">
        {job.skills.map((skill, index) => (
          <span 
            key={index} 
            className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div>
          <p className="text-green-600 font-bold text-lg">${job.budget}</p>
          <p className="text-xs text-gray-500">
          Due: {new Date(job.deadline).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        
        <Link 
          href={`/jobs/${job.id}`}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;