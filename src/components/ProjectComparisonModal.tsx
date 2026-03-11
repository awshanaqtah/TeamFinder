import React from 'react';
import { ProjectIdea } from '../types';
import { getComparisonColor, getMaxProjectsToCompare } from '../services/projectComparisonService';

interface ProjectComparisonModalProps {
  projects: ProjectIdea[];
  onClose: () => void;
  onSelectProject: (project: ProjectIdea) => void;
  onRemoveFromComparison: (projectTitle: string) => void;
}

const ProjectComparisonModal: React.FC<ProjectComparisonModalProps> = ({
  projects,
  onClose,
  onSelectProject,
  onRemoveFromComparison
}) => {
  const maxProjects = getMaxProjectsToCompare();
  const isFull = projects.length >= maxProjects;

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

  const calculateScore = (project: ProjectIdea): number => {
    let score = 0;
    if (project.difficulty === 'Beginner') score += 1;
    if (project.difficulty === 'Intermediate') score += 2;
    if (project.difficulty === 'Advanced') score += 3;
    if (project.scope) score += project.scope.length / 50;
    if (project.suggestedStack) score += project.suggestedStack.split(',').length / 5;
    return score;
  };

  const sortedProjects = [...projects].sort((a, b) => calculateScore(b) - calculateScore(a));
  const highestScore = calculateScore(sortedProjects[0]);
  const lowestScore = calculateScore(sortedProjects[sortedProjects.length - 1]);

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-5xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare Projects ({projects.length}/{maxProjects})
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedProjects.map((project, index) => {
            const score = calculateScore(project);
            const isHighest = score === highestScore;
            const isLowest = score === lowestScore && !isHighest;
            const borderClass = getComparisonColor(isHighest, isLowest);

            return (
              <div
                key={project.title}
                className={`bg-slate-700/30 rounded-lg border-2 p-4 transition-all hover-scale-up ${borderClass}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-white">{project.title}</h4>
                  <button
                    onClick={() => onRemoveFromComparison(project.title)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    aria-label="Remove from comparison"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Difficulty Badge */}
                {project.difficulty && (
                  <span className={`inline-block text-xs px-3 py-1 rounded-full border-2 mb-3 ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                )}

                {/* Description */}
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{project.description}</p>

                {/* Tech Stack */}
                {project.suggestedStack && (
                  <div className="mb-3">
                    <h5 className="text-xs font-semibold text-slate-300 mb-1">Suggested Stack</h5>
                    <p className="text-sm text-slate-400 bg-slate-800/50 rounded p-2">
                      {project.suggestedStack}
                    </p>
                  </div>
                )}

                {/* Scope */}
                {project.scope && (
                  <div className="mb-3">
                    <h5 className="text-xs font-semibold text-slate-300 mb-1">Scope</h5>
                    <p className="text-sm text-slate-400 bg-slate-800/50 rounded p-2">
                      {project.scope}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">Legend</h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 bg-green-500"></div>
              <span className="text-slate-400">Best match</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 bg-red-500"></div>
              <span className="text-slate-400">Consider alternatives</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectComparisonModal;
