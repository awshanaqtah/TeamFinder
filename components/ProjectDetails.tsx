import React from 'react';
import { ProjectIdea } from '../types';

interface ProjectDetailsProps {
  idea: ProjectIdea;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ idea }) => {
  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (!idea.scope && !idea.suggestedStack && !idea.difficulty) {
    return null;
  }

  return (
    <div className="border-t border-slate-600 mt-4 pt-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {idea.scope && (
          <div>
            <h5 className="font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Scope
            </h5>
            <p className="text-sm text-slate-400 leading-relaxed">{idea.scope}</p>
          </div>
        )}

        {idea.suggestedStack && (
          <div>
            <h5 className="font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Suggested Stack
            </h5>
            <p className="text-sm text-slate-400 leading-relaxed">{idea.suggestedStack}</p>
          </div>
        )}

        {idea.difficulty && (
          <div className="md:col-span-2">
            <h5 className="font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Difficulty
            </h5>
            <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full border ${getDifficultyColor(idea.difficulty)}`}>
              {idea.difficulty}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;