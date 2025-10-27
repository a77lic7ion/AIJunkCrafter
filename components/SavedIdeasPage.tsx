
import React, { useState } from 'react';
// Fix: Import the missing BookmarkIcon to be used in the empty state view.
import { TrashIcon, ArrowLeftIcon, DocumentArrowDownIcon, LightBulbIcon, BookmarkIcon } from './icons';
import { CraftIdea } from '../services/geminiService';
import { exportToPdf } from '../services/pdfService';
import { hydrateIdeaWithImages } from '../services/geminiService';

interface SavedIdeasPageProps {
  ideas: CraftIdea[];
  onDelete: (index: number) => void;
  onClearAll: () => void;
  onBack: () => void;
}

const ProjectCard: React.FC<{ idea: CraftIdea; onClick: () => void; onDelete: (e: React.MouseEvent) => void; }> = ({ idea, onClick, onDelete }) => (
    <div onClick={onClick} className="bg-white rounded-lg border border-stone-200 group hover:shadow-md hover:border-stone-300 transition-all cursor-pointer">
        <div className="w-full h-40 bg-stone-100 rounded-t-lg flex items-center justify-center">
            <LightBulbIcon className="w-12 h-12 text-stone-300" />
        </div>
        <div className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                    <h3 className="text-md font-bold text-slate-800 group-hover:text-slate-900 truncate">{idea.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 truncate">{idea.materials.join(', ')}</p>
                </div>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-full text-slate-400 hover:bg-stone-100 hover:text-red-600 flex-shrink-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete idea: ${idea.title}`}
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
);

export const SavedIdeasPage: React.FC<SavedIdeasPageProps> = ({ ideas, onDelete, onClearAll, onBack }) => {
  const [selectedIdea, setSelectedIdea] = useState<CraftIdea | null>(null);
  const [isHydrating, setIsHydrating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const viewIdea = async (index: number) => {
    const ideaToLoad = ideas[index];
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
    <div className="container mx-auto p-4 md:p-8 max-w-5xl animate-fade-in">
        {selectedIdea ? (
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200">
                <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <button onClick={handleBackToList} className="p-2 rounded-full text-slate-500 hover:bg-stone-100 flex-shrink-0" aria-label="Back to list">
                            <ArrowLeftIcon className="w-6 h-6"/>
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 truncate">{selectedIdea.title}</h1>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {!isHydrating && (
                            <button onClick={handleExport} disabled={isExporting} className="p-2 rounded-full text-slate-500 hover:bg-stone-100 flex items-center justify-center" style={{ width: '36px', height: '36px' }} aria-label="Export to PDF">
                                {isExporting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-800"></div> : <DocumentArrowDownIcon className="w-6 h-6" />}
                            </button>
                        )}
                    </div>
                </div>

                <div id="saved-craft-idea-view" className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">Materials Needed</h3>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                        {selectedIdea.materials.map((material, index) => <li key={index}>{material}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">Instructions</h3>
                      <ol className="space-y-6">
                        {selectedIdea.steps.map((step, index) => (
                          <li key={index} className="flex flex-col md:flex-row items-start gap-6">
                            <div className="flex-shrink-0 w-full md:w-56 h-48 bg-stone-100 border border-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                               {isHydrating ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-800"></div> : step.imageUrl ? <img src={step.imageUrl} alt={`Illustration for step ${index + 1}`} className="w-full h-full object-cover"/> : <span className="text-sm text-slate-500 text-center p-2">Image could not be loaded</span>}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800 mb-1">Step {index + 1}</p>
                              <p className="text-slate-600">{step.text}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Featured Projects</h1>
                        <p className="text-slate-500 mt-1">A collection of your saved creative ideas.</p>
                    </div>
                    {ideas.length > 0 && <button onClick={handleClear} className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors">Clear All</button>}
                </div>

                {ideas.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-stone-300 rounded-lg">
                        <div className="inline-block bg-stone-100 rounded-full p-4">
                           <BookmarkIcon className="w-12 h-12 text-stone-400"/>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-800">No projects saved yet!</h3>
                        <p className="mt-2 text-slate-500">Go back to the creator and turn your junk into genius.</p>
                        <button onClick={onBack} className="mt-6 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                            Create a New Idea
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ideas.map((idea, index) => <ProjectCard key={index} idea={idea} onClick={() => viewIdea(index)} onDelete={(e) => handleDelete(e, index)} />)}
                    </div>
                )}
            </>
        )}
    </div>
  );
};
