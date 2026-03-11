import React, { useState, useEffect } from 'react';
import { Profile, Major, TeamMember, TeamRole, ScoredProfile, ProjectIdea, SkillVerification, SkillGapResult, SkillProficiency, AssessmentQuiz, TeamComposition, TimelineEstimate, AssessmentResult } from './types';
import Header from './components/Header';
import ProfileSection from './components/ProfileSection';
import ProjectFinder from './components/ProjectFinder';
import TeammateResults from './components/TeammateResults';
import BookmarksList from './components/BookmarksList';
import SignIn from './components/SignIn';
import { findTeammates } from './services/teammateService';
import { SPECIALIZATIONS, getPresetProjectsForSpecialization } from './constants';
import { getBookmarks, toggleBookmark, isBookmarked, removeBookmark } from './services/supabaseBookmarkService';
import OnboardingTooltip, { OnboardingStep } from './components/OnboardingTooltip';
import { analyzeSkillGap, parseProjectSkills } from './services/skillGapService';
import { generateAssessmentQuiz, calculateDifficultyAdjustment } from './services/difficultyAssessmentService';
import { getRecommendedComposition, analyzeTeamComposition } from './services/teamCompositionService';
import { compareProjects, getMaxProjectsToCompare } from './services/projectComparisonService';
import { estimateTimeline } from './services/timelineService';
import { generateContactTemplate, generateShareableLink } from './services/contactService';
import { hapticFeedback, storageGet, storageSet } from './lib/platform';
import { isAuthenticated, getCurrentUser, logoutUser, User, saveUserSettings, loadUserSettings } from './services/authService';

// New feature components
import SkillGapAnalysis from './components/SkillGapAnalysis';
import SkillProficiencyEditor from './components/SkillProficiencyEditor';
import DifficultyAssessment from './components/DifficultyAssessment';
import TeamCompositionGuide from './components/TeamCompositionGuide';
import ProjectComparisonModal from './components/ProjectComparisonModal';
import TimelineEstimator from './components/TimelineEstimator';
import TeamContactModal from './components/TeamContactModal';
import VerificationPrompt from './components/VerificationPrompt';

