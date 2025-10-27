import React, { useRef, useState } from 'react';
import { UploadIcon, CameraIcon, SparklesIcon, ArrowPathIcon, SettingsIcon } from './icons';
import { SettingsPopover } from './SettingsPopover';
import { GenerationConfig } from '../services/geminiService';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imageUrl: string | null;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  hasResult: boolean;
  availableSupplies: string[];
  selectedSupplies: string[];
  onSupplyToggle: (supply: string) => void;
  customIdea: string;
  onCustomIdeaChange: (idea: string) => void;
  generationConfig: GenerationConfig;
  onGenerationConfigChange: (config: GenerationConfig) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageChange, 
  imageUrl, 
  onGenerate, 
  onReset,
  isLoading,
  hasResult,
  availableSupplies,
  selectedSupplies,
  onSupplyToggle,
  customIdea,
  onCustomIdeaChange,
  generationConfig,
  onGenerationConfigChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  if(hasResult) {
     return (
        <div className="text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-transform transform hover:scale-105"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2 -ml-1"/>
            Create Another
          </button>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {imageUrl ? (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-md mb-6 rounded-lg overflow-hidden shadow-md border border-stone-200">
            <img src={imageUrl} alt="Uploaded junk" className="w-full h-auto object-contain" />
          </div>

          <div className="w-full max-w-md mb-6">
            <label htmlFor="custom-idea" className="block text-base font-medium text-slate-700 mb-2 text-center">Have your own idea? <span className="text-slate-500">(Optional)</span></label>
            <input
                type="text"
                id="custom-idea"
                value={customIdea}
                onChange={(e) => onCustomIdeaChange(e.target.value)}
                placeholder="e.g., A rocket ship from these bottles"
                className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-slate-500 focus:border-slate-500 text-center"
            />
          </div>

          <div className="w-full max-w-lg mb-6 text-center">
            <h3 className="text-base font-medium text-slate-700 mb-3">What extra supplies do you have?</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableSupplies.map(supply => (
                <button
                  key={supply}
                  onClick={() => onSupplyToggle(supply)}
                  className={`capitalize px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 ${
                    selectedSupplies.includes(supply)
                      ? 'bg-slate-800 text-white'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                  }`}
                >
                  {supply}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center gap-2">
            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-transform transform hover:scale-105"
            >
              <SparklesIcon className="w-5 h-5 mr-3 -ml-1" />
              {isLoading ? 'Thinking...' : 'Generate Idea'}
            </button>
             <button
                onClick={() => setShowSettings(prev => !prev)}
                className="p-3 rounded-full text-slate-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
                aria-label="Generation Settings"
              >
                <SettingsIcon className="w-6 h-6" />
              </button>
            {showSettings && (
              <SettingsPopover
                config={generationConfig}
                onConfigChange={onGenerationConfigChange}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full p-8 border-2 border-dashed border-stone-300 rounded-lg text-center">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={triggerFileSelect}
              className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all"
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Upload Photo
            </button>
             <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              id="cameraInput"
            />
            <label htmlFor="cameraInput" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all cursor-pointer">
              <CameraIcon className="w-5 h-5 mr-2" />
              Use Camera
            </label>
          </div>
           <p className="mt-4 text-sm text-slate-500">Take a picture or upload an image of your items.</p>
        </div>
      )}
    </div>
  );
};