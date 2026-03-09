export enum Major {
  AIDS = 'AI/DS',
  CSCYS = 'CS/CYS',
  CISBIT = 'CIS/BIT',
}

export interface Profile {
  name: string;
  skills: string | string[]; // Backward compatible
  major: Major | '';
  selectedProjectTitle?: string;
  isAvailable?: boolean;
  teamProjectTitle?: string;
}

export interface ScoredProfile extends Profile {
  score: number;
  matchDetails: {
    majorMatch: boolean;
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