import { TeamRole, TeamMember, TeamComposition, RoleRequirement } from '../types';

export const TEAM_COMPOSITION_TEMPLATES: Record<string, RoleRequirement[]> = {
  'Machine Learning': [
    { role: 'ML', required: true, count: 2, suggestedSkills: ['Python', 'TensorFlow', 'PyTorch'], priority: 'High' },
    { role: 'Backend', required: true, count: 1, suggestedSkills: ['Python', 'FastAPI', 'Flask'], priority: 'High' },
    { role: 'Frontend', required: true, count: 1, suggestedSkills: ['React', 'JavaScript'], priority: 'Medium' },
    { role: 'DevOps', required: false, count: 1, suggestedSkills: ['Docker', 'Git'], priority: 'Low' }
  ],
  'Web Development': [
    { role: 'Frontend', required: true, count: 2, suggestedSkills: ['React', 'TypeScript', 'CSS'], priority: 'High' },
    { role: 'Backend', required: true, count: 2, suggestedSkills: ['Node.js', 'Express', 'SQL'], priority: 'High' },
    { role: 'UI/UX', required: false, count: 1, suggestedSkills: ['Figma', 'Design'], priority: 'Medium' },
    { role: 'DevOps', required: false, count: 1, suggestedSkills: ['Docker', 'CI/CD'], priority: 'Low' }
  ],
  'Security / Penetration Testing': [
    { role: 'Lead', required: true, count: 1, suggestedSkills: ['Penetration Testing', 'Reporting'], priority: 'High' },
    { role: 'Backend', required: true, count: 1, suggestedSkills: ['Python', 'Secure Coding'], priority: 'High' },
    { role: 'DevOps', required: true, count: 1, suggestedSkills: ['Linux', 'Security Tools'], priority: 'High' },
    { role: 'QA', required: false, count: 1, suggestedSkills: ['Testing', 'OWASP'], priority: 'Medium' }
  ],
  'Business Intelligence': [
    { role: 'Backend', required: true, count: 1, suggestedSkills: ['SQL', 'Data Modeling'], priority: 'High' },
    { role: 'Lead', required: true, count: 1, suggestedSkills: ['BI Tools', 'Analytics'], priority: 'High' },
    { role: 'UI/UX', required: false, count: 1, suggestedSkills: ['Visualization', 'Dashboards'], priority: 'Medium' }
  ],
  'Data Engineering': [
    { role: 'Backend', required: true, count: 2, suggestedSkills: ['Python', 'SQL', 'ETL'], priority: 'High' },
    { role: 'DevOps', required: true, count: 1, suggestedSkills: ['Airflow', 'Kubernetes'], priority: 'High' },
    { role: 'ML', required: false, count: 1, suggestedSkills: ['Data Pipelines', 'Spark'], priority: 'Medium' }
  ],
  'General / Undefined': [
    { role: 'Lead', required: true, count: 1, suggestedSkills: ['Leadership', 'Communication'], priority: 'High' },
    { role: 'Frontend', required: true, count: 1, suggestedSkills: ['React', 'JavaScript'], priority: 'Medium' },
    { role: 'Backend', required: true, count: 1, suggestedSkills: ['Node.js', 'Python', 'SQL'], priority: 'Medium' }
  ]
};

export const getRecommendedComposition = (projectTitle: string): RoleRequirement[] => {
  const lowerTitle = projectTitle.toLowerCase();

  const keywordToTemplate: Record<string, string[]> = {
    'Machine Learning': ['ml', 'machine learning', 'model', 'prediction', 'neural', 'deep learning', 'ai'],
    'Web Development': ['web', 'app', 'website', 'frontend', 'backend', 'fullstack'],
    'Security / Penetration Testing': ['security', 'penetration', 'pentest', 'cyber', 'vulnerability', 'soc', 'forensic'],
    'Business Intelligence': ['bi', 'analytics', 'intelligence', 'dashboard', 'report', 'kpi'],
    'Data Engineering': ['data pipeline', 'etl', 'warehouse', 'data quality', 'data engineer'],
  };

  for (const [templateName, keywords] of Object.entries(keywordToTemplate)) {
    if (keywords.some(kw => lowerTitle.includes(kw))) {
      return TEAM_COMPOSITION_TEMPLATES[templateName];
    }
  }

  return TEAM_COMPOSITION_TEMPLATES['General / Undefined'];
};

export const analyzeTeamComposition = (
  team: TeamMember[],
  requirements: RoleRequirement[]
): TeamComposition => {
  // Count filled roles
  const filledRoles = new Map<TeamRole, number>();
  team.forEach(member => {
    const count = filledRoles.get(member.role) || 0;
    filledRoles.set(member.role, count + 1);
  });

  // Calculate completeness
  let requiredCount = 0;
  let filledCount = 0;
  const missingRoles: TeamRole[] = [];

  requirements.forEach(req => {
    requiredCount += req.count;
    const filled = filledRoles.get(req.role) || 0;
    filledCount += Math.min(filled, req.count);

    if (filled < req.count) {
      missingRoles.push(req.role);
    }
  });

  const completeness = requiredCount > 0
    ? Math.round((filledCount / requiredCount) * 100)
    : 0;

  return {
    projectId: 'current',
    recommendedRoles: requirements,
    currentTeam: team,
    completeness,
    missingRoles: [...new Set(missingRoles)] // Remove duplicates
  };
};

export const getMissingRoles = (
  team: TeamMember[],
  requirements: RoleRequirement[]
): TeamRole[] => {
  const composition = analyzeTeamComposition(team, requirements);
  return composition.missingRoles;
};

export const getRoleColor = (role: TeamRole): string => {
  const colors: Record<TeamRole, string> = {
    'Lead': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Frontend': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Backend': 'bg-green-500/20 text-green-400 border-green-500/30',
    'ML': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'DevOps': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'UI/UX': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'QA': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Other': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };
  return colors[role] || colors['Other'];
};

export const getRolePriorityColor = (priority: 'High' | 'Medium' | 'Low'): string => {
  switch (priority) {
    case 'High':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Low':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
};
