import React, { useState } from 'react';
import { SkillVerification, ConfidenceLevel } from '../types';
import SkillConfidenceSelector from './SkillConfidenceSelector';

interface VerificationPromptProps {
  skill: string;
  onSave: (verification: SkillVerification) => void;
  onClose: () => void;
}

const VerificationPrompt: React.FC<VerificationPromptProps> = ({
  skill,
  onSave,
  onClose
}) => {
  const [showConfidenceSelector, setShowConfidenceSelector] = useState(false);

  const handleConfidenceSelect = (level: ConfidenceLevel) => {
    const verification: SkillVerification = {
      skill,
      confidenceLevel: level.level,
      verified: false,
      source: 'self-reported'
    };
    onSave(verification);
  };

  if (showConfidenceSelector) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <SkillConfidenceSelector
          skill={skill}
          onSelect={handleConfidenceSelect}
          onClose={() => setShowConfidenceSelector(false)}
        />
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right fixed top-4 right-4 max-w-sm z-50">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-amber-500/50 shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.932 3H20c1.54 0 2.502-1.667 1.932-3l-1.712-6c-.77-1.333-2.694-1.333-3.464 0l-1.712 6z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm mb-2">
              <span className="font-semibold text-amber-400">"{skill}"</span> is an advanced skill.
            </p>
            <button
              onClick={() => setShowConfidenceSelector(true)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Verify Your Skill Level
            </button>
            <button
              onClick={onClose}
              className="w-full text-slate-400 hover:text-slate-200 text-sm mt-2 transition-colors"
            >
              Skip for now
            </button>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPrompt;
