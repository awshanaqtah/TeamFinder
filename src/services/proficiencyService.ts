import { SkillProficiency } from '../types';

export const getProficiencyWeight = (level: 'Beginner' | 'Intermediate' | 'Advanced'): number => {
  switch (level) {
    case 'Beginner':
      return 0.5;
    case 'Intermediate':
      return 1.0;
    case 'Advanced':
      return 1.5;
    default:
      return 1.0;
  }
};

export const getProficiencyColor = (level: 'Beginner' | 'Intermediate' | 'Advanced'): string => {
  switch (level) {
    case 'Beginner':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'Intermediate':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Advanced':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export const getProficiencyIcon = (level: 'Beginner' | 'Intermediate' | 'Advanced'): string => {
  switch (level) {
    case 'Beginner':
      return '🌱';
    case 'Intermediate':
      return '📖';
    case 'Advanced':
      return '⭐';
    default:
      return '';
  }
};

export const calculateSkillCompatibility = (
  userProficiencies: SkillProficiency[],
  teammateSkills: string[],
  requiredSkills: string[]
): { matchScore: number; suggestions: string[] } => {
  let matchScore = 0;
  const suggestions: string[] = [];

  // Create a map for easy lookup
  const profMap = new Map<string, 'Beginner' | 'Intermediate' | 'Advanced'>();
  userProficiencies.forEach(p => {
    profMap.set(p.skill.toLowerCase(), p.level);
  });

  requiredSkills.forEach(requiredSkill => {
    const lowerRequired = requiredSkill.toLowerCase();

    // Check if teammate has this skill
    const hasSkill = teammateSkills.some(skill =>
      skill.toLowerCase() === lowerRequired ||
      skill.toLowerCase().includes(lowerRequired) ||
      lowerRequired.includes(skill.toLowerCase())
    );

    if (hasSkill) {
      // Check proficiency level
      const proficiency = profMap.get(lowerRequired) || 'Beginner';
      const weight = getProficiencyWeight(proficiency);
      matchScore += weight;

      if (proficiency === 'Beginner') {
        suggestions.push(`Consider learning more about ${requiredSkill}`);
      }
    } else {
      // Missing skill - teammate provides it
      matchScore += 1.0;
    }
  });

  // Normalize score to 0-100 range roughly
  const maxScore = requiredSkills.length * 1.5; // Maximum possible if all Advanced matches
  const normalizedScore = maxScore > 0
    ? Math.round((matchScore / maxScore) * 100)
    : 0;

  return {
    matchScore: normalizedScore,
    suggestions: [...new Set(suggestions)] // Remove duplicates
  };
};

export const getSkillGapWithProficiency = (
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  userLevel: 'Beginner' | 'Intermediate' | 'Advanced'
): number => {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const requiredIndex = levels.indexOf(requiredLevel);
  const userIndex = levels.indexOf(userLevel);

  // Calculate gap: positive means user is below required
  const gap = requiredIndex - userIndex;
  return gap;
};

export const suggestRoleBasedOnSkills = (
  skills: string[],
  proficiencies: SkillProficiency[]
): string[] => {
  const roleSuggestions: string[] = [];
  const profMap = new Map<string, 'Beginner' | 'Intermediate' | 'Advanced'>();
  proficiencies.forEach(p => {
    profMap.set(p.skill.toLowerCase(), p.level);
  });

  const skillToRole: Record<string, string> = {
    'python': 'Backend / ML',
    'javascript': 'Frontend',
    'react': 'Frontend',
    'typescript': 'Frontend',
    'node.js': 'Backend',
    'express': 'Backend',
    'django': 'Backend',
    'flask': 'Backend',
    'fastapi': 'Backend',
    'sql': 'Backend / Database',
    'postgresql': 'Backend / Database',
    'mongodb': 'Backend / Database',
    'redis': 'Backend / Database',
    'docker': 'DevOps',
    'kubernetes': 'DevOps',
    'aws': 'DevOps',
    'azure': 'DevOps',
    'gcp': 'DevOps',
    'tensorflow': 'ML',
    'pytorch': 'ML',
    'keras': 'ML',
    'scikit-learn': 'ML',
    'pandas': 'Data Engineer',
    'numpy': 'Data Engineer',
    'matplotlib': 'Data Visualization',
    'plotly': 'Data Visualization',
    'ui': 'UI/UX',
    'ux': 'UI/UX',
    'figma': 'UI/UX',
    'testing': 'QA',
    'jest': 'QA',
    'cypress': 'QA',
    'git': 'DevOps / Version Control',
    'github': 'DevOps / Version Control'
  };

  // Find roles based on advanced skills
  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    const proficiency = profMap.get(lowerSkill) || 'Beginner';

    // Only suggest role if user has Intermediate or Advanced
    if (proficiency === 'Intermediate' || proficiency === 'Advanced') {
      for (const [key, role] of Object.entries(skillToRole)) {
        if (lowerSkill.includes(key) && !roleSuggestions.includes(role)) {
          roleSuggestions.push(role);
          break;
        }
      }
    }
  });

  return roleSuggestions;
};
