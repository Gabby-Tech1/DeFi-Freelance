export interface User {
    id: string;
    address: string;
    username: string;
    bio?: string;
    skills: string[];
    rating: number;
    nftBadges?: NFTBadge[];
    workHistory?: WorkHistory[];
    hourlyRate?: number;
    availability?: 'Full-time' | 'Part-time' | 'Hourly';
    location?: string;
    languages?: string[];
    lastActive?: Date;
    completedJobs?: number;
    successRate?: number;
    responseTime?: number;
    portfolio?: PortfolioProject[];
    skillStats?: { [key: string]: number };
    isOnline?: boolean;
    totalEarnings?: number;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: Date;
    clientId: string;
    skills: string[];
    status: 'open' | 'in_progress' | 'completed';
    createdAt: Date;
    proposals?: JobProposal[];
    requirements?: string[];
    scope?: string[];
    category: 'smart_contract' | 'defi' | 'nft' | 'frontend' | 'backend' | 'security';
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    projectLength: 'short' | 'medium' | 'long';
    projectType: string;
    paymentType: 'fixed' | 'hourly';
}

export interface JobProposal {
    id: string;
    jobId: string;
    freelancerId: string;
    coverLetter: string;
    bid: number;
    timeframe: number;
    status: 'draft' | 'pending' | 'accepted' | 'rejected' | 'withdrawn';
    createdAt: Date;
    attachments?: FileAttachment[];
    milestones?: ProposalMilestone[];
    lastUpdated?: Date;
    clientFeedback?: string;
}

export interface NFTBadge {
    id: string;
    name: string;
    description: string;
    image: string;
    attributes: {
        skill: string;
        level: 'beginner' | 'intermediate' | 'expert';
    };
}

export interface Review {
    id: string;
    jobId: string;
    clientId: string;
    clientName: string;
    jobTitle: string;
    rating: number;
    review: string;
    completedDate: Date;
    status?: 'completed' | 'in_progress' | 'cancelled';
    comment: string;
    date: Date;
}

export interface WorkHistory extends Review {
    freelancerId?: string;
}

export interface Dispute {
    id: string;
    jobId: string;
    clientId: string;
    freelancerId: string;
    reason: string;
    evidence: string;
    status: 'pending' | 'resolved' | 'rejected';
    resolution?: string;
    createdAt: Date;
}

export interface FileAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
}

export interface ProposalMilestone {
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'paid';
}

export interface PortfolioProject {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    link?: string;
    completionDate: Date;
    clientFeedback?: string;
    category: 'Web3' | 'DeFi' | 'NFT' | 'Smart Contract' | 'dApp';
}

export interface ValidationErrors {
    coverLetter?: string;
    bid?: string;
    timeframe?: string;
    milestones?: {
        [key: string]: {
            title?: string;
            amount?: string;
        };
        total?: string;
    };
}