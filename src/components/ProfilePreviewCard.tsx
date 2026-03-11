import React from 'react';
import { Profile } from '../types';
import { calculateProfileCompleteness, validateProfile } from '../services/profileService';

interface ProfilePreviewCardProps {
  profile: Profile;
}

const ProfilePreviewCard: React.FC<ProfilePreviewCardProps> = ({ profile }) => {
  const completeness = calculateProfileCompleteness(profile);
  const { errors } = validateProfile(profile);

  const formatSkills = (skills: string | string[]): string => {
    if (Array.isArray(skills)) {
      return skills.join(', ');
    }
    return skills;
  };

  const getCompletenessColor = (): string => {
    if (completeness === 100) return 'text-green-400';
    if (completeness >= 66) return 'text-sky-400';
    if (completeness >= 33) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-sky-500 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-bold">YOU</span>
        <span className="text-xs text-slate-400">
          Profile {completeness}% Complete
        </span>
      </div>

      <h4 className="font-bold text-white">{profile.name || 'Your Name'}</h4>
      <p className="text-sm text-slate-400">{profile.major || 'Select a major'}</p>
      <p className="text-slate-300 mt-2 text-sm">
        <span className="font-semibold">Skills:</span> {formatSkills(profile.skills) || 'Add your skills'}
      </p>

      {completeness < 100 && (
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-grow h-2 bg-slate-600 rounded-full overflow-hidden">
              <div
                className={`h-full ${getCompletenessColor()} transition-all duration-500`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-semibold ${getCompletenessColor()}`}>
            {completeness}% Complete
          </span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Missing information:</p>
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-red-400">
              • {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePreviewCard;