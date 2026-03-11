import { MOCK_PROFILES } from '../data/mockProfiles';
import { Profile, ScoredProfile, FilterOptions } from '../types';

// Helper to parse skills (supports both string and string[] for backward compatibility)
const parseSkills = (skills: string | string[]): string[] => {
  if (Array.isArray(skills)) {
    return skills.map(s => s.trim().toLowerCase()).filter(Boolean);
  }
  return skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
};

const normalizeText = (value?: string): string => (value || '').trim().toLowerCase();

/**
 * A weighted scoring algorithm to find the most compatible teammates.
 * Score is based on major alignment, specialization alignment, and shared skills.
 */
export const findTeammates = (
  currentUser: Profile,
  currentUserSpecialization?: string
): ScoredProfile[] => {
  const currentUserSkills = new Set(parseSkills(currentUser.skills));
  const normalizedCurrentSpecialization = normalizeText(
    currentUserSpecialization || currentUser.specialization
  );

  const scoredProfiles = MOCK_PROFILES
    .filter(p => p.name !== currentUser.name) // Exclude current user
    .filter(p => p.isAvailable !== false) // Filter out unavailable profiles
    .map(profile => {
      let score = 0;

      // 1. Major Alignment Score (high weight)
      const majorMatch = profile.major === currentUser.major;
      if (majorMatch) {
        score += 40;
      }

      // 2. Specialization Alignment Score (medium-high weight)
      const specializationMatch =
        normalizedCurrentSpecialization.length > 0 &&
        normalizedCurrentSpecialization === normalizeText(profile.specialization);
      if (specializationMatch) {
        score += 25;
      }

      // 3. Skill Relevance Score
      const profileSkills = parseSkills(profile.skills);
      const sharedSkills: string[] = [];
      profileSkills.forEach(skill => {
        if (currentUserSkills.has(skill)) {
          sharedSkills.push(skill);
        }
      });
      score += sharedSkills.length * 10; // 10 points for each common skill

      return {
        ...profile,
        score,
        matchDetails: {
          majorMatch,
          specializationMatch,
          sharedSkills
        }
      };
    })
    .filter(p => p.score > 0); // Only show profiles with some compatibility

  // Sort by score in descending order and take the top 5
  return scoredProfiles.sort((a, b) => b.score - a.score).slice(0, 5);
};

/**
 * Filters teammates based on filter options.
 */
export const filterTeammates = (
  profiles: Profile[],
  filters: FilterOptions
): Profile[] => {
  return profiles.filter(profile => {
    if (filters.major && profile.major !== filters.major) {
      return false;
    }
    if (filters.minSkillMatch !== undefined) {
      // This would need skill count calculation in the future
      // For now, we'll return true
    }
    return true;
  });
};

/**
 * Searches for teammates by name with optional filters.
 */
export const searchTeammatesByName = (
  query: string,
  currentUser: Profile,
  filters?: FilterOptions
): Profile[] => {
  if (!query.trim()) {
    return [];
  }
  const lowercasedQuery = query.toLowerCase();
  let results = MOCK_PROFILES.filter(
    p => p.name !== currentUser.name && p.name.toLowerCase().includes(lowercasedQuery)
  );

  if (filters) {
    results = filterTeammates(results, filters);
  }

  return results;
};
