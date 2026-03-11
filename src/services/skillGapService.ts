import { ProjectIdea, SkillGapResult } from '../types';

export const parseProjectSkills = (project: ProjectIdea): string[] => {
  if (!project.suggestedStack) return [];

  return project.suggestedStack
    .split(/[,&|+\/]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

export const analyzeSkillGap = (
  userSkills: string | string[],
  projectRequiredSkills: string[]
): SkillGapResult => {
  // Normalize user skills to array
  const normalizedUserSkills = Array.isArray(userSkills)
    ? userSkills.map(s => s.trim().toLowerCase())
    : userSkills.toString().split(',').map(s => s.trim().toLowerCase());

  // Normalize project skills
  const normalizedProjectSkills = projectRequiredSkills.map(s => s.toLowerCase());

  // Find matching and missing skills
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  normalizedProjectSkills.forEach(skill => {
    const isMatched = normalizedUserSkills.some(userSkill =>
      userSkill === skill ||
      userSkill.includes(skill) ||
      skill.includes(userSkill)
    );

    if (isMatched) {
      // Get the original case from project skills
      const originalSkill = projectRequiredSkills.find(s => s.toLowerCase() === skill);
      if (originalSkill && !matchingSkills.includes(originalSkill)) {
        matchingSkills.push(originalSkill);
      }
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate gap percentage
  const gapPercentage = normalizedProjectSkills.length > 0
    ? Math.round((1 - (matchingSkills.length / normalizedProjectSkills.length)) * 100)
    : 0;

  // Determine recommended teammates based on missing skills
  const recommendedTeammates = getRecommendedRolesForSkills(missingSkills);

  return {
    projectSkills: normalizedProjectSkills,
    userSkills: normalizedUserSkills,
    matchingSkills,
    missingSkills,
    gapPercentage,
    recommendedTeammates
  };
};

const getRecommendedRolesForSkills = (missingSkills: string[]): string[] => {
  const roles: string[] = [];

  // Map skills to roles
  const skillToRole: Record<string, string> = {
    'python': 'Backend / ML',
    'javascript': 'Frontend',
    'react': 'Frontend',
    'typescript': 'Frontend',
    'node.js': 'Backend',
    'sql': 'Backend / Database',
    'postgresql': 'Backend / Database',
    'mongodb': 'Backend / Database',
    'docker': 'DevOps',
    'kubernetes': 'DevOps',
    'aws': 'DevOps',
    'azure': 'DevOps',
    'tensorflow': 'ML',
    'pytorch': 'ML',
    'keras': 'ML',
    'scikit-learn': 'ML',
    'pandas': 'Data Engineer',
    'numpy': 'Data Engineer',
    'ui': 'UI/UX',
    'ux': 'UI/UX',
    'figma': 'UI/UX',
    'testing': 'QA',
    'jest': 'QA',
    'cypress': 'QA'
  };

  // Find unique roles needed
  missingSkills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    for (const [key, role] of Object.entries(skillToRole)) {
      if (lowerSkill.includes(key) && !roles.includes(role)) {
        roles.push(role);
        break;
      }
    }
  });

  return roles;
};

export const getSkillGapColor = (percentage: number): string => {
  if (percentage === 0) return 'bg-green-500';
  if (percentage <= 25) return 'bg-green-500';
  if (percentage <= 50) return 'bg-yellow-500';
  if (percentage <= 75) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getSkillGapDescription = (percentage: number): string => {
  if (percentage === 0) return 'Perfect match! You have all required skills.';
  if (percentage <= 25) return 'Great match! You have most required skills.';
  if (percentage <= 50) return 'Good match. Some skills to learn or find teammates.';
  if (percentage <= 75) return 'Moderate gap. Consider teammates with missing skills.';
  return 'Significant gap. You may need teammates with most required skills.';
};
