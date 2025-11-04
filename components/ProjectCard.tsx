import React from 'react';
import { ProjectIdea } from '../types';

interface ProjectCardProps {
  idea: ProjectIdea;
  index: number;
  onSelect: (idea: ProjectIdea) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ idea, index, onSelect }) => {
  return (
    <div
      className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-sky-500 transition-all duration-300 animate-slide-in-up"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <h4 className="font-bold text-sky-400">{idea.title}</h4>
      <p className="text-slate-300 mt-1">{idea.description}</p>
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