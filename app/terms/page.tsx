"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-8"
        >
          <div className="border-b pb-8">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-gray-600">Last updated: March 1, 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">1. Agreement to Terms</h2>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <p className="text-yellow-800">
                By accessing or using FreelanceConnect, you agree to be bound by these Terms of Service.
              </p>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>
                These terms govern your use of our platform and the services we provide. Please read them carefully before using our services.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. Platform Rules</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">User Responsibilities</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.1</span>
                    Maintain accurate profile information
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.2</span>
                    Use escrow services for all transactions
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.3</span>
                    Respect intellectual property rights
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.4</span>
                    Follow community guidelines
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. Smart Contracts</h2>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <p className="text-purple-800">
                All transactions are governed by smart contracts deployed on the Internet Computer blockchain.
              </p>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>Smart contracts handle:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment escrow</li>
                <li>Milestone releases</li>
                <li>Dispute resolution</li>
                <li>Platform fees</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">4. Dispute Resolution</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Resolution Process</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Direct Resolution</p>
                    <p className="text-gray-600">Parties attempt to resolve disputes through platform messaging</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mediation</p>
                    <p className="text-gray-600">Platform mediators review evidence and facilitate resolution</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Final Decision</p>
                    <p className="text-gray-600">Platform makes binding decision based on evidence</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">5. Termination</h2>
            <div className="text-gray-600 space-y-3">
              <p>
                We reserve the right to terminate or suspend your account for violations of these terms, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fraudulent activity</li>
                <li>Violation of community guidelines</li>
                <li>Misuse of platform services</li>
                <li>Non-compliance with escrow requirements</li>
              </ul>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <Link 
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Privacy Policy →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 