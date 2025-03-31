"use client";

const FAQ_ITEMS = [
  {
    question: "What is DeFi Freelance?",
    answer: "DeFi Freelance is a decentralized marketplace connecting freelancers and clients through blockchain technology. We use smart contracts for secure payments and NFT badges for reputation verification."
  },
  {
    question: "How do payments work?",
    answer: "Payments are handled through smart contracts. When a client hires a freelancer, the payment is held in an escrow contract. Once the work is approved, the payment is automatically released to the freelancer."
  },
  {
    question: "What are NFT Badges?",
    answer: "NFT Badges are blockchain-verified achievements that freelancers earn based on their performance. These include skill certifications, experience levels, and client satisfaction ratings."
  },
  {
    question: "How do I get started as a freelancer?",
    answer: "1. Connect your wallet\n2. Create your profile\n3. Add your skills and portfolio\n4. Browse and apply for jobs\n5. Start earning and building your reputation"
  },
  {
    question: "How do I hire freelancers?",
    answer: "1. Connect your wallet\n2. Post a job with clear requirements\n3. Review proposals from freelancers\n4. Select a freelancer and fund the escrow\n5. Approve work and release payment"
  },
  {
    question: "What if there's a dispute?",
    answer: "We have a DAO-based dispute resolution system. If there's a disagreement, both parties can submit evidence, and the community votes on the resolution."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept ICP (Internet Computer Protocol), Wrapped ETH, and USDC for payments. All transactions are handled through smart contracts for security."
  },
  {
    question: "How are fees calculated?",
    answer: "Our platform charges a minimal fee of 1-2% per transaction, significantly lower than traditional freelance platforms. This fee helps maintain the platform and reward DAO participants."
  }
];

export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-3">{item.question}</h2>
            <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Our support team is here to help you get started.
        </p>
        <a
          href="/contact"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
} 