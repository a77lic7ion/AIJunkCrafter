import React from 'react';
import { BookmarkIcon, SparklesIcon } from './icons';

interface HeaderProps {
    onShowSaved: () => void;
    savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onShowSaved, savedCount }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <SparklesIcon className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-extrabold text-slate-800">Junk Art Genius</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onShowSaved}
            className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="View saved ideas"
          >
            <BookmarkIcon className="w-5 h-5 mr-2 -ml-1" />
            Saved Ideas
            {savedCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};