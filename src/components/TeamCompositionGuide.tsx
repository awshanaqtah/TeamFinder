import React from 'react';
import { TeamComposition, TeamRole } from '../types';
import { getRoleColor, getRolePriorityColor } from '../services/teamCompositionService';
import ProgressBar from './ProgressBar';

interface TeamCompositionGuideProps {
  composition: TeamComposition;
  onRoleFilter?: (role: TeamRole) => void;
  onClose: () => void;
}

const TeamCompositionGuide: React.FC<TeamCompositionGuideProps> = ({
  composition,
  onRoleFilter,
  onClose
}) => {
  const { recommendedRoles, completeness, missingRoles } = composition;

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857 1.857H4a1 1 0 01-1 1v3a1 1 0 001 1h1a1 1 0 001 1l8-8a1 1 0 011.414 0L17 19z" />
            </svg>
            Team Composition Guide
          </h3>
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

        {/* Completeness Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-slate-300">Team Completeness</span>
            <span className={`font-bold ${
              completeness >= 100 ? 'text-green-400' :
              completeness >= 75 ? 'text-blue-400' :
              completeness >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {completeness}%
            </span>
          </div>
          <ProgressBar value={completeness} />
        </div>

        {/* Role Grid */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-slate-400 mb-3">Recommended Roles</h4>
          {recommendedRoles.map((req) => {
            const isFilled = !missingRoles.includes(req.role);
            const isRequired = req.required;
            const roleColor = getRoleColor(req.role);
            const priorityColor = getRolePriorityColor(req.priority);

            return (
              <div
                key={req.role}
                className={`p-4 rounded-lg border-2 transition-all hover-scale-up ${
                  isFilled
                    ? roleColor
                    : 'bg-slate-700/30 border-slate-600 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-white font-semibold ${isRequired ? '' : 'line-through opacity-50'}`}>
                        {req.role}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityColor}`}>
                        {req.priority}
                      </span>
                      {isRequired && <span className="text-red-400 text-xs">Required</span>}
                    </div>
                    <p className="text-sm text-slate-400">
                      {req.count > 1 ? `${req.count} members needed` : '1 member needed'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Skills: {req.suggestedSkills.join(', ')}
                    </p>
                  </div>
                  {onRoleFilter && isFilled && (
                    <button
                      onClick={() => onRoleFilter(req.role)}
                      className="text-sky-400 hover:text-sky-300 text-sm transition-colors"
                    >
                      Find →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Missing Roles Summary */}
        {missingRoles.length > 0 && (
          <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-700/30 mb-6">
            <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.932 3H20c1.54 0 2.502-1.667 1.932-3l-1.712-6c-.77-1.333-2.694-1.333-3.464 0l-1.712 6z" />
              </svg>
              Still Need: {missingRoles.join(', ')}
            </h4>
            <p className="text-sm text-slate-400">
              Try searching for teammates with these roles to complete your team.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
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

export default TeamCompositionGuide;
