import React from 'react';
import { ProjectIdea, Major, Profile } from '../types';
import ProjectCard from './ProjectCard';
import Spinner from './Spinner';
import TeammateResults from './TeammateResults';

interface ProjectFinderProps {
  profile: Profile;
  major: Major | '';
  specializations: string[];
  selectedSpecialization: string;
  onSpecializationChange: (value: string) => void;
  onFindProjects: () => void;
  projectIdeas: ProjectIdea[];
  isLoading: boolean;
  error: string | null;
  selectedProject: ProjectIdea | null;
  foundTeammates: Profile[];
  onSelectProject: (project: ProjectIdea) => void;
  onClearSelection: () => void;
  team: Profile[];
  onAddTeammate: (teammate: Profile) => void;
  onRemoveTeammate: (teammateName: string) => void;
}

const ProjectFinder: React.FC<ProjectFinderProps> = ({
  profile,
  major,
  specializations,
  selectedSpecialization,
  onSpecializationChange,
  onFindProjects,
  projectIdeas,
  isLoading,
  error,
  selectedProject,
  foundTeammates,
  onSelectProject,
  onClearSelection,
  team,
  onAddTeammate,
  onRemoveTeammate,
}) => {
  const isReady = major && specializations.length > 0;
  const isFindDisabled = !profile.name || !profile.skills || !selectedSpecialization || isLoading;

  if (selectedProject) {
    return (
      <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up">
        <TeammateResults
          project={selectedProject}
          suggestedTeammates={foundTeammates}
          onClear={onClearSelection}
          currentUser={profile}
          team={team}
          onAddTeammate={onAddTeammate}
          onRemoveTeammate={onRemoveTeammate}
        />
      </div>
    );
  }

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
        <button
          onClick={onFindProjects}
          disabled={isFindDisabled}
          className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-wait transition duration-300"
        >
          {isLoading ? 'Generating Ideas...' : 'Find Projects'}
        </button>
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        )}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md" role="alert">
            <p className="font-bold">Oops!</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && projectIdeas.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>Your project ideas will appear here.</p>
          </div>
        )}
        {projectIdeas.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Suggested Projects:</h3>
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