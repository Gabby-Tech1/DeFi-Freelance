"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/hooks/useWallet';

const BENEFITS = [
  {
    title: 'Lower Fees',
    description: 'Save up to 90% on platform fees compared to traditional freelance platforms',
    icon: '💰',
  },
  {
    title: 'Instant Payments',
    description: 'Get paid instantly through smart contracts once work is approved',
    icon: '⚡',
  },
  {
    title: 'Reputation NFTs',
    description: 'Earn verifiable reputation badges that showcase your expertise',
    icon: '🏆',
  },
  {
    title: 'Secure Escrow',
    description: 'Funds are held safely in smart contracts until work is completed',
    icon: '🔒',
  },
];

const TESTIMONIALS = [
  {
    name: 'Alex Thompson',
    role: 'Blockchain Developer',
    content: 'The NFT badges I\'ve earned have helped me stand out and land high-value projects.',
    image: '/testimonials/alex.jpg',
  },
  {
    name: 'Sarah Chen',
    role: 'Project Manager',
    content: 'As a client, I love the security of the escrow system and the quality of talent.',
    image: '/testimonials/sarah.jpg',
  },
];

const FAQS = [
  {
    question: 'How does the payment system work?',
    answer: 'Payments are handled through smart contracts. Clients deposit funds into escrow, and payments are automatically released to freelancers upon work approval.',
  },
  {
    question: 'What are Reputation NFTs?',
    answer: 'Reputation NFTs are blockchain-verified badges that freelancers earn based on successful project completions and client ratings.',
  },
  // Add more FAQs...
];

export default function Home() {
  const { isConnected, connectWallet } = useWallet();
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative -mt-20 pt-32 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
              <circle cx="400" cy="400" r="400" fill="url(#paint0_radial)" />
              <defs>
                <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block">Decentralized</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Freelance Marketplace</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect, collaborate, and earn in a trustless environment with secure blockchain payments and verifiable reputation.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {!isConnected ? (
                  <button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <>
                    <Link 
                      href="/jobs"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      Find Work
                    </Link>
                    <Link
                      href="/jobs/create"
                      className="bg-white text-gray-800 border border-gray-200 px-8 py-4 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      Post a Job
                    </Link>
                  </>
                )}
              </div>
              
              <div className="mt-12 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-${i*100} to-purple-${i*100} flex items-center justify-center text-white font-bold`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Trusted by <span className="font-bold">1,000+</span> freelancers</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full relative">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl transform rotate-6 shadow-xl"></div>
                <div className="absolute bottom-0 left-0 w-4/5 h-4/5 bg-white rounded-2xl shadow-xl p-6">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">C</div>
                      <div className="ml-3">
                        <p className="font-semibold">Client</p>
                        <div className="flex text-yellow-500 text-xs">
                          <span>★★★★★</span>
                        </div>
                      </div>
                      <div className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="border-t border-gray-100 py-4">
                      <h3 className="font-bold text-lg mb-2">Smart Contract Developer Needed</h3>
                      <p className="text-gray-600 text-sm mb-3">Looking for an experienced Solidity developer to create a DeFi protocol...</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Solidity</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Ethereum</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">DeFi</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-green-600">$2,000</span>
                        <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Apply Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DeFi Freelance?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {FAQS.map((faq, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}