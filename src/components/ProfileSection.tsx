import React, { useState } from 'react';
import { Profile, Major } from '../types';
import SkillInput from './SkillInput';
import ProfilePreviewCard from './ProfilePreviewCard';

interface ProfileSectionProps {
  profile: Profile;
  onProfileChange: (field: keyof Profile, value: string) => void;
  onMajorChange: (major: Major | '') => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onProfileChange, onMajorChange }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleSkillsChange = (skills: string[]) => {
    onProfileChange('skills', skills.join(', '));
  };

  return (
    <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Your Profile</h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-sky-400 hover:text-sky-300 text-sm transition"
        >
          {showPreview ? 'Hide Preview' : 'Preview Profile'}
        </button>
      </div>

      {showPreview && (
        <div className="mb-6">
          <ProfilePreviewCard profile={profile} />
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => onProfileChange('name', e.target.value)}
            placeholder="e.g., Alex Doe"
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>
        <div>
          <label htmlFor="major" className="block text-sm font-medium text-slate-300 mb-2">
            Major <span className="text-red-500">*</span>
          </label>
          <select
            id="major"
            value={profile.major}
            onChange={(e) => onMajorChange(e.target.value as Major | '')}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="">Select your major</option>
            {Object.values(Major).map((major) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-2">
            Skills <span className="text-red-500">*</span>
          </label>
          <SkillInput
            skills={profile.skills}
            onChange={handleSkillsChange}
            major={profile.major}
            placeholder="Type to add skills..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;