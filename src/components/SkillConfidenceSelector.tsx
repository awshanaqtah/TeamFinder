import React, { useState } from 'react';
import { ConfidenceLevel } from '../types';

interface SkillConfidenceSelectorProps {
  skill: string;
  onSelect: (level: ConfidenceLevel) => void;
  onClose: () => void;
}

const confidenceLevels: ConfidenceLevel[] = [
  { level: 'Learning', weight: 0.3, color: 'gray-400', icon: '🌱' },
  { level: 'Can use with help', weight: 0.6, color: 'yellow-400', icon: '📖' },
  { level: 'Comfortable', weight: 1.0, color: 'blue-400', icon: '✓' },
  { level: 'Expert', weight: 1.5, color: 'green-400', icon: '⭐' }
];

const SkillConfidenceSelector: React.FC<SkillConfidenceSelectorProps> = ({
  skill,
  onSelect,
  onClose
}) => {
  const [selectedLevel, setSelectedLevel] = useState<ConfidenceLevel | null>(null);

  const handleSelect = (level: ConfidenceLevel) => {
    setSelectedLevel(level);
    // Small delay before closing to show selection
    setTimeout(() => onSelect(level), 150);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">How confident are you?</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-4 bg-sky-900/30 rounded-lg border border-sky-700/30">
          <p className="text-sky-400 text-sm">
            <span className="font-semibold text-white">"{skill}"</span> is considered an advanced skill.
            Please select your confidence level for accurate teammate matching.
          </p>
        </div>

        <div className="space-y-2">
          {confidenceLevels.map((level) => {
            const isSelected = selectedLevel?.level === level.level;
            return (
              <button
                key={level.level}
                onClick={() => handleSelect(level)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-900/20 shadow-lg shadow-sky-500/20'
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-2xl">{level.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{level.level}</div>
                  <div className="text-sm text-slate-400">
                    {getLevelDescription(level.level)}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full bg-${level.color} ${
                  isSelected ? 'animate-glow' : ''
                }`} />
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const getLevelDescription = (level: string): string => {
  switch (level) {
    case 'Learning':
      return 'Just started learning, need help';
    case 'Can use with help':
      return 'Basic usage, need assistance sometimes';
    case 'Comfortable':
      return 'Can work independently';
    case 'Expert':
      return 'Highly experienced, used in multiple projects';
    default:
      return '';
  }
};

export default SkillConfidenceSelector;
