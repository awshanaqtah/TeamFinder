import { ProjectIdea, TeamMember, TimelineEstimate, TimelineMilestone, TimelineFactor, SkillProficiency } from '../types';

export const TIMELINE_BASE_WEEKS: Record<string, { min: number; max: number }> = {
  'Beginner': { min: 4, max: 6 },
  'Intermediate': { min: 6, max: 10 },
  'Advanced': { min: 10, max: 16 }
};

export const TIMELINE_MILESTONES_TEMPLATE: Record<string, Partial<TimelineMilestone>[]> = {
  'Machine Learning': [
    { phase: 'Data Collection', weeks: 2, description: 'Gather and clean dataset' },
    { phase: 'Model Development', weeks: 4, description: 'Train and iterate models' },
    { phase: 'Integration', weeks: 2, description: 'Deploy model and build API' },
    { phase: 'Testing & Documentation', weeks: 1, description: 'Validate and document' }
  ],
  'Web Development': [
    { phase: 'Planning & Design', weeks: 2, description: 'Requirements and UI/UX design' },
    { phase: 'Frontend Development', weeks: 3, description: 'Build user interface' },
    { phase: 'Backend Development', weeks: 3, description: 'Implement API and database' },
    { phase: 'Integration & Testing', weeks: 2, description: 'Connect components and test' }
  ],
  'Security / Penetration Testing': [
    { phase: 'Reconnaissance', weeks: 1, description: 'Gather information about target' },
    { phase: 'Scanning & Analysis', weeks: 2, description: 'Perform security scans' },
    { phase: 'Exploitation', weeks: 2, description: 'Conduct penetration tests' },
    { phase: 'Reporting', weeks: 1, description: 'Document findings and recommendations' }
  ],
  'Business Intelligence': [
    { phase: 'Requirements Gathering', weeks: 2, description: 'Meet with stakeholders' },
    { phase: 'Data Modeling & ETL', weeks: 2, description: 'Design data pipeline' },
    { phase: 'Dashboard Development', weeks: 3, description: 'Build visualizations' },
    { phase: 'Testing & Deployment', weeks: 1, description: 'Validate and deploy to production' }
  ],
  'Data Engineering': [
    { phase: 'Infrastructure Setup', weeks: 1, description: 'Set up databases and pipelines' },
    { phase: 'ETL Development', weeks: 3, description: 'Build data extraction and transformation' },
    { phase: 'ML Pipeline Integration', weeks: 2, description: 'Integrate ML models into pipeline' },
    { phase: 'Monitoring & Maintenance', weeks: 2, description: 'Set up monitoring and maintenance' }
  ]
};

export const estimateTimeline = (
  project: ProjectIdea,
  team: TeamMember[],
  proficiencies?: SkillProficiency[]
): TimelineEstimate => {
  const teamSize = team.length;
  const difficulty = project.difficulty || 'Intermediate';

  // Get base weeks from difficulty
  const baseRange = TIMELINE_BASE_WEEKS[difficulty] || { min: 6, max: 10 };
  const baseWeeks = (baseRange.min + baseRange.max) / 2;

  // Adjust for team size (more people = faster, but with diminishing returns)
  const teamSizeMultiplier = getTeamSizeMultiplier(teamSize);
  const adjustedForTeam = Math.round(baseWeeks * teamSizeMultiplier);

  // Adjust for skill proficiency if available
  const proficiencyMultiplier = getProficiencyMultiplier(proficiencies);
  const adjustedWeeks = Math.max(2, Math.round(adjustedForTeam * proficiencyMultiplier));

  // Generate milestones based on project type
  const milestoneTemplate = getMilestoneTemplate(project);
  const breakdown: TimelineMilestone[] = milestoneTemplate.map(m => ({
    phase: m.phase,
    weeks: Math.round(m.weeks! * (adjustedWeeks / baseWeeks)),
    description: m.description || ''
  }));

  // Calculate confidence level
  const confidenceLevel = getConfidenceLevel(teamSize, proficiencies);

  // Generate factors
  const factors = generateTimelineFactors(baseWeeks, adjustedWeeks, teamSize, difficulty);

  return {
    project,
    teamSize,
    baseWeeks,
    adjustedWeeks,
    confidenceLevel,
    breakdown,
    factors
  };
};

