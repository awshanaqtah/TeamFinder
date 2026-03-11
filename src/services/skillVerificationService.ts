import { ConfidenceLevel, SkillVerification } from '../types';

const VERIFICATION_STORAGE_KEY = 'teamfinder-verification';
const ADVANCED_SKILLS = [
  // AI/Data Science Advanced
  'TensorFlow', 'PyTorch', 'Keras', 'Deep Learning', 'Neural Networks',
  'Computer Vision', 'NLP', 'Transformers', 'BERT', 'MLOps',
  'MLflow', 'Kubeflow', 'Apache Spark', 'Hadoop',

  // Security/Cybersecurity Advanced
  'Penetration Testing', 'Cryptography', 'Digital Forensics',
  'Malware Analysis', 'Reverse Engineering', 'SOC Operations',
  'Threat Hunting', 'Incident Response', 'Burp Suite', 'Metasploit',
  'Wireshark', 'Splunk', 'ELK Stack', 'Kubernetes Security',

  // Business IT Advanced
  'SAP', 'Salesforce', 'ServiceNow', 'Oracle E-Business Suite',
  'Data Warehouse', 'ETL', 'Data Mining', 'Advanced Analytics',
  'Machine Learning', 'Enterprise Architecture', 'Process Mining',
  'RPA', 'Cloud Migration', 'Digital Transformation'
];

export const getConfidenceLevels = (): ConfidenceLevel[] => [
  { level: 'Learning', weight: 0.3, color: 'gray-400', icon: '🌱' },
  { level: 'Can use with help', weight: 0.6, color: 'yellow-400', icon: '📖' },
  { level: 'Comfortable', weight: 1.0, color: 'blue-400', icon: '✓' },
  { level: 'Expert', weight: 1.5, color: 'green-400', icon: '⭐' }
];

export const isAdvancedSkill = (skill: string): boolean => {
  return ADVANCED_SKILLS.some(advancedSkill =>
    advancedSkill.toLowerCase() === skill.toLowerCase()
  );
};

export const verifySkillClaim = (
  skill: string,
  statedLevel: string,
  confidence: string
): boolean => {
  // Basic validation - user should have at least "Can use with help" confidence
  // for advanced skills
  if (isAdvancedSkill(skill)) {
    const confidenceWeight = getConfidenceWeight(confidence);
    return confidenceWeight >= 0.6; // At least "Can use with help"
  }

  return true;
};

export const getConfidenceWeight = (confidence: string): number => {
  const levels = getConfidenceLevels();
  const level = levels.find(l => l.level === confidence);
  return level?.weight ?? 1.0;
};

export const adjustScoreByConfidence = (
  baseScore: number,
  confidence: string
): number => {
  const weight = getConfidenceWeight(confidence);
  return baseScore * weight;
};

export const getConfidenceColor = (confidence: string): string => {
  const levels = getConfidenceLevels();
  const level = levels.find(l => l.level === confidence);
  return level?.color ?? 'gray-400';
};

export const getConfidenceIcon = (confidence: string): string => {
  const levels = getConfidenceLevels();
  const level = levels.find(l => l.level === confidence);
  return level?.icon ?? '❓';
};

// LocalStorage functions
export const saveSkillVerification = (verification: SkillVerification): void => {
  try {
    const existing = getSkillVerifications();
    const updated = existing.filter(v => v.skill !== verification.skill);
    updated.push(verification);
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving skill verification:', error);
  }
};

export const getSkillVerifications = (): SkillVerification[] => {
  try {
    const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading skill verifications:', error);
    return [];
  }
};

export const getSkillVerification = (skill: string): SkillVerification | undefined => {
  const verifications = getSkillVerifications();
  return verifications.find(v =>
    v.skill.toLowerCase() === skill.toLowerCase()
  );
};

export const clearSkillVerifications = (): void => {
  localStorage.removeItem(VERIFICATION_STORAGE_KEY);
};
