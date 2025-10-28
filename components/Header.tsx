import React from 'react';
import { LogoIcon, SearchIcon, BellIcon } from './icons';
import { AppView } from '../App';

interface HeaderProps {
  currentView: AppView;
  onSetView: (view: AppView) => void;
}

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'text-slate-900'
        : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    {label}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onSetView }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo and Nav */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onSetView('home')}>
              <LogoIcon className="w-7 h-7 text-slate-800" />
              <span className="text-lg font-bold text-slate-800 tracking-tight">Junk Art Genius</span>
            </div>
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink label="Home" isActive={currentView === 'home'} onClick={() => onSetView('home')} />
              <NavLink label="Projects" isActive={currentView === 'projects'} onClick={() => onSetView('projects')} />
              <NavLink label="Materials" isActive={currentView === 'materials'} onClick={() => onSetView('materials')} />
              <NavLink label="Inspiration" isActive={currentView === 'inspiration'} onClick={() => onSetView('inspiration')} />
            </nav>
          </div>

          {/* Right side: Search, Notifications, Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="search"
                placeholder="Search"
                className="bg-stone-100 border border-stone-200 rounded-md pl-10 pr-4 py-1.5 text-sm w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <button className="p-2 rounded-full text-slate-500 hover:bg-stone-100 hover:text-slate-800 transition-colors">
              <BellIcon className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
              <img src="https://i.pravatar.cc/40" alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};