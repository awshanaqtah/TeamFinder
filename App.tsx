import React, { useState, useEffect } from 'react';
import { Profile, Major, TeamMember, ScoredProfile, ProjectIdea } from './types';
import Header from './components/Header';
import ProfileSection from './components/ProfileSection';
import ProjectFinder from './components/ProjectFinder';
import TeammateResults from './components/TeammateResults';
import { getProjectIdeas } from './services/geminiService';
import { findTeammates, searchTeammatesByName } from './services/teammateService';
import { SPECIALIZATIONS } from './constants';
import OnboardingTooltip, { OnboardingStep } from './components/OnboardingTooltip';

const App: React.FC = () => {
  // Profile state
  const [profile, setProfile] = useState<Profile>({
    name: '',
    skills: '',
    major: '',
    selectedProjectTitle: ''
  });

  // Specialization state
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  // Project state
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  // Teammate state
  const [foundTeammates, setFoundTeammates] = useState<ScoredProfile[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Constants
  const ONBOARDING_STEPS: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Start with Your Profile',
      content: 'Enter your name, major, and skills. This information helps us find compatible teammates and suggest personalized project ideas. You can also preview your profile to see how it looks to others.'
    },
    {
      id: 'specialization',
      title: 'Choose Your Focus',
      content: 'Select your specialization to get more relevant project recommendations. This helps tailor project ideas to your specific interests and expertise within your major.'
    },
    {
      id: 'projects',
      title: 'Explore Project Ideas',
      content: 'Browse AI-generated project suggestions based on your profile. Each project includes detailed information like scope, suggested tech stack, and difficulty level. Click on projects to see full details.'
    },
    {
      id: 'teammates',
      title: 'Build Your Team',
      content: 'Review suggested teammates based on compatibility scores. You can filter by major, search for specific students, and assign roles like Lead, Frontend, or Backend. Use the export feature to save your team summary!'
    }
  ];

  // Load specializations when major changes
  useEffect(() => {
    if (profile.major) {
      const specs = SPECIALIZATIONS[profile.major as Major] || [];
      setSpecializations(specs);
    } else {
      setSpecializations([]);
      setSelectedSpecialization('');
    }
  }, [profile.major]);

  // Initialize onboarding on first visit
  useEffect(() => {
    const seen = localStorage.getItem('teamfinder-onboarding');
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleMajorChange = (major: Major | '') => {
    setProfile(prev => ({ ...prev, major }));
  };

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
  };

  const handleFindProjects = async () => {
    if (!profile.name || !profile.skills || !selectedSpecialization) {
      setProjectError('Please complete your profile first.');
      return;
    }

    setIsLoadingProjects(true);
    setProjectError(null);

    try {
      const ideas = await getProjectIdeas(profile.major, selectedSpecialization, profile.skills);
      setProjectIdeas(ideas);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectError('Failed to generate project ideas. Please try again.');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSelectProject = (project: ProjectIdea) => {
    setSelectedProject(project);
    // Find compatible teammates based on user profile
    const teammates = findTeammates(profile);
    setFoundTeammates(teammates);
  };

  const handleClearSelection = () => {
    setSelectedProject(null);
    setFoundTeammates([]);
  };

  const handleAddTeammate = (teammate: Profile | ScoredProfile) => {
    const newMember: TeamMember = {
      ...teammate,
      role: 'Other',
      customRole: ''
    };
    setTeam(prev => [...prev, newMember]);
  };

  const handleRemoveTeammate = (teammateName: string) => {
    setTeam(prev => prev.filter(m => m.name !== teammateName));
  };

  const handleRoleChange = (memberName: string, role: string, customRole?: string) => {
    setTeam(prev =>
      prev.map(m =>
        m.name === memberName
          ? { ...m, role: role as any, customRole }
          : m
      )
    );
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <OnboardingTooltip
          steps={ONBOARDING_STEPS}
          onComplete={handleOnboardingComplete}
        />
      )}

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Profile and Projects */}
          <div className="space-y-8">
            <ProfileSection
              profile={profile}
              onProfileChange={handleProfileChange}
              onMajorChange={handleMajorChange}
            />

            <ProjectFinder
              profile={profile}
              major={profile.major}
              specializations={specializations}
              selectedSpecialization={selectedSpecialization}
              onSpecializationChange={handleSpecializationChange}
              onFindProjects={handleFindProjects}
              projectIdeas={projectIdeas}
              isLoading={isLoadingProjects}
              error={projectError}
              selectedProject={selectedProject}
              foundTeammates={foundTeammates}
              onSelectProject={handleSelectProject}
              onClearSelection={handleClearSelection}
              team={team}
              onAddTeammate={handleAddTeammate}
              onRemoveTeammate={handleRemoveTeammate}
            />
          </div>

          {/* Right Column - Teammate Results */}
          <div>
            {selectedProject && (
              <TeammateResults
                project={selectedProject}
                suggestedTeammates={foundTeammates}
                onClear={handleClearSelection}
                currentUser={profile}
                team={team}
                onAddTeammate={handleAddTeammate}
                onRemoveTeammate={handleRemoveTeammate}
                onRoleChange={handleRoleChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;