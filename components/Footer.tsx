import React from 'react';
import { LogoIcon } from './icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-16">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <LogoIcon className="w-6 h-6 text-slate-600" />
            <span className="text-md font-bold text-slate-600">Junk Art Genius</span>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800">About</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800">Contact</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800">Terms of Service</a>
          </div>
        </div>
        <div className="text-center text-sm text-slate-400 mt-6 pt-6 border-t border-stone-200">
          &copy; {new Date().getFullYear()} Junk Art Genius. All rights reserved.
        </div>
      </div>
    </footer>
  );
};