import { ProjectIdea, TeamMember, ContactTemplate, ShareableLink } from '../types';

export const generateContactTemplate = (
  project: ProjectIdea,
  team: TeamMember[],
  style: 'formal' | 'casual' = 'formal'
): ContactTemplate => {
  const teamMemberList = team.map(member => {
    const roleInfo = member.customRole || member.role;
    return `- ${member.name} (${roleInfo})${member.major ? ` - ${member.major}` : ''}`;
  }).join('\n');

  let message: string;
  let subject: string;

  if (style === 'formal') {
    subject = `Team Formation: ${project.title}`;
    message = `Dear Team,

I hope this message finds you well.

I am writing to share details about our recently formed team for our graduation project.

Project: ${project.title}

Team Members (${team.length}):
${teamMemberList}

Next Steps:
1. Let's schedule our first team meeting to discuss project kickoff
2. We'll establish our project timeline and milestones
3. Each member should review the project scope before our meeting

Please reply with your availability for the upcoming week.

Best regards,
[Your Name]`;
  } else {
    // Casual style
    subject = `Let's build ${project.title}! 🚀`;
    message = `Hey team! 👋

Excited to announce our team for ${project.title}!

Our squad (${team.length} members):
${teamMemberList}

Let's get together soon to:
🎯 Discuss the project scope
📅 Set up our timeline
👥 Figure out roles and responsibilities

Hit me back with when you're free to meet!

Let's build something awesome! 💪`;
  }

  return {
    message,
    subject,
    projectTitle: project.title,
    teamMembers: team
  };
};

export const generateShareableLink = (
  project: ProjectIdea,
  team: TeamMember[]
): ShareableLink => {
  // Generate a simple hash-like ID
  const teamId = btoa(`${project.title}-${team.map(m => m.name).sort().join(',')}-${Date.now()}`).substring(0, 12);

  // Create URL with base64 encoded team data
  const teamData = {
    project: project.title,
    members: team.map(m => ({ name: m.name, role: m.role || 'Other' })),
    createdAt: new Date().toISOString()
  };

  const encoded = btoa(JSON.stringify(teamData));
  const url = `${window.location.origin}?team=${encoded}`;

  // Link expires in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return {
    url,
    teamId,
    expiresAt
  };
};

export const parseShareableLink = (urlParams: URLSearchParams | string): {
  project: string;
  members: Array<{ name: string; role: string }>;
  createdAt: string;
} | null => {
  let teamParam: string;

  if (urlParams instanceof URLSearchParams) {
    teamParam = urlParams.get('team') || '';
  } else {
    try {
      const url = new URL(window.location.href);
      teamParam = url.searchParams.get('team') || '';
    } catch {
      return null;
    }
  }

  if (!teamParam) return null;

  try {
    const decoded = atob(teamParam);
    const parsed = JSON.parse(decoded);

    if (typeof parsed !== 'object' || parsed === null) return null;
    if (typeof parsed.project !== 'string') return null;
    if (!Array.isArray(parsed.members)) return null;
    if (typeof parsed.createdAt !== 'string') return null;

    return {
      project: parsed.project,
      members: parsed.members.filter((m: unknown) =>
        typeof m === 'object' && m !== null &&
        typeof (m as Record<string, unknown>).name === 'string' &&
        typeof (m as Record<string, unknown>).role === 'string'
      ),
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
};

export const generateMeetingTemplate = (
  project: ProjectIdea,
  team: TeamMember[]
): string => {
  const skills = team.flatMap(m => {
    if (typeof m.skills === 'string') {
      return m.skills.split(',').map(s => s.trim());
    }
    return m.skills || [];
  }).filter(s => s.length > 0);

  const uniqueSkills = [...new Set(skills)];

  return `Meeting Agenda - ${project.title}

Date: [To be scheduled]
Time: [To be scheduled]
Location: [To be scheduled]

Attendees: ${team.map(m => m.name).join(', ')}

Agenda:
1. Project Kickoff (15 min)
   - Review project scope and objectives
   - Discuss timeline and milestones

2. Role Assignment (15 min)
   - Assign roles based on skills and preferences
   - Define responsibilities for each team member

3. Skill Inventory (10 min)
   - Team skills: ${uniqueSkills.join(', ')}
   - Identify skill gaps and how to address them

4. Communication Setup (10 min)
   - Set up communication channels (Slack, Discord, etc.)
   - Establish meeting schedule
   - Define code of conduct

5. Next Steps (10 min)
   - Action items for each member
   - Schedule next meeting
   - Set up project repository and tools`;
};

export const generateTeamSummaryForEmail = (
  project: ProjectIdea,
  team: TeamMember[]
): string => {
  const roleSummary = team.reduce((acc, member) => {
    const role = member.customRole || member.role || 'Other';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rolesText = Object.entries(roleSummary)
    .map(([role, count]) => `${role}: ${count}`)
    .join(' | ');

  return `
╔════════════════════════════════════════════════════╗
║              TEAMFINDER - TEAM SUMMARY                   ║
╠══════════════════════════════════════════════════╣

Project: ${project.title}
Team Size: ${team.length}
${project.difficulty ? `Difficulty: ${project.difficulty}` : ''}

════════════════════════════════════════════════════
TEAM COMPOSITION
${rolesText}

Team Members:
${team.map((m, i) => `${i + 1}. ${m.name} - ${m.customRole || m.role || 'Other'}`).join('\n')}

════════════════════════════════════════════════════
SKILLS OVERVIEW
${team.flatMap(m => {
  if (typeof m.skills === 'string') {
    return m.skills.split(',').map(s => s.trim());
  }
  return m.skills || [];
}).filter(s => s.length > 0).sort().join(', ')}

${project.suggestedStack ? `RECOMMENDED STACK:
${project.suggestedStack}` : ''}

${project.scope ? `PROJECT SCOPE:
${project.scope}` : ''}

════════════════════════════════════════════════════
Generated by TeamFinder
${new Date().toLocaleString()}
╚════════════════════════════════════════════════════╝`;
};

