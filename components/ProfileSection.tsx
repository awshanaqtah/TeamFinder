import React from 'react';
import { Profile, Major } from '../types';

interface ProfileSectionProps {
  profile: Profile;
  onProfileChange: (field: keyof Profile, value: string) => void;
  onMajorChange: (major: Major | '') => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onProfileChange, onMajorChange }) => {
  return (
    <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up">
      <h2 className="text-2xl font-semibold text-white mb-6">Your Profile</h2>
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
          <textarea
            id="skills"
            rows={4}
            value={profile.skills}
            onChange={(e) => onProfileChange('skills', e.target.value)}
            placeholder="List your key skills, e.g., Python, SQL, Data Analysis"
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;