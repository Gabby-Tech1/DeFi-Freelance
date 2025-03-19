"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useICP } from '@/contexts/ICPContext';

interface ContractFormData {
  title: string;
  description: string;
  terms: string[];
  paymentSchedule: {
    amount: number;
    date: string;
    description: string;
  }[];
  deliverables: {
    title: string;
    description: string;
    deadline: string;
  }[];
  disputeResolution: string;
  jurisdiction: string;
}

export default function CreateContract() {
  const router = useRouter();
  const { createContract } = useICP();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    description: '',
    terms: [],
    paymentSchedule: [],
    deliverables: [],
    disputeResolution: '',
    jurisdiction: '',
  });

  const [newTerm, setNewTerm] = useState('');
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    date: '',
    description: '',
  });
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      setFormData(prev => ({
        ...prev,
        terms: [...prev.terms, newTerm.trim()],
      }));
      setNewTerm('');
    }
  };

  const handleAddPayment = () => {
    if (newPayment.amount > 0 && newPayment.date && newPayment.description) {
      setFormData(prev => ({
        ...prev,
        paymentSchedule: [...prev.paymentSchedule, { ...newPayment }],
      }));
      setNewPayment({ amount: 0, date: '', description: '' });
    }
  };

  const handleAddDeliverable = () => {
    if (newDeliverable.title && newDeliverable.deadline) {
      setFormData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, { ...newDeliverable }],
      }));
      setNewDeliverable({ title: '', description: '', deadline: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add contract creation logic here
      toast.success('Contract created successfully!');
      router.push('/contracts');
    } catch (error) {
      toast.error('Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Smart Contract</h1>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
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
                    Contract Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Smart Contract Development Agreement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose and scope of this contract..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms and Conditions
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a term..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTerm}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Term
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.terms.map((term, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              terms: prev.terms.filter((_, i) => i !== index),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
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
                {/* Payment Schedule */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                      placeholder="Amount"
                      className="px-4 py-3 rounded-lg border border-gray-300"
                    />
                    <input
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={newPayment.description}
                      onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                      placeholder="Description"
                      className="px-4 py-3 rounded-lg border border-gray-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Payment Milestone
                  </button>
                  
                  <div className="mt-4 space-y-2">
                    {formData.paymentSchedule.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">${payment.amount}</p>
                          <p className="text-sm text-gray-600">{payment.description}</p>
                          <p className="text-sm text-gray-500">Due: {payment.date}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              paymentSchedule: prev.paymentSchedule.filter((_, i) => i !== index),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
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
                {/* Deliverables */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Deliverables</h3>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                      type="text"
                      value={newDeliverable.title}
                      onChange={(e) => setNewDeliverable({ ...newDeliverable, title: e.target.value })}
                      placeholder="Deliverable Title"
                      className="px-4 py-3 rounded-lg border border-gray-300"
                    />
                    <textarea
                      value={newDeliverable.description}
                      onChange={(e) => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                      className="px-4 py-3 rounded-lg border border-gray-300"
                    />
                    <input
                      type="date"
                      value={newDeliverable.deadline}
                      onChange={(e) => setNewDeliverable({ ...newDeliverable, deadline: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-gray-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Deliverable
                  </button>

                  <div className="mt-4 space-y-2">
                    {formData.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{deliverable.title}</h4>
                            <p className="text-sm text-gray-600">{deliverable.description}</p>
                            <p className="text-sm text-gray-500">Due: {deliverable.deadline}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                deliverables: prev.deliverables.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispute Resolution
                  </label>
                  <textarea
                    value={formData.disputeResolution}
                    onChange={(e) => setFormData({ ...formData, disputeResolution: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe how disputes will be resolved..."
                  />
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
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
                  {isSubmitting ? 'Creating...' : 'Create Contract'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 