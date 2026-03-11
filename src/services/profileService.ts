import { Profile } from '../types';

export const calculateProfileCompleteness = (profile: Profile): number => {
  let score = 0;
  let total = 3;

  if (profile.name.trim()) score++;
  if (profile.major) score++;
  if (profile.skills) {
    // Check if skills are present (either string or array)
    const hasSkills = Array.isArray(profile.skills)
      ? profile.skills.length > 0
      : profile.skills.trim().length > 0;
    if (hasSkills) score++;
  }

  return Math.round((score / total) * 100);
};

export const validateProfile = (profile: Profile): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!profile.name.trim()) {
    errors.push('Name is required');
  }

  if (!profile.major) {
    errors.push('Major is required');
  }

  if (!profile.skills) {
    errors.push('Skills are required');
  } else {
    // Check if skills are empty
    const hasSkills = Array.isArray(profile.skills)
      ? profile.skills.length > 0
      : profile.skills.trim().length > 0;
    if (!hasSkills) {
      errors.push('Skills are required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getProfileSuggestions = (profile: Profile): string[] => {
  const suggestions: string[] = [];

  if (!profile.name.trim()) {
    suggestions.push('Add your name to personalize your experience');
  }

  if (!profile.major) {
    suggestions.push('Select your major to get better project recommendations');
  }

  if (!profile.skills) {
    suggestions.push('Add your skills to find compatible teammates');
  } else {
    const hasSkills = Array.isArray(profile.skills)
      ? profile.skills.length > 0
      : profile.skills.trim().length > 0;
    if (!hasSkills) {
      suggestions.push('Add your skills to find compatible teammates');
    }
  }

  return suggestions;
};