const getTeamSizeMultiplier = (teamSize: number): number => {
  // Diminishing returns: more people helps but not linearly
  if (teamSize <= 0) return 1.2;
  if (teamSize === 1) return 1.0;
  if (teamSize === 2) return 0.8;
  if (teamSize === 3) return 0.7;
  if (teamSize === 4) return 0.65;
  return 0.55; // 5+ team members
};

const getProficiencyMultiplier = (proficiencies?: SkillProficiency[]): number => {
  if (!proficiencies || proficiencies.length === 0) return 1.0;

  // Calculate average proficiency level
  const levels = proficiencies.map(p => {
    switch (p.level) {
      case 'Beginner': return 1;
      case 'Intermediate': return 2;
      case 'Advanced': return 3;
      default: return 2;
    }
  });

  const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;

  // Return multiplier: higher proficiency = faster completion
  // 1.0 = baseline, <1.0 = faster, >1.0 = slower
  if (avgLevel >= 2.5) return 0.85; // Advanced average
  if (avgLevel >= 1.5) return 0.95; // Intermediate+
  if (avgLevel >= 1) return 1.0; // Intermediate baseline
  return 1.1; // Beginner team
};

const getMilestoneTemplate = (project: ProjectIdea): Partial<TimelineMilestone>[] => {
  const title = project.title.toLowerCase();

  if (title.includes('machine learning') || title.includes('ml') || title.includes('ai') ||
      title.includes('tensor') || title.includes('pytorch') || title.includes('keras')) {
    return TIMELINE_MILESTONES_TEMPLATE['Machine Learning'];
  }
  if (title.includes('web') || title.includes('app') || title.includes('website') ||
      title.includes('frontend') || title.includes('backend')) {
    return TIMELINE_MILESTONES_TEMPLATE['Web Development'];
  }
  if (title.includes('security') || title.includes('penetration') || title.includes('pentest') ||
      title.includes('cyber') || title.includes('vulnerability')) {
    return TIMELINE_MILESTONES_TEMPLATE['Security / Penetration Testing'];
  }
  if (title.includes('bi') || title.includes('analytics') || title.includes('intelligence') ||
      title.includes('dashboard') || title.includes('report')) {
    return TIMELINE_MILESTONES_TEMPLATE['Business Intelligence'];
  }
  if (title.includes('data') || title.includes('etl') || title.includes('pipeline') ||
      title.includes('warehouse')) {
    return TIMELINE_MILESTONES_TEMPLATE['Data Engineering'];
  }

  return TIMELINE_MILESTONES_TEMPLATE['Web Development']; // Default
};

const getConfidenceLevel = (teamSize: number, proficiencies?: SkillProficiency[]): 'Low' | 'Medium' | 'High' => {
  // Small team = lower confidence, larger team = higher confidence
  if (teamSize >= 4) return 'High';
  if (teamSize >= 2) return 'Medium';
  return 'Low';
};

const generateTimelineFactors = (
  baseWeeks: number,
  adjustedWeeks: number,
  teamSize: number,
  difficulty: string
): TimelineFactor[] => {
  const factors: TimelineFactor[] = [];

  // Team size factor
  const sizeDiff = adjustedWeeks - baseWeeks;
  if (sizeDiff !== 0) {
    factors.push({
      factor: 'Team Size',
      impact: sizeDiff,
      reason: teamSize > 1
        ? `${teamSize} team members reduces time by ${Math.abs(sizeDiff)} weeks`
        : 'Single team member increases time'
    });
  }

  // Difficulty factor
  if (difficulty === 'Advanced') {
    factors.push({
      factor: 'Project Complexity',
      impact: 0,
      reason: 'Advanced project requires careful planning'
    });
  }

  // Minimum duration factor
  if (adjustedWeeks < 4) {
    factors.push({
      factor: 'Minimum Duration',
      impact: 4 - adjustedWeeks,
      reason: 'Project duration set to minimum 4 weeks for completion'
    });
  }

  return factors;
};

export const getWeekRange = (timeline: TimelineEstimate): string => {
  const buffer = 1; // Add buffer for uncertainty
  return `${timeline.adjustedWeeks} - ${timeline.adjustedWeeks + buffer}`;
};
