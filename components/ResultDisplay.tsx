import React, { useState } from 'react';
import { BookmarkIcon, CheckIcon, ShareIcon, DocumentArrowDownIcon } from './icons';
import { CraftIdea } from '../services/geminiService';
import { exportToPdf } from '../services/pdfService';

interface ResultDisplayProps {
  result: CraftIdea;
  onSave: () => void;
  onShare: () => void;
  isSaved: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onSave, onShare, isSaved }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const [success, error] = await exportToPdf('craft-idea-result', result.title);
    if (!success) {
        alert(error);
    }
    setIsExporting(false);
  };
  
  return (
    <div id="craft-idea-result" className="mt-8 bg-white rounded-lg animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pt-6 px-6">
        <h2 className="text-3xl font-bold text-slate-800 flex-1">{result.title}</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
           <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md bg-white text-slate-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors disabled:opacity-50"
          >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2 -ml-1" />
              {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
              onClick={onShare}
              className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md bg-white text-slate-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
          >
              <ShareIcon className="w-5 h-5 mr-2 -ml-1" />
              Share
          </button>
          <button
              onClick={onSave}
              disabled={isSaved}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md disabled:bg-green-600 disabled:cursor-not-allowed bg-slate-800 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
              {isSaved ? (
                  <>
                  <CheckIcon className="w-5 h-5 mr-2 -ml-1" />
                  Saved
                  </>
              ) : (
                  <>
                  <BookmarkIcon className="w-5 h-5 mr-2 -ml-1" />
                  Save Idea
                  </>
              )}
          </button>
        </div>
       </div>

      <div className="result-content text-slate-600 space-y-8 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Materials Needed</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            {result.materials.map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Instructions</h3>
          <ol className="space-y-6">
            {result.steps.map((step, index) => (
              <li key={index} className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-full md:w-56 h-48 bg-stone-100 border border-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                   {step.imageUrl ? (
                     <img src={step.imageUrl} alt={`Illustration for step ${index + 1}`} className="w-full h-full object-cover"/>
                   ) : (
                     <span className="text-sm text-slate-500">Image not available</span>
                   )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 mb-1">Step {index + 1}</p>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};