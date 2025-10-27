import React from 'react';
import { CameraIcon, CheckCircleIcon, LightBulbIcon } from './icons';

interface TutorialProps {
  onDismiss: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onDismiss }) => {
  return (
    <div className="w-full max-w-4xl bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg p-6 mb-8 shadow-md relative animate-fade-in">
      <h3 className="text-xl font-bold text-indigo-800 mb-4">How It Works - 3 Easy Steps!</h3>
      <div className="space-y-4 text-indigo-700">
        <div className="flex items-start">
          <CameraIcon className="w-8 h-8 text-indigo-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold">1. Snap or Upload a Photo</h4>
            <p className="text-sm">Use your camera or upload an image of random items, junk, or household clutter you want to repurpose.</p>
          </div>
        </div>
        <div className="flex items-start">
          <CheckCircleIcon className="w-8 h-8 text-indigo-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold">2. Select Your Supplies</h4>
            <p className="text-sm">Let the AI know what extra craft supplies (like glue, paint, or tape) you have on hand.</p>
          </div>
        </div>
        <div className="flex items-start">
          <LightBulbIcon className="w-8 h-8 text-indigo-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold">3. Get a Creative Idea!</h4>
            <p className="text-sm">Our AI will instantly generate a unique and fun craft idea with step-by-step instructions.</p>
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={onDismiss}
          className="px-5 py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          aria-label="Dismiss tutorial"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};