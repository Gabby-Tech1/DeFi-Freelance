"use client";

interface PortfolioProject {
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

interface PortfolioCardProps {
  project: PortfolioProject;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {project.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        {project.clientFeedback && (
          <blockquote className="border-l-4 border-blue-500 pl-3 italic text-sm text-gray-600 mb-4">
            "{project.clientFeedback}"
          </blockquote>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {new Date(project.completionDate).toLocaleDateString()}
          </span>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              View Project →
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 