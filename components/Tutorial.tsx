import React from 'react';
import { CameraIcon, CheckCircleIcon, LightBulbIcon } from './icons';

interface TutorialProps {
  onDismiss: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onDismiss }) => {
  return (
    <div className="w-full max-w-4xl bg-stone-100/80 border border-stone-200 rounded-lg p-6 mb-8 shadow-sm relative animate-fade-in">
      <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">How It Works in 3 Easy Steps!</h3>
      <div className="grid md:grid-cols-3 gap-6 text-slate-700">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-stone-200 mb-3">
            <CameraIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h4 className="font-semibold">1. Snap or Upload</h4>
            <p className="text-sm text-slate-500 mt-1">Provide an image of random items you want to repurpose.</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-stone-200 mb-3">
            <CheckCircleIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h4 className="font-semibold">2. Select Supplies</h4>
            <p className="text-sm text-slate-500 mt-1">Let the AI know what extra craft supplies you have on hand.</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-stone-200 mb-3">
            <LightBulbIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h4 className="font-semibold">3. Get a Creative Idea!</h4>
            <p className="text-sm text-slate-500 mt-1">Receive a unique craft idea with step-by-step instructions.</p>
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={onDismiss}
          className="px-5 py-2 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-transform transform hover:scale-105"
          aria-label="Dismiss tutorial"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};