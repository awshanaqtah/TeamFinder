import React, { useState } from 'react';
import { ProjectIdea } from '../types';
import ProjectDetails from './ProjectDetails';
import BookmarkButton from './BookmarkButton';
import { saveTextFile } from '../lib/platform';

interface ProjectCardProps {
  idea: ProjectIdea;
  index: number;
  onSelect: (idea: ProjectIdea) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (idea: ProjectIdea) => void;
  isCompared?: boolean;
  onToggleCompare?: (idea: ProjectIdea) => void;
  onAnalyzeGap?: (idea: ProjectIdea) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  idea,
  index,
  onSelect,
  isBookmarked = false,
  onBookmarkToggle,
  isCompared = false,
  onToggleCompare,
  onAnalyzeGap
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails = idea.scope || idea.suggestedStack || idea.difficulty;

  const handleSaveProject = async () => {
    const content = `Project: ${idea.title}

Description: ${idea.description}

${idea.scope ? `Scope: ${idea.scope}\n\n` : ''}${idea.suggestedStack ? `Suggested Stack: ${idea.suggestedStack}\n\n` : ''}${idea.difficulty ? `Difficulty: ${idea.difficulty}` : ''}`;

    try {
      await saveTextFile(`${idea.title}.txt`, content);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <div
      className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-sky-500 transition-all duration-300 animate-slide-in-up card-hover-lift relative"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h4 className="font-bold text-sky-400">{idea.title}</h4>
          <p className="text-slate-300 mt-1">{idea.description}</p>
        </div>

        <div className="flex flex-col gap-2">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare?.(idea)}
              className={`w-6 h-6 rounded border-2 transition-all hover-scale-up ${
                isCompared
                  ? 'bg-sky-500 border-sky-400'
                  : 'border-slate-600 hover:border-sky-400'
              }`}
              aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
              title={isCompared ? 'Remove from comparison' : 'Compare'}
            >
              {isCompared && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>
          )}
          {onBookmarkToggle && (
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={() => onBookmarkToggle?.(idea)}
            />
          )}
          <button
            onClick={handleSaveProject}
            className="w-6 h-6 rounded border-2 border-slate-600 hover:border-green-400 transition-all hover-scale-up flex items-center justify-center"
            aria-label="Save project to file"
            title="Save to file"
          >
            <svg className="w-4 h-4 text-slate-400 hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
        </div>
      </div>

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

      <div className="flex gap-2 mt-4">
        {onAnalyzeGap && (
          <button
            onClick={() => onAnalyzeGap(idea)}
            className="flex-1 bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analyze Gap
          </button>
        )}
        <button
          onClick={() => onSelect(idea)}
          className={`${
            onAnalyzeGap ? 'flex-[2]' : 'flex-1'
          } bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition duration-300`}
        >
          Select & Find Teammates
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;