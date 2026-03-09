import React, { useState } from 'react';
import { ProjectIdea } from '../types';
import ProjectDetails from './ProjectDetails';

interface ProjectCardProps {
  idea: ProjectIdea;
  index: number;
  onSelect: (idea: ProjectIdea) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ idea, index, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails = idea.scope || idea.suggestedStack || idea.difficulty;

  return (
    <div
      className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-sky-500 transition-all duration-300 animate-slide-in-up"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <h4 className="font-bold text-sky-400">{idea.title}</h4>
      <p className="text-slate-300 mt-1">{idea.description}</p>

      {hasDetails && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {isExpanded ? 'Show less' : 'Show details'}
        </button>
      )}

      {isExpanded && hasDetails && <ProjectDetails idea={idea} />}

      <button
        onClick={() => onSelect(idea)}
        className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition duration-300"
      >
        Select & Find Teammates
      </button>
    </div>
  );
};

export default ProjectCard;