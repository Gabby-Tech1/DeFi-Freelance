"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileAttachment, ProposalMilestone } from '@/types';

interface ValidationErrors {
  coverLetter?: string;
  bid?: string;
  timeframe?: string;
  milestones?: { [key: string]: { title?: string; amount?: string } };
}

interface ProposalFormProps {
  jobId: string;
  budget: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ProposalForm({ jobId, budget, onSubmit, onCancel }: ProposalFormProps) {
  const [formData, setFormData] = useState({
    coverLetter: '',
    bid: budget,
    timeframe: 30,
    milestones: [] as ProposalMilestone[],
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isDraft, setIsDraft] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload these files to your storage
    const newAttachments: FileAttachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: Math.random().toString(),
          title: '',
          description: '',
          amount: formData.bid / (prev.milestones.length + 1),
          dueDate: new Date(),
          status: 'pending',
        },
      ],
    }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Validate cover letter
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter should be at least 100 characters';
    }

    // Validate bid
    if (formData.bid <= 0) {
      newErrors.bid = 'Bid amount must be greater than 0';
    } else if (formData.bid < budget * 0.5) {
      newErrors.bid = 'Bid amount seems too low';
    }

    // Validate timeframe
    if (formData.timeframe <= 0) {
      newErrors.timeframe = 'Delivery time must be greater than 0';
    }

    // Validate milestones
    if (formData.milestones.length > 0) {
      const milestoneErrors: { [key: string]: { title?: string; amount?: string } } = {};
      let totalAmount = 0;

      formData.milestones.forEach((milestone, index) => {
        if (!milestone.title.trim()) {
          milestoneErrors[index] = { ...milestoneErrors[index], title: 'Title is required' };
        }
        if (milestone.amount <= 0) {
          milestoneErrors[index] = { ...milestoneErrors[index], amount: 'Amount must be greater than 0' };
        }
        totalAmount += milestone.amount;
      });

      if (totalAmount !== formData.bid) {
        newErrors.milestones = {
          ...milestoneErrors,
          total: `Total milestone amounts (${totalAmount}) must equal bid amount (${formData.bid})`
        };
      } else if (Object.keys(milestoneErrors).length > 0) {
        newErrors.milestones = milestoneErrors;
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      attachments,
      status: isDraft ? 'draft' : 'pending',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Submit Proposal</h2>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Basics', 'Details', 'Review'].map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index < currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${index < currentStep ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="ml-2">{step}</span>
            {index < 2 && <div className="flex-1 h-0.5 mx-4 bg-gray-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Cover Letter</label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                className={`w-full p-3 border rounded-lg h-40 ${
                  errors.coverLetter ? 'border-red-500' : ''
                }`}
                placeholder="Introduce yourself and explain why you're the best fit for this project..."
                required
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Bid Amount ($)</label>
                <input
                  type="number"
                  value={formData.bid}
                  onChange={(e) => setFormData(prev => ({ ...prev, bid: Number(e.target.value) }))}
                  className={`w-full p-3 border rounded-lg ${
                    errors.bid ? 'border-red-500' : ''
                  }`}
                  min={0}
                  required
                />
                {errors.bid && (
                  <p className="text-red-500 text-sm mt-1">{errors.bid}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Delivery Time (days)</label>
                <input
                  type="number"
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: Number(e.target.value) }))}
                  className="w-full p-3 border rounded-lg"
                  min={1}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Upload Files
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  Support for PDF, DOC, Images up to 10MB
                </p>
              </div>
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map(file => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(prev => prev.filter(f => f.id !== file.id))}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-gray-700">Milestones</label>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Milestone
                </button>
              </div>
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <input
                      type="text"
                      placeholder="Milestone Title"
                      value={milestone.title}
                      onChange={(e) => {
                        const newMilestones = [...formData.milestones];
                        newMilestones[index].title = e.target.value;
                        setFormData(prev => ({ ...prev, milestones: newMilestones }));
                      }}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <textarea
                      placeholder="Description"
                      value={milestone.description}
                      onChange={(e) => {
                        const newMilestones = [...formData.milestones];
                        newMilestones[index].description = e.target.value;
                        setFormData(prev => ({ ...prev, milestones: newMilestones }));
                      }}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={milestone.amount}
                        onChange={(e) => {
                          const newMilestones = [...formData.milestones];
                          newMilestones[index].amount = Number(e.target.value);
                          setFormData(prev => ({ ...prev, milestones: newMilestones }));
                        }}
                        className="p-2 border rounded"
                      />
                      <input
                        type="date"
                        value={new Date(milestone.dueDate).toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newMilestones = [...formData.milestones];
                          newMilestones[index].dueDate = new Date(e.target.value);
                          setFormData(prev => ({ ...prev, milestones: newMilestones }));
                        }}
                        className="p-2 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Proposal Summary</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Bid Amount:</dt>
                  <dd className="font-medium">${formData.bid}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Delivery Time:</dt>
                  <dd className="font-medium">{formData.timeframe} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Attachments:</dt>
                  <dd className="font-medium">{attachments.length} files</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Milestones:</dt>
                  <dd className="font-medium">{formData.milestones.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          
          <div className="space-x-4">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!isValid}
              >
                Next
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsDraft(true);
                    handleSubmit;
                  }}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!isValid}
                >
                  Submit Proposal
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
} 