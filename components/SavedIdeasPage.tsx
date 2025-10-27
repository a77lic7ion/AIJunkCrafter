import React, { useState } from 'react';
import { TrashIcon, ArrowLeftIcon, DocumentArrowDownIcon } from './icons';
import { CraftIdea } from '../services/geminiService';
import { exportToPdf } from '../services/pdfService';
import { hydrateIdeaWithImages } from '../services/geminiService';

interface SavedIdeasPageProps {
  ideas: CraftIdea[];
  onDelete: (index: number) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export const SavedIdeasPage: React.FC<SavedIdeasPageProps> = ({ ideas, onDelete, onClearAll, onBack }) => {
  const [selectedIdea, setSelectedIdea] = useState<CraftIdea | null>(null);
  const [isHydrating, setIsHydrating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const viewIdea = async (index: number) => {
    const ideaToLoad = ideas[index];
    // Set a temporary selected idea to show title and text while loading images
    setSelectedIdea(ideaToLoad); 
    setIsHydrating(true);
    try {
      const fullIdea = await hydrateIdeaWithImages(ideaToLoad);
      setSelectedIdea(fullIdea);
    } catch (err) {
      console.error("Failed to hydrate idea with images:", err);
      alert("Failed to load images for the idea. Please check your connection and try again.");
    } finally {
      setIsHydrating(false);
    }
  };

  const handleBackToList = () => {
    setSelectedIdea(null);
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    // If the deleted idea is the one being viewed, go back to the list
    if (selectedIdea && ideas[index].title === selectedIdea.title) {
        setSelectedIdea(null);
    }
    onDelete(index);
  };

  const handleClear = () => {
    onClearAll();
    setSelectedIdea(null);
  };

  const handleExport = async () => {
    if (!selectedIdea) return;
    setIsExporting(true);
    const [success, error] = await exportToPdf('saved-craft-idea-view', selectedIdea.title);
    if (!success) {
      alert(error);
    }
    setIsExporting(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-2 min-w-0">
                <button
                    onClick={selectedIdea ? handleBackToList : onBack}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 flex-shrink-0"
                    aria-label={selectedIdea ? "Back to list" : "Back to creator"}
                >
                    <ArrowLeftIcon className="w-6 h-6"/>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 truncate">
                    {selectedIdea ? selectedIdea.title : 'Saved Ideas'}
                </h1>
            </div>
             <div className="flex items-center gap-2 flex-shrink-0">
                {selectedIdea && !isHydrating && (
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-200 flex items-center justify-center"
                        style={{ width: '36px', height: '36px' }}
                        aria-label="Export to PDF"
                    >
                        {isExporting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                        ) : (
                            <DocumentArrowDownIcon className="w-6 h-6" />
                        )}
                    </button>
                )}
                {!selectedIdea && ideas.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                        aria-label="Clear all saved ideas"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>

        {/* Page Content */}
        {selectedIdea ? (
            <div id="saved-craft-idea-view" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Materials Needed</h3>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                    {selectedIdea.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Step-by-Step Instructions</h3>
                  <ol className="space-y-6">
                    {selectedIdea.steps.map((step, index) => (
                      <li key={index} className="flex flex-col md:flex-row items-start gap-4">
                        <div className="flex-shrink-0 w-full md:w-48 h-40 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                           {isHydrating ? (
                             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                           ) : step.imageUrl ? (
                             <img src={step.imageUrl} alt={`Illustration for step ${index + 1}`} className="w-full h-full object-cover"/>
                           ) : (
                             <span className="text-sm text-slate-500 text-center p-2">Image could not be loaded</span>
                           )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">Step {index + 1}</p>
                          <p className="text-slate-600">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
        ) : ideas.length === 0 ? (
            <div className="text-center py-16">
                <div className="inline-block bg-indigo-100 rounded-full p-4">
                   <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">No saved ideas yet!</h3>
                <p className="mt-2 text-slate-500">Go back to the creator and turn your junk into genius.</p>
                <button onClick={onBack} className="mt-6 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create a New Idea
                </button>
            </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea, index) => (
                <div 
                    key={index} 
                    onClick={() => viewIdea(index)}
                    className="bg-slate-50 rounded-lg p-4 border relative group hover:bg-indigo-50 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 truncate">{idea.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 truncate">{idea.materials.join(', ')}</p>
                    </div>
                    <button
                        onClick={(e) => handleDelete(e, index)}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-red-600 flex-shrink-0 z-10"
                        aria-label={`Delete idea: ${idea.title}`}
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
        )}
    </div>
  );
};