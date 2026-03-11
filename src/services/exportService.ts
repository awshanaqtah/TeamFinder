import { ProjectIdea, TeamMember } from '../types';

export const generateTeamSummary = (
  project: ProjectIdea,
  team: TeamMember[]
): string => {
  let summary = `Team Summary\n${'='.repeat(50)}\n\n`;
  summary += `Project: ${project.title}\n`;
  summary += `Description: ${project.description}\n`;
  if (project.scope) summary += `Scope: ${project.scope}\n`;
  if (project.suggestedStack) summary += `Suggested Stack: ${project.suggestedStack}\n`;
  if (project.difficulty) summary += `Difficulty: ${project.difficulty}\n`;
  summary += `\nTeam Members (${team.length}):\n`;
  summary += `${'-'.repeat(50)}\n`;

  team.forEach((member, index) => {
    summary += `\n${index + 1}. ${member.name}\n`;
    summary += `   Role: ${member.role}${member.customRole ? ` (${member.customRole})` : ''}\n`;
    summary += `   Major: ${member.major}\n`;

    const formatSkills = (skills: string | string[]): string => {
      if (Array.isArray(skills)) {
        return skills.join(', ');
      }
      return skills;
    };

    summary += `   Skills: ${formatSkills(member.skills)}\n`;
  });

  summary += `\n${'='.repeat(50)}`;
  return summary;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const downloadAsText = (text: string, filename: string) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateFilename = (projectTitle: string): string => {
  const sanitized = projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `team_${sanitized}_${date}.txt`;
};