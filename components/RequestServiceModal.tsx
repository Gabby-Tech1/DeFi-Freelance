"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: {
    title: string;
    description: string;
    budget: number;
    deadline: Date;
  }) => void;
  freelancerName: string;
}

export default function RequestServiceModal({
  isOpen,
  onClose,
  onSubmit,
  freelancerName,
}: RequestServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit({
        ...formData,
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline),
      });
      toast.success(`Service request sent to ${freelancerName} successfully!`);
      onClose();
    } catch (error) {
      console.error('Error sending service request:', error);
      toast.error('Failed to send service request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request Service from {freelancerName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Budget (USD)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}