export enum Major {
  AIDS = 'AI / Data Science',
  CSCYS = 'CS / Cybersecurity',
  CISBIT = 'CIS / Business IT',
}

export interface Profile {
  name: string;
  skills: string | string[]; // Backward compatible
  major: Major | '';
  specialization?: string;
  selectedProjectTitle?: string;
  isAvailable?: boolean;
  teamProjectTitle?: string;
}

export interface ScoredProfile extends Profile {
  score: number;
  matchDetails: {
    majorMatch: boolean;
    specializationMatch?: boolean;
    sharedSkills: string[];
  };
}

export type TeamRole = 'Lead' | 'Frontend' | 'Backend' | 'ML' | 'DevOps' | 'UI/UX' | 'QA' | 'Other';

export interface TeamMember extends Profile {
  role: TeamRole;
  customRole?: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  scope?: string;
  suggestedStack?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface FilterOptions {
  major?: Major | '';
  minSkillMatch?: number;
  specialization?: string;
}

// ============ Bookmarks Feature ============
export interface BookmarkedProject extends ProjectIdea {
  bookmarkedAt: string;
}

// ============ Skill Verification Feature ============
export interface SkillVerification {
  skill: string;
  confidenceLevel: 'Learning' | 'Can use with help' | 'Comfortable' | 'Expert';
  verified: boolean;
  evidenceUrl?: string;
  source?: 'self-reported' | 'github' | 'portfolio' | 'course';
}

export interface ConfidenceLevel {
  level: 'Learning' | 'Can use with help' | 'Comfortable' | 'Expert';
  weight: number;
  color: string;
  icon: string;
}

export interface PeerReview {
  id: string;
  projectId: string;
  reviewerName: string;
  subjectName: string;
  skillAccuracyRating: number; // 1-5
  wouldWorkAgain: boolean;
  comment: string;
  timestamp: Date;
}

export interface UserReputation {
  userId: string;
  averageSkillAccuracy: number;
  totalReviews: number;
  reputationScore: number; // 0-100
}

// ============ Skill Gap Analysis Feature ============
export interface SkillGapResult {
  projectSkills: string[];
  userSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  gapPercentage: number;
  recommendedTeammates: string[]; // Roles needed
}

// ============ Skill Proficiency Feature ============
export interface SkillProficiency {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

// ============ Difficulty Assessment Feature ============
export interface AssessmentQuiz {
  projectId: string;
  techStack: string[];
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  question: string;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  text: string;
  score: number; // 0-10
}

export interface AssessmentResult {
  originalDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  adjustedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  confidenceScore: number; // 0-100
  skillScores: Map<string, number>;
  recommendations: string[];
}

// ============ Team Composition Feature ============
export interface TeamComposition {
  projectId: string;
  recommendedRoles: RoleRequirement[];
  currentTeam: TeamMember[];
  completeness: number;
  missingRoles: TeamRole[];
}

export interface RoleRequirement {
  role: TeamRole;
  required: boolean;
  count: number;
  suggestedSkills: string[];
  priority: 'High' | 'Medium' | 'Low';
}

// ============ Project Comparison Feature ============
export interface ProjectComparison {
  projects: ProjectIdea[];
  skillGaps: Map<string, SkillGapResult>; // projectId -> gap result
  recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// ============ Timeline Estimator Feature ============
export interface TimelineEstimate {
  project: ProjectIdea;
  teamSize: number;
  baseWeeks: number;
  adjustedWeeks: number;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  breakdown: TimelineMilestone[];
  factors: TimelineFactor[];
}

export interface TimelineMilestone {
  phase: string;
  weeks: number;
  description: string;
}

export interface TimelineFactor {
  factor: string;
  impact: number;
  reason: string;
}

// ============ Team Contact Feature ============
export interface ContactTemplate {
  message: string;
  subject: string;
  projectTitle: string;
  teamMembers: TeamMember[];
}

export interface ShareableLink {
  url: string;
  teamId: string;
  expiresAt: Date;
}
