import React from 'react';

interface HeaderProps {
  bookmarkCount?: number;
  onBookmarkClick?: () => void;
  username?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ bookmarkCount = 0, onBookmarkClick, username, onLogout }) => {
  return (
    <header className="animate-fade-in">
      <div className="relative flex justify-between items-start gap-4">
        {/* User Info & Logout */}
        {username && onLogout && (
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-300 text-sm font-medium">{username}</span>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 text-slate-400 hover:text-red-400 transition-colors p-1"
              aria-label="Logout"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex-1 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Group Project Finder
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Discover your next great project and connect with teammates.
          </p>
        </div>

        {onBookmarkClick && (
          <button
            onClick={onBookmarkClick}
            className="relative group bg-slate-700/50 hover:bg-slate-700 rounded-lg p-2 transition-colors"
            aria-label="View bookmarks"
          >
            <svg
              className={`w-6 h-6 ${
                bookmarkCount > 0 ? 'text-pink-500 animate-pulse-slow' : 'text-slate-400 group-hover:text-pink-400'
              } transition-colors`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78l-1.06-1.06L12 5.67Z"
              />
            </svg>
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-slow">
                {bookmarkCount > 9 ? '9+' : bookmarkCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;