import { MOCK_PROFILES } from '../data/mockProfiles';
import { Profile } from '../types';

// Helper to parse skills string into a clean array
const parseSkills = (skills: string): string[] => {
  return skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
};

/**
 * A weighted scoring algorithm to find the most compatible teammates.
 * Score is based on major alignment and shared skills.
 */
export const findTeammates = (currentUser: Profile): Profile[] => {
  const currentUserSkills = new Set(parseSkills(currentUser.skills));

  const scoredProfiles = MOCK_PROFILES
    .filter(p => p.name !== currentUser.name) // Exclude current user
    .map(profile => {
      let score = 0;

      // 1. Major Alignment Score (high weight)
      if (profile.major === currentUser.major) {
        score += 50;
      }

      // 2. Skill Relevance Score (lower weight per skill)
      const profileSkills = parseSkills(profile.skills);
      let commonSkills = 0;
      profileSkills.forEach(skill => {
        if (currentUserSkills.has(skill)) {
          commonSkills++;
        }
      });
      score += commonSkills * 10; // 10 points for each common skill

      return { ...profile, score };
    })
    .filter(p => p.score > 0); // Only show profiles with some compatibility

  // Sort by score in descending order and take the top 5
  return scoredProfiles.sort((a, b) => b.score - a.score).slice(0, 5);
};

/**
 * Searches for teammates by name.
 */
export const searchTeammatesByName = (query: string, currentUser: Profile): Profile[] => {
  if (!query.trim()) {
    return [];
  }
  const lowercasedQuery = query.toLowerCase();
  return MOCK_PROFILES.filter(
    p => p.name !== currentUser.name && p.name.toLowerCase().includes(lowercasedQuery)
  );
};