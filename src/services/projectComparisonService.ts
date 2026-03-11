import { ProjectIdea, ProjectComparison, SkillGapResult } from '../types';

export const getDifficultyScore = (difficulty?: string): number => {
  switch (difficulty) {
    case 'Beginner':
      return 1;
    case 'Intermediate':
      return 2;
    case 'Advanced':
      return 3;
    default:
      return 0;
  }
};

export const getTechStackOverlap = (stack1: string, stack2: string): number => {
  if (!stack1 || !stack2) return 0;

  const skills1 = parseSkills(stack1);
  const skills2 = parseSkills(stack2);

  if (skills1.length === 0 || skills2.length === 0) return 0;

  const intersection = skills1.filter(skill =>
    skills2.some(s => s.toLowerCase() === skill.toLowerCase())
  );

  // Return percentage of overlap (0-1)
  const smallerSet = Math.min(skills1.length, skills2.length);
  return smallerSet > 0 ? intersection.length / smallerSet : 0;
};

const parseSkills = (stack: string): string[] => {
  return stack
    .split(/[,\s&|+]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

export const compareProjects = (
  projects: ProjectIdea[],
  userSkills: string[]
): ProjectComparison => {
  const skillGaps = new Map<string, SkillGapResult>();

  projects.forEach(project => {
    const projectSkills = parseProjectSkills(project);
    const userSkillsLower = userSkills.map(s => s.toLowerCase());

    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    projectSkills.forEach(skill => {
      const isMatched = userSkillsLower.some(us =>
        us === skill.toLowerCase() ||
        us.includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(us)
      );

      if (isMatched) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const gapPercentage = projectSkills.length > 0
      ? Math.round((1 - (matchingSkills.length / projectSkills.length)) * 100)
      : 0;

    skillGaps.set(project.title, {
      projectSkills,
      userSkills: userSkillsLower,
      matchingSkills,
      missingSkills,
      gapPercentage,
      recommendedTeammates: []
    });
  });

  // Calculate recommended difficulty based on user's skill match
  const totalDifficulty = projects.reduce((sum, p) =>
    sum + getDifficultyScore(p.difficulty), 0
  );

  const recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' =
    totalDifficulty === 0 ? 'Beginner' :
    totalDifficulty / projects.length < 1.5 ? 'Beginner' :
    totalDifficulty / projects.length < 2.3 ? 'Intermediate' : 'Advanced';

  return {
    projects,
    skillGaps,
    recommendedDifficulty
  };
};

const parseProjectSkills = (project: ProjectIdea): string[] => {
  if (!project.suggestedStack) return [];

  return parseSkills(project.suggestedStack);
};

export const getComparisonColor = (isBest: boolean, isWorst: boolean): string => {
  if (isBest) {
    return 'border-green-500 shadow-lg shadow-green-500/20';
  }
  if (isWorst) {
    return 'border-red-500 opacity-60';
  }
  return 'border-slate-600';
};

export const getMaxProjectsToCompare = (): number => {
  return 3;
};