const App: React.FC = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

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

  // Teammate state
  const [foundTeammates, setFoundTeammates] = useState<ScoredProfile[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Bookmarks state
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkedProjects, setBookmarkedProjects] = useState<ProjectIdea[]>([]);

  // Skill verification state
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [verifyingSkill, setVerifyingSkill] = useState<string>('');
  const [skillVerifications, setSkillVerifications] = useState<SkillVerification[]>([]);

  // Skill Gap Analysis state
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapResult | null>(null);
  const [showSkillGapModal, setShowSkillGapModal] = useState(false);

  // Skill Proficiency state
  const [skillProficiencies, setSkillProficiencies] = useState<SkillProficiency[]>([]);
  const [showProficiencyEditor, setShowProficiencyEditor] = useState(false);

  // Difficulty Assessment state
  const [assessmentQuiz, setAssessmentQuiz] = useState<AssessmentQuiz | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  // Team Composition state
  const [teamComposition, setTeamComposition] = useState<TeamComposition | null>(null);
  const [showCompositionGuide, setShowCompositionGuide] = useState(false);

  // Project Comparison state
  const [projectsToCompare, setProjectsToCompare] = useState<ProjectIdea[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Timeline state
  const [timelineEstimate, setTimelineEstimate] = useState<TimelineEstimate | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  // Team Contact state
  const [showContactModal, setShowContactModal] = useState(false);

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
      content: 'Browse preset project pools based on your selected specialization and skills. Each project includes scope, suggested stack, and difficulty level. Click a project to continue to teammate matching.'
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
      setProjectIdeas([]);
      setSelectedProject(null);
      setFoundTeammates([]);
    }
  }, [profile.major]);

  // Load preset project pool once specialization is selected and skills are entered.
  useEffect(() => {
    const hasSkills = Array.isArray(profile.skills)
      ? profile.skills.length > 0
      : profile.skills.trim().length > 0;

    if (profile.major && selectedSpecialization && hasSkills) {
      const presets = getPresetProjectsForSpecialization(profile.major as Major, selectedSpecialization);
      setProjectIdeas(presets);
      return;
    }

    setProjectIdeas([]);
    setSelectedProject(null);
    setFoundTeammates([]);
  }, [profile.major, selectedSpecialization, profile.skills]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const user = await getCurrentUser();
        setCurrentUser(user);
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Initialize onboarding on first visit
  useEffect(() => {
    if (!authChecked || !currentUser) return;

    const seen = localStorage.getItem('teamfinder-onboarding');
    if (!seen) {
      setShowOnboarding(true);
    }
  }, [authChecked, currentUser]);

  // Load saved major and specialization on mount (from Supabase)
  useEffect(() => {
    if (!authChecked || !currentUser) return;

    const loadSavedSettings = async () => {
      try {
        const settings = await loadUserSettings();

        if (settings.lastMajor) {
          setProfile(prev => ({ ...prev, major: settings.lastMajor as string }));
        }
        if (settings.lastSpecialization) {
          setSelectedSpecialization(settings.lastSpecialization);
        }
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    };

    loadSavedSettings();
  }, [authChecked, currentUser]);

  // Load bookmarks on auth
  useEffect(() => {
    if (!authChecked || !currentUser) return;

    const loadBookmarks = async () => {
      const bookmarks = await getBookmarks();
      setBookmarkedProjects(bookmarks);
    };

    loadBookmarks();
  }, [authChecked, currentUser]);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleMajorChange = async (major: Major | '') => {
    setProfile(prev => ({ ...prev, major }));
    setSelectedSpecialization('');
    setSelectedProject(null);
    setFoundTeammates([]);
    setTeam([]);

    // Save major to Supabase
    try {
      if (major) {
        await saveUserSettings(major, selectedSpecialization);
      }
    } catch (error) {
      console.error('Failed to save major:', error);
    }
  };

  const handleSpecializationChange = async (value: string) => {
    setSelectedSpecialization(value);
    setSelectedProject(null);
    setFoundTeammates([]);

    // Save specialization to Supabase
    try {
      if (value) {
        await saveUserSettings(profile.major, value);
      }
    } catch (error) {
      console.error('Failed to save specialization:', error);
    }
  };

  const handleSelectProject = async (project: ProjectIdea) => {
    setSelectedProject(project);
    // Find compatible teammates based on major, specialization, and shared skills.
    const teammates = findTeammates(profile, selectedSpecialization);
    setFoundTeammates(teammates);

    // Trigger haptic feedback on mobile
    try {
      await hapticFeedback('medium');
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
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
          ? { ...m, role: role as TeamRole, customRole }
          : m
      )
    );
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Bookmark handlers
  const handleBookmarkClick = () => {
    setShowBookmarks(!showBookmarks);
  };

  const handleBookmarkToggle = async (project: ProjectIdea) => {
    const isBookmarkedAfterToggle = await toggleBookmark(project);
    const bookmarks = await getBookmarks();
    setBookmarkedProjects(bookmarks);
    return isBookmarkedAfterToggle;
  };

  const handleRemoveBookmark = async (projectTitle: string) => {
    await removeBookmark(projectTitle);
    const bookmarks = await getBookmarks();
    setBookmarkedProjects(bookmarks);
  };

  const handleSelectBookmark = (project: ProjectIdea) => {
    setShowBookmarks(false);
    handleSelectProject(project);
  };

  // Skill verification handlers
  const handleSkillVerificationSave = (verification: SkillVerification) => {
    setSkillVerifications(prev => [...prev, verification]);
    setShowVerificationPrompt(false);
    setVerifyingSkill('');
  };

  // Skill Gap Analysis handlers
  const handleAnalyzeGap = (project: ProjectIdea) => {
    const projectSkills = parseProjectSkills(project);
    const result = analyzeSkillGap(profile.skills, projectSkills);
    setSkillGapAnalysis(result);
    setShowSkillGapModal(true);
  };

  // Skill Proficiency handlers
  const handleOpenProficiencyEditor = () => {
    setShowProficiencyEditor(true);
  };

  const handleSaveProficiencies = (proficiencies: SkillProficiency[]) => {
    setSkillProficiencies(proficiencies);
    setShowProficiencyEditor(false);
  };

  // Difficulty Assessment handlers
  const handleStartAssessment = () => {
    if (!selectedProject) return;
    const techStack = parseProjectSkills(selectedProject);
    const quiz = generateAssessmentQuiz(selectedProject.title, techStack);
    setAssessmentQuiz(quiz);
    setShowAssessmentModal(true);
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setShowAssessmentModal(false);
  };

  // Team Composition handlers
  const handleShowCompositionGuide = () => {
    if (!selectedProject) return;
    const composition = getRecommendedComposition(selectedProject.title);
    const analyzed = analyzeTeamComposition(team, composition);
    setTeamComposition(analyzed);
    setShowCompositionGuide(true);
  };

  const handleToggleCompare = (project: ProjectIdea) => {
    if (projectsToCompare.some(p => p.title === project.title)) {
      setProjectsToCompare((prev: ProjectIdea[]) => prev.filter((p: ProjectIdea) => p.title !== project.title));
    } else if (projectsToCompare.length < getMaxProjectsToCompare()) {
      setProjectsToCompare((prev: ProjectIdea[]) => [...prev, project]);
    }
  };

  const handleShowComparisonModal = () => {
    if (projectsToCompare.length < 2) {
      return; // Need at least 2 projects
    }
    setShowComparisonModal(true);
  };

  const handleRemoveFromComparison = (projectTitle: string) => {
    setProjectsToCompare(projectsToCompare.filter(p => p.title !== projectTitle));
  };

  const handleSelectComparedProject = (project: ProjectIdea) => {
    setShowComparisonModal(false);
    handleSelectProject(project);
    setProjectsToCompare([]);
  };

  // Timeline handlers
  const handleEstimateTimeline = () => {
    if (!selectedProject) return;
    const estimate = estimateTimeline(selectedProject, team);
    setTimelineEstimate(estimate);
    setShowTimelineModal(true);
  };

  const handleShowTimelineModal = () => {
    setShowTimelineModal(true);
  };

  // Team Contact handlers
  const handleShowContactModal = () => {
    if (team.length < 2) {
      return; // Need at least 2 team members
    }
    setShowContactModal(true);
  };

  // Authentication handlers
  const handleSignInSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    // Reset app state
    setProfile({ name: '', skills: '', major: '', selectedProjectTitle: '' });
    setSelectedSpecialization('');
    setSelectedProject(null);
    setFoundTeammates([]);
    setTeam([]);
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-sky-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in if not authenticated
  if (!currentUser) {
    return <SignIn onSignInSuccess={handleSignInSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <OnboardingTooltip
          steps={ONBOARDING_STEPS}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <BookmarksList
            bookmarks={bookmarkedProjects}
            onClose={() => setShowBookmarks(false)}
            onSelectProject={handleSelectBookmark}
            onRemoveBookmark={handleRemoveBookmark}
          />
        </div>
      )}

      {/* Skill Verification Prompt */}
      {showVerificationPrompt && verifyingSkill && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <VerificationPrompt
              skill={verifyingSkill}
              onSave={handleSkillVerificationSave}
              onClose={() => {
                setShowVerificationPrompt(false);
                setVerifyingSkill('');
              }}
            />
          </div>
        </>
      )}

      {/* Skill Gap Analysis Modal */}
      {showSkillGapModal && skillGapAnalysis && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <SkillGapAnalysis
              result={skillGapAnalysis}
              onClose={() => setShowSkillGapModal(false)}
            />
          </div>
        </>
      )}

      {/* Skill Proficiency Editor Modal */}
      {showProficiencyEditor && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <SkillProficiencyEditor
              skills={Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',').map(s => s.trim()).filter(s => s)}
              proficiencies={skillProficiencies}
              onSave={handleSaveProficiencies}
              onClose={() => setShowProficiencyEditor(false)}
            />
          </div>
        </>
      )}

      {/* Difficulty Assessment Modal */}
      {showAssessmentModal && assessmentQuiz && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <DifficultyAssessment
              quiz={assessmentQuiz}
              onComplete={handleAssessmentComplete}
              onCancel={() => setShowAssessmentModal(false)}
            />
          </div>
        </>
      )}

      {/* Team Composition Guide Modal */}
      {showCompositionGuide && teamComposition && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <TeamCompositionGuide
              composition={teamComposition}
              onRoleFilter={() => {}}
              onClose={() => setShowCompositionGuide(false)}
            />
          </div>
        </>
      )}

      {/* Project Comparison Modal */}
      {showComparisonModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <ProjectComparisonModal
              projects={projectsToCompare}
              onClose={() => setShowComparisonModal(false)}
              onSelectProject={handleSelectComparedProject}
              onRemoveFromComparison={handleRemoveFromComparison}
            />
          </div>
        </>
      )}

      {/* Timeline Estimator Modal */}
      {showTimelineModal && timelineEstimate && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <TimelineEstimator
              estimate={timelineEstimate}
              onClose={() => setShowTimelineModal(false)}
            />
          </div>
        </>
      )}

      {/* Team Contact Modal */}
      {showContactModal && selectedProject && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <TeamContactModal
              project={selectedProject}
              team={team}
              onGenerateTemplate={() => {}}
              onCopyLink={() => {}}
              onClose={() => setShowContactModal(false)}
            />
          </div>
        </>
      )}

      <Header
        bookmarkCount={bookmarkedProjects.length}
        onBookmarkClick={handleBookmarkClick}
        username={currentUser?.username}
        onLogout={handleLogout}
      />

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
              projectIdeas={projectIdeas}
              onSelectProject={handleSelectProject}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              projectsToCompare={projectsToCompare}
              onToggleCompare={handleToggleCompare}
              onAnalyzeGap={handleAnalyzeGap}
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
