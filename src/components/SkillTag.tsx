import React from 'react';
import { SkillProficiency } from '../types';
import { getProficiencyColor, getProficiencyIcon } from '../services/proficiencyService';

interface SkillTagProps {
  skill: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced';
  confidenceLevel?: 'Learning' | 'Can use with help' | 'Comfortable' | 'Expert';
  onRemove?: () => void;
  showLevel?: boolean;
}

const SkillTag: React.FC<SkillTagProps> = ({
  skill,
  proficiency,
  confidenceLevel,
  onRemove,
  showLevel = true
}) => {
  const getConfidenceInfo = () => {
    switch (confidenceLevel) {
      case 'Learning':
        return { icon: '🌱', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
      case 'Can use with help':
        return { icon: '📖', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'Comfortable':
        return { icon: '✓', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'Expert':
        return { icon: '⭐', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      default:
        return { icon: '', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    }
  };

  let levelDisplay: React.ReactNode = null;

  if (proficiency && showLevel) {
    const icon = getProficiencyIcon(proficiency);
    levelDisplay = <span className="ml-2">{icon}</span>;
  } else if (confidenceLevel && showLevel) {
    const { icon } = getConfidenceInfo();
    levelDisplay = <span className="ml-2">{icon}</span>;
  }

  const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all hover-scale-up skill-tag-glow';

  let colorClasses = 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  if (proficiency) {
    colorClasses = getProficiencyColor(proficiency);
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      <span>{skill}</span>
      {levelDisplay}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:text-red-400 transition-colors"
          aria-label={`Remove ${skill}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default SkillTag;
