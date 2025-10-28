
import React, { useState } from 'react';
import { CraftIdea } from '../services/geminiService';
import { hydrateIdeaWithImages } from '../services/geminiService';
import { ArrowLeftIcon, BookmarkIcon, CheckIcon, LightBulbIcon } from './icons';

interface InspirationPageProps {
  ideas: CraftIdea[];
  savedIdeas: CraftIdea[];
  onSaveIdea: (idea: CraftIdea) => void;
  onBack: () => void;
}

const ProjectCard: React.FC<{ idea: CraftIdea; onClick: () => void; }> = ({ idea, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-lg border border-stone-200 group hover:shadow-md hover:border-stone-300 transition-all cursor-pointer">
        <div className="w-full h-40 bg-stone-100 rounded-t-lg flex items-center justify-center">
            <LightBulbIcon className="w-12 h-12 text-stone-300" />
        </div>
        <div className="p-4">
             <h3 className="text-md font-bold text-slate-800 group-hover:text-slate-900 truncate">{idea.title}</h3>
             <p className="text-sm text-slate-500 mt-1 truncate">{idea.materials.join(', ')}</p>
        </div>
    </div>
);

export const InspirationPage: React.FC<InspirationPageProps> = ({ ideas, savedIdeas, onSaveIdea, onBack }) => {
  const [selectedIdea, setSelectedIdea] = useState<CraftIdea | null>(null);
  const [isHydrating, setIsHydrating] = useState(false);

  const viewIdea = async (ideaToLoad: CraftIdea) => {
    setSelectedIdea(ideaToLoad); 
    setIsHydrating(true);
    try {
      await hydrateIdeaWithImages(ideaToLoad, (updatedStep, stepIndex) => {
        // Progressively update the state as each image is loaded
        setSelectedIdea(currentIdea => {
          // Ensure we're updating the correct idea to avoid race conditions
          if (!currentIdea || currentIdea.title !== ideaToLoad.title) return currentIdea;
          
          const newSteps = [...currentIdea.steps];
          newSteps[stepIndex] = updatedStep;
          return { ...currentIdea, steps: newSteps };
        });
      });
    } catch (err: any) {
      console.error("Failed to hydrate idea with images:", err);
      alert(err.message || "Failed to load images for the idea. Please check your connection and try again.");
      setSelectedIdea(null); // Reset if hydration fails
    } finally {
      setIsHydrating(false);
    }
  };

  const handleBackToList = () => {
    setSelectedIdea(null);
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
                            <button
                                onClick={() => onSaveIdea(selectedIdea)}
                                disabled={savedIdeas.some(idea => idea.title === selectedIdea.title)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md disabled:bg-green-600 disabled:cursor-not-allowed bg-slate-800 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                            >
                                {savedIdeas.some(idea => idea.title === selectedIdea.title) ? (
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
                        )}
                    </div>
                </div>

                <div className="space-y-8">
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
                               {isHydrating && !step.imageUrl ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-800"></div> : step.imageUrl ? <img src={step.imageUrl} alt={`Illustration for step ${index + 1}`} className="w-full h-full object-cover"/> : <span className="text-sm text-slate-500 text-center p-2">Image could not be loaded</span>}
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
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Inspiration Gallery</h1>
                    <p className="text-slate-500 mt-1 max-w-2xl mx-auto">Browse through these pre-made ideas to spark your next creative project.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea, index) => <ProjectCard key={index} idea={idea} onClick={() => viewIdea(idea)} />)}
                </div>
            </>
        )}
    </div>
  );
};