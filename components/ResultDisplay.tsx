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
    <div id="craft-idea-result" className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-indigo-800 flex-1">{result.title}</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
           <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full bg-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors disabled:bg-slate-400"
          >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2 -ml-1" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
              onClick={onShare}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full bg-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
              <ShareIcon className="w-5 h-5 mr-2 -ml-1" />
              Share
          </button>
          <button
              onClick={onSave}
              disabled={isSaved}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full disabled:bg-green-500 disabled:cursor-not-allowed bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
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

      <div className="result-content text-slate-700 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mt-4 mb-2">Materials Needed</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            {result.materials.map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mt-4 mb-2">Step-by-Step Instructions</h3>
          <ol className="space-y-6">
            {result.steps.map((step, index) => (
              <li key={index} className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-shrink-0 w-full md:w-48 h-40 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                   {step.imageUrl ? (
                     <img src={step.imageUrl} alt={`Illustration for step ${index + 1}`} className="w-full h-full object-cover"/>
                   ) : (
                     <span className="text-sm text-slate-500">Image not available</span>
                   )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Step {index + 1}</p>
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