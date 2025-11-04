import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
        Group Project Finder
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Discover your next great project and connect with teammates.
      </p>
    </header>
  );
};

export default Header;