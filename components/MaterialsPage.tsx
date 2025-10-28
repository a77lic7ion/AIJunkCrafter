import React from 'react';
import { commonMaterials, MaterialCategory } from '../data/commonMaterials';
import { ClipboardDocumentListIcon } from './icons';

const MaterialCard: React.FC<{ category: MaterialCategory }> = ({ category }) => (
  <div className="bg-white p-6 rounded-lg border border-stone-200">
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-shrink-0 bg-slate-100 p-2 rounded-full">
        <ClipboardDocumentListIcon className="w-6 h-6 text-slate-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{category.category}</h2>
    </div>
    <ul className="space-y-3">
      {category.items.map((item, index) => (
        <li key={index}>
          <p className="font-semibold text-slate-700">{item.name}</p>
          <p className="text-slate-500 text-sm">{item.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

export const MaterialsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">The Ultimate Craft Stash</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500">
          Stock up on these essentials to be ready for any creative project. You don't need everything, but having a few items from each category will unlock endless possibilities!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {commonMaterials.map((category, index) => (
          <MaterialCard key={index} category={category} />
        ))}
      </div>
    </div>
  );
};
