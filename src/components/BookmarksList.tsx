import React from 'react';
import { ProjectIdea } from '../types';
import ProjectCard from './ProjectCard';

interface BookmarksListProps {
  bookmarks: ProjectIdea[];
  onClose: () => void;
  onSelectProject: (project: ProjectIdea) => void;
  onRemoveBookmark: (projectTitle: string) => void;
}

const BookmarksList: React.FC<BookmarksListProps> = ({
  bookmarks,
  onClose,
  onSelectProject,
  onRemoveBookmark
}) => {
  if (bookmarks.length === 0) {
    return (
      <div className="animate-slide-in-right">
        <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78l-1.06-1.06L12 5.67Z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Bookmarks Yet</h3>
            <p className="text-slate-400">
              Bookmark projects you're interested in to find them here later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78l-1.06-1.06L12 5.67Z" />
            </svg>
            Saved Projects ({bookmarks.length})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close bookmarks"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {bookmarks.map((project, index) => (
            <div
              key={project.title}
              className="bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 transition-all duration-200 card-hover-lift"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                    {project.difficulty && (
                      <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                        project.difficulty === 'Beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : project.difficulty === 'Intermediate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {project.difficulty}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(project.title)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-1"
                      aria-label="Remove bookmark"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0 1 1.138 21H12.862a2 2 0 0 1-1.995-1.858L10 7m9 0h-6m4 0V5a2 2 0 0 0 0-4h-4a2 2 0 0 0 0 4v2m0 0h4M9 7h1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarksList;
