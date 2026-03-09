import React from 'react';

interface CompatibilityBadgeProps {
  score: number;
  matchDetails: {
    majorMatch: boolean;
    sharedSkills: string[];
  };
}

const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({ score, matchDetails }) => {
  const getScoreColor = () => {
    if (score >= 70) return 'text-sky-400';
    if (score >= 40) return 'text-indigo-400';
    return 'text-slate-400';
  };

  const getCompatibilityLevel = () => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="flex items-center gap-2 mt-2 animate-slide-in-up" style={{ animationDelay: '150ms', opacity: 0, animationFillMode: 'forwards' }}>
      {matchDetails.majorMatch && (
        <span className="bg-sky-500/20 text-sky-400 text-xs px-2 py-1 rounded-full border border-sky-500/30">
          Same Major
        </span>
      )}
      <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-full border border-indigo-500/30">
        {matchDetails.sharedSkills.length} Shared Skill{matchDetails.sharedSkills.length !== 1 ? 's' : ''}
      </span>
      <span className={`text-xs font-semibold ${getScoreColor()}`}>
        {getCompatibilityLevel()} Compatibility ({score})
      </span>
    </div>
  );
};

export default CompatibilityBadge;