"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-8"
        >
          <div className="border-b pb-8">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-gray-600">Last updated: March 1, 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-blue-800">
                We prioritize your privacy and only collect information that's essential for providing our services.
              </p>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your Internet Computer Principal ID</li>
                <li>Profile information you choose to provide</li>
                <li>Transaction history on the platform</li>
                <li>Communication records between users</li>
                <li>Smart contract interaction data</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Platform Operations</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Facilitating transactions</li>
                  <li>• Managing escrow services</li>
                  <li>• User authentication</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Service Improvement</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Platform analytics</li>
                  <li>• Feature development</li>
                  <li>• Security enhancement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <p className="text-green-800">
                Your data is secured using industry-standard encryption and blockchain technology.
              </p>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>We implement several security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Regular security audits</li>
                <li>Secure smart contract implementations</li>
                <li>Decentralized data storage</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about our privacy policy, please contact us at{' '}
              <a href="mailto:privacy@freelanceconnect.com" className="text-blue-600 hover:text-blue-700">
                privacy@freelanceconnect.com
              </a>
            </p>
          </section>

          <div className="border-t pt-8 mt-8">
            <Link 
              href="/terms"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Terms of Service →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 