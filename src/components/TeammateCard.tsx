import React from 'react';
import { Profile, ScoredProfile, TeamMember } from '../types';
import CompatibilityBadge from './CompatibilityBadge';
import RoleTag from './RoleTag';

interface TeammateCardProps {
  teammate: Profile | ScoredProfile | TeamMember;
  index: number;
  action: 'add' | 'remove';
  onAction: (profileOrName: Profile | string) => void;
  disabled?: boolean;
  showCompatibility?: boolean;
  onRoleChange?: (memberName: string, role: string, customRole?: string) => void;
}

const TeammateCard: React.FC<TeammateCardProps> = ({
  teammate,
  index,
  action,
  onAction,
  disabled = false,
  showCompatibility = false,
  onRoleChange
}) => {
  const handleAction = () => {
    if (action === 'add') {
      onAction(teammate);
    } else {
      onAction(teammate.name);
    }
  };

  const buttonText = action === 'add' ? 'Add to Team' : 'Remove';
  const buttonColor = action === 'add'
    ? "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:text-slate-400"
    : "bg-red-600 hover:bg-red-500 focus:ring-red-500";

  const isScored = 'score' in teammate;
  const hasRole = 'role' in teammate;
  const isUnavailable = 'isAvailable' in teammate && teammate.isAvailable === false;

  const formatSkills = (skills: string | string[]): string => {
    if (Array.isArray(skills)) {
      return skills.join(', ');
    }
    return skills;
  };

  return (
    <div
      className={`flex items-center justify-between bg-slate-700/50 p-4 rounded-lg border border-slate-600 animate-slide-in-up ${isUnavailable ? 'opacity-70' : ''}`}
      style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex-grow">
        {hasRole && onRoleChange && (
          <div className="mb-2">
            <RoleTag
              role={(teammate as TeamMember).role}
              customRole={(teammate as TeamMember).customRole}
              onRoleChange={(role, customRole) => onRoleChange(teammate.name, role, customRole)}
              readonly={isUnavailable}
            />
          </div>
        )}
        {!hasRole && isUnavailable && (
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-500 text-slate-300 text-xs px-2 py-1 rounded-full border border-slate-400/30">
              Already on a team
            </span>
          </div>
        )}
        <h4 className="font-bold text-white">{teammate.name}</h4>
        <p className="text-sm text-slate-400">{teammate.major}</p>
        <p className="text-slate-300 mt-2 text-sm">
          <span className="font-semibold">Skills:</span> {formatSkills(teammate.skills)}
        </p>
        {isUnavailable && teammate.teamProjectTitle && (
          <p className="text-xs text-slate-500 mt-1">
            Working on: {teammate.teamProjectTitle}
          </p>
        )}
        {showCompatibility && isScored && (
          <CompatibilityBadge
            score={teammate.score}
            matchDetails={teammate.matchDetails}
          />
        )}
      </div>
      <button
        onClick={handleAction}
        disabled={disabled || isUnavailable}
        className={`text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition duration-300 ${buttonColor}`}
      >
        {isUnavailable ? 'Unavailable' : disabled ? 'On Team' : buttonText}
      </button>
    </div>
  );
};

export default TeammateCard;