"use client";

import { useState } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    comment: string;
    skills: { [key: string]: number };
    recommend: boolean;
    communicationRating: number;
    qualityRating: number;
    timelinessRating: number;
  }) => void;
  freelancerName: string;
  skills: string[];
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  freelancerName,
  skills,
}: ReviewModalProps) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    skills: Object.fromEntries(skills.map(skill => [skill, 5])),
    recommend: true,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Review {freelancerName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl ${
                    star <= formData.rating
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Detailed Ratings</label>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Communication</p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.communicationRating}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      communicationRating: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quality of Work</p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.qualityRating}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      qualityRating: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Adherence to Timeline</p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.timelinessRating}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      timelinessRating: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Skill Ratings</label>
            <div className="space-y-4">
              {skills.map(skill => (
                <div key={skill}>
                  <p className="text-sm text-gray-600">{skill}</p>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.skills[skill]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          [skill]: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Review Comment</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, comment: e.target.value }))
              }
              className="w-full p-3 border rounded-lg"
              rows={4}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.recommend}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, recommend: e.target.checked }))
              }
              className="mr-2"
            />
            <label className="text-gray-700">
              Would you recommend this freelancer?
            </label>
          </div>

          <div className="flex gap-4">
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
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 