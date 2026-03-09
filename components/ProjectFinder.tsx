import React from 'react';
import { ProjectIdea, Major, Profile } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectFinderProps {
  profile: Profile;
  major: Major | '';
  specializations: string[];
  selectedSpecialization: string;
  onSpecializationChange: (value: string) => void;
  projectIdeas: ProjectIdea[];
  onSelectProject: (project: ProjectIdea) => void;
}

const ProjectFinder: React.FC<ProjectFinderProps> = ({
  profile,
  major,
  specializations,
  selectedSpecialization,
  onSpecializationChange,
  projectIdeas,
  onSelectProject,
}) => {
  const isReady = major && specializations.length > 0;
  const hasSkills = Array.isArray(profile.skills)
    ? profile.skills.length > 0
    : profile.skills.trim().length > 0;
  const canShowProjects = Boolean(selectedSpecialization && hasSkills);

  return (
    <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
      <h2 className="text-2xl font-semibold text-white mb-6">Find a Project</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-slate-300 mb-2">
            Select Specialization
          </label>
          <select
            id="specialization"
            value={selectedSpecialization}
            onChange={(e) => onSpecializationChange(e.target.value)}
            disabled={!isReady}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="">{isReady ? 'Choose a specialization' : 'Select a major first'}</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        {!selectedSpecialization && (
          <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-lg border border-slate-700">
            <p>Pick a specialization to see matching project ideas.</p>
          </div>
        )}
        {selectedSpecialization && !hasSkills && (
          <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-lg border border-slate-700">
            <p>Add your skills in the profile section to unlock preset projects.</p>
          </div>
        )}
        {canShowProjects && projectIdeas.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-lg border border-slate-700">
            <p>No preset projects are configured for this specialization yet.</p>
          </div>
        )}
        {canShowProjects && projectIdeas.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Preset Projects for {selectedSpecialization}</h3>
            {projectIdeas.map((idea, index) => (
              <ProjectCard key={index} idea={idea} index={index} onSelect={onSelectProject} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFinder;
