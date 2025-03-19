"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Job } from '@/types';
import { useICP } from '@/contexts/ICPContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'smart_contract', name: 'Smart Contracts', icon: '📝' },
  { id: 'defi', name: 'DeFi', icon: '💰' },
  { id: 'nft', name: 'NFT', icon: '🎨' },
  { id: 'frontend', name: 'Frontend', icon: '💻' },
  { id: 'backend', name: 'Backend', icon: '⚙️' },
  { id: 'security', name: 'Security', icon: '🔒' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', name: 'Beginner', description: '0-2 years experience' },
  { id: 'intermediate', name: 'Intermediate', description: '2-5 years experience' },
  { id: 'expert', name: 'Expert', description: '5+ years experience' },
];

const PROJECT_LENGTHS = [
  { id: 'short', name: 'Short Term', description: '< 1 month' },
  { id: 'medium', name: 'Medium Term', description: '1-3 months' },
  { id: 'long', name: 'Long Term', description: '3+ months' },
];

interface FormErrors {
  title?: string;
  description?: string;
  budget?: string;
  skills?: string;
  category?: string;
  experienceLevel?: string;
  projectLength?: string;
}

export default function CreateJob() {
  const router = useRouter();
  const { createJob } = useICP();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    budget: 0,
    deadline: new Date(),
    skills: [],
    category: 'smart_contract',
    experienceLevel: 'intermediate',
    projectLength: 'medium',
    projectType: '',
    paymentType: 'fixed',
  });

  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleAddSkill = () => {
    if (skillInput && !formData.skills?.includes(skillInput)) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput],
      }));
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove),
    }));
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.title?.trim()) {
          newErrors.title = 'Job title is required';
        }
        if (!formData.category) {
          newErrors.category = 'Please select a category';
        }
        break;

      case 2:
        if (!formData.skills?.length) {
          newErrors.skills = 'At least one skill is required';
        }
        if (!formData.experienceLevel) {
          newErrors.experienceLevel = 'Please select experience level';
        }
        break;

      case 3:
        if (!formData.description?.trim()) {
          newErrors.description = 'Project description is required';
        }
        if (!formData.budget || formData.budget <= 0) {
          newErrors.budget = 'Please enter a valid budget';
        }
        if (!formData.projectLength) {
          newErrors.projectLength = 'Please select project length';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    try {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
      } else {
        toast.error('Please fill in all required fields for this step');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate all steps before submitting
      const isStep1Valid = validateStep(1);
      const isStep2Valid = validateStep(2);
      const isStep3Valid = validateStep(3);

      if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
        toast.error('Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);

      // Convert the form data to match the canister interface
      const jobData = {
        id: '', // Will be assigned by the backend
        title: formData.title!,
        description: formData.description!,
        budget: BigInt(formData.budget!),
        deadline: BigInt(new Date(formData.deadline!).getTime()),
        clientId: '', // Will be set by the backend
        status: { open: null },
        createdAt: BigInt(Date.now()),
        category: formData.category!,
        experienceLevel: formData.experienceLevel!,
        projectLength: formData.projectLength!,
        projectType: formData.category!, // Using category as project type
        paymentType: formData.paymentType!,
        skills: formData.skills || [],
      };

      const jobId = await createJob(jobData);
      
      toast.success('Job created successfully!');
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Failed to create job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Job</h1>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
            </div>
            ))}
            </div>
            
          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setErrors({ ...errors, title: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. DeFi Protocol Smart Contract Developer"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: category.id as any })}
                        className={`p-4 rounded-lg border-2 text-left hover:border-blue-500 transition-colors ${
                          formData.category === category.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <span className="text-2xl mb-2">{category.icon}</span>
                        <p className="font-medium">{category.name}</p>
                      </button>
                    ))}
              </div>
            </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Solidity"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, experienceLevel: level.id as any })}
                        className={`p-4 rounded-lg border-2 text-left hover:border-blue-500 transition-colors ${
                          formData.experienceLevel === level.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <p className="font-medium">{level.name}</p>
                        <p className="text-sm text-gray-500">{level.description}</p>
                      </button>
                ))}
              </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (USD)
                  </label>
                <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Length
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PROJECT_LENGTHS.map((length) => (
                      <button
                        key={length.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLength: length.id as any })}
                        className={`p-4 rounded-lg border-2 text-left hover:border-blue-500 transition-colors ${
                          formData.projectLength === length.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <p className="font-medium">{length.name}</p>
                        <p className="text-sm text-gray-500">{length.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project requirements..."
                  />
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
                >
                  Next
                </button>
              ) : (
              <button
                type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    'Create Job'
                  )}
              </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}