import React from 'react';
import { GenerationConfig } from '../services/geminiService';

interface SettingsPopoverProps {
  config: GenerationConfig;
  onConfigChange: (newConfig: GenerationConfig) => void;
}

const Slider: React.FC<{
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, value, min, max, step, onChange }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">{value}</span>
            </div>
            <input
                id={id}
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
        </div>
    );
};


export const SettingsPopover: React.FC<SettingsPopoverProps> = ({ config, onConfigChange }) => {
  const handleConfigChange = (field: keyof GenerationConfig, value: number) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <div className="absolute bottom-full mb-2 w-72 bg-white p-4 rounded-lg shadow-xl border border-slate-200 z-20 right-0 transform translate-x-1/2 md:translate-x-0 md:right-auto md:left-1/2 md:-translate-x-1/2">
        <h4 className="text-md font-bold text-slate-800 text-center mb-3">Advanced Generation Settings</h4>
        <div className="space-y-4">
            <Slider
                id="temperature"
                label="Creativity (Temperature)"
                min={0}
                max={1}
                step={0.1}
                value={config.temperature}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
            />
            <Slider
                id="topK"
                label="Top-K"
                min={1}
                max={100}
                step={1}
                value={config.topK}
                onChange={(e) => handleConfigChange('topK', parseInt(e.target.value, 10))}
            />
            <Slider
                id="topP"
                label="Top-P"
                min={0}
                max={1}
                step={0.05}
                value={config.topP}
                onChange={(e) => handleConfigChange('topP', parseFloat(e.target.value))}
            />
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">Higher creativity may lead to more unexpected ideas.</p>
    </div>
  );
};