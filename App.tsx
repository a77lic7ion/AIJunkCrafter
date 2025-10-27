import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Tutorial } from './components/Tutorial';
import { SavedIdeasPage } from './components/SavedIdeasPage';
import { generateCraftIdea, CraftIdea, GenerationConfig } from './services/geminiService';

const AVAILABLE_SUPPLIES = ['construction paper', 'cotton balls', 'crayons', 'glitter', 'glue', 'googly eyes', 'markers', 'paint', 'pipe cleaners', 'ribbons', 'scissors', 'stickers', 'string', 'tape'];

type AppView = 'creator' | 'saved';

function App() {
  const [view, setView] = useState<AppView>('creator');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
  const [customIdea, setCustomIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<CraftIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig>({
    temperature: 0.8,
    topK: 40,
    topP: 0.95,
  });
  const [savedIdeas, setSavedIdeas] = useState<CraftIdea[]>(() => {
    try {
      const saved = localStorage.getItem('savedCraftIdeas');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse saved ideas from localStorage", e);
      return [];
    }
  });

  // Helper function to update state and localStorage together atomically
  const updateSavedIdeas = (newIdeas: CraftIdea[]) => {
    try {
      localStorage.setItem('savedCraftIdeas', JSON.stringify(newIdeas));
      setSavedIdeas(newIdeas); // Only update state on successful save
    } catch (e) {
      console.error("Failed to update localStorage:", e);
      alert("Could not save the change. Your browser's storage might be full. Please try deleting some old ideas to make space.");
    }
  };
  
  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleSupplyToggle = (supply: string) => {
    setSelectedSupplies(prev =>
      prev.includes(supply)
        ? prev.filter(s => s !== supply)
        : [...prev, supply]
    );
  };

  const handleCustomIdeaChange = (idea: string) => {
    setCustomIdea(idea);
  };

  const handleGenerate = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setLoadingMessage('Brewing a creative idea...');
    setError(null);
    setResult(null);
    try {
      const idea = await generateCraftIdea(imageFile, selectedSupplies, customIdea, (message: string) => setLoadingMessage(message), generationConfig);
      setResult(idea);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setSelectedSupplies([]);
    setCustomIdea('');
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleSaveIdea = () => {
    if (result) {
      // Create a "lean" version of the idea without the bulky image URLs for storage
      const leanResult: CraftIdea = {
        ...result,
        steps: result.steps.map(({ text, imagePrompt }) => ({ text, imagePrompt })),
      };

      if (!savedIdeas.some(idea => idea.title === leanResult.title)) {
        const newIdeas = [leanResult, ...savedIdeas];
        updateSavedIdeas(newIdeas);
      }
    }
  };
  
  const handleDeleteIdea = (index: number) => {
    const newIdeas = savedIdeas.filter((_, i) => i !== index);
    updateSavedIdeas(newIdeas);
  };

  const handleClearAllIdeas = () => {
    if (window.confirm('Are you sure you want to delete all saved ideas? This cannot be undone.')) {
      updateSavedIdeas([]);
    }
  };

  const handleShareIdea = async (idea: CraftIdea) => {
    const title = idea.title;
    let text = `Check out this craft idea: ${idea.title}\n\n`;
    text += "Materials Needed:\n" + idea.materials.map(m => `- ${m}`).join('\n') + '\n\n';
    text += "Instructions:\n" + idea.steps.map((s, i) => `${i + 1}. ${s.text}`).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Junk Art Genius: ${title}`,
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Craft idea copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy. Please try again.');
      }
    }
  };

  const handleDismissTutorial = () => setShowTutorial(false);
  const handleShowSavedIdeas = () => setView('saved');

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header 
        onShowSaved={handleShowSavedIdeas} 
        savedCount={savedIdeas.length}
      />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        {view === 'creator' ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">Junk Art Genius</h1>
              <p className="mt-3 text-lg text-slate-600">Turn your clutter into creative crafts for kids!</p>
            </div>
            
            {showTutorial && !imageUrl && <Tutorial onDismiss={handleDismissTutorial} />}

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <ImageUploader
                onImageChange={handleImageChange}
                imageUrl={imageUrl}
                onGenerate={handleGenerate}
                onReset={handleReset}
                isLoading={isLoading}
                hasResult={!!result}
                availableSupplies={AVAILABLE_SUPPLIES}
                selectedSupplies={selectedSupplies}
                onSupplyToggle={handleSupplyToggle}
                customIdea={customIdea}
                onCustomIdeaChange={handleCustomIdeaChange}
                generationConfig={generationConfig}
                onGenerationConfigChange={setGenerationConfig}
              />
              
              {isLoading && <LoadingSpinner message={loadingMessage} />}
              
              {error && (
                <div className="mt-6 p-4 bg-pink-100 border border-pink-400 text-pink-700 rounded-lg text-center" role="alert">
                  <p className="font-bold">Oh no!</p>
                  <p>{error}</p>
                </div>
              )}
              
              {result && (
                <ResultDisplay 
                  result={result}
                  onSave={handleSaveIdea}
                  onShare={() => handleShareIdea(result)}
                  isSaved={savedIdeas.some(idea => idea.title === result.title)}
                />
              )}
            </div>
          </>
        ) : (
          <SavedIdeasPage 
            ideas={savedIdeas}
            onDelete={handleDeleteIdea}
            onClearAll={handleClearAllIdeas}
            onBack={() => setView('creator')}
          />
        )}
      </main>
    </div>
  );
}

export default App;