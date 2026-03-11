import React from 'react';
import { SkillGapResult } from '../types';
import { getSkillGapColor, getSkillGapDescription } from '../services/skillGapService';

interface SkillGapAnalysisProps {
  result: SkillGapResult;
  onClose: () => void;
  onFindTeammates?: () => void;
}

const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  result,
  onClose,
  onFindTeammates
}) => {
  const { missingSkills, matchingSkills, gapPercentage } = result;

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Skill Gap Analysis</h3>
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

        {/* Overall Gap Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Skill Match</span>
            <span className="text-2xl font-bold text-white">
              {100 - gapPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full animate-fill ${getSkillGapColor(gapPercentage)}`}
              style={{ width: `${100 - gapPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {getSkillGapDescription(gapPercentage)}
          </p>
        </div>

        {/* Matching Skills */}
        {matchingSkills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Matching Skills ({matchingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, index) => (
                <span
                  key={skill}
                  className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm skill-tag-glow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.932 3H20c1.54 0 2.502-1.667 1.932-3l-1.712-6c-.77-1.333-2.694-1.333-3.464 0l-1.712 6z" />
              </svg>
              Missing Skills ({missingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <span
                  key={skill}
                  className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm animate-pulse-slow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>
            {result.recommendedTeammates.length > 0 && (
              <div className="mt-3 p-3 bg-sky-900/30 rounded-lg border border-sky-700/30">
                <p className="text-sm text-sky-400">
                  <span className="font-semibold">Recommended roles:</span> {result.recommendedTeammates.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          {onFindTeammates && missingSkills.length > 0 && (
            <button
              onClick={onFindTeammates}
              className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Find Teammates with Missing Skills
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
