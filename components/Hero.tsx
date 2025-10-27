import React from 'react';

interface HeroProps {
    onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
                    Turn Clutter into Creativity
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
                    Discover fun and engaging craft projects for kids using everyday household items. Inspire creativity and reduce waste with our easy-to-follow guides.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <a href="#creator" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                        Create a Project
                    </a>
                    <button onClick={onExplore} className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
                        Explore Projects
                    </button>
                </div>
            </div>
        </div>
    );
};