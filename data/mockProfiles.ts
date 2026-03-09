import { Major, Profile } from '../types';

export const MOCK_PROFILES: Profile[] = [
  {
    name: 'John Smith',
    skills: 'Python, TensorFlow, Keras',
    major: Major.AIDS,
    specialization: 'ML Engineer',
    selectedProjectTitle: '',
    isAvailable: true
  },
  {
    name: 'Emily White',
    skills: 'Java, Spring, SQL',
    major: Major.CSCYS,
    specialization: 'DevSecOps Engineer',
    selectedProjectTitle: 'E-Commerce Platform',
    isAvailable: false,
    teamProjectTitle: 'E-Commerce Platform'
  },
  {
    name: 'Michael Chen',
    skills: 'JavaScript, React, Figma',
    major: Major.CSCYS,
    specialization: 'SOC Analyst',
    selectedProjectTitle: '',
    isAvailable: true
  },
  {
    name: 'Sarah Brown',
    skills: 'Business Analysis, SAP, ERP',
    major: Major.CISBIT,
    specialization: 'Business Analyst',
    selectedProjectTitle: '',
    isAvailable: true
  },
  {
    name: 'David Lee',
    skills: 'C++, Unreal Engine, Blender',
    major: Major.CSCYS,
    specialization: 'Penetration Tester',
    selectedProjectTitle: '3D Game Engine',
    isAvailable: false,
    teamProjectTitle: '3D Game Engine'
  },
  {
    name: 'Jessica Rodriguez',
    skills: 'R, Tableau, PowerBI',
    major: Major.AIDS,
    specialization: 'BI Analyst',
    selectedProjectTitle: '',
    isAvailable: true
  },
  {
    name: 'Daniel Kim',
    skills: 'Penetration Testing, Metasploit',
    major: Major.CSCYS,
    specialization: 'Penetration Tester',
    selectedProjectTitle: '',
    isAvailable: true
  },
  {
    name: 'Laura Martinez',
    skills: 'Project Management, Agile, Scrum',
    major: Major.CISBIT,
    specialization: 'IT Project Manager',
    selectedProjectTitle: 'IT Project Dashboard',
    isAvailable: false,
    teamProjectTitle: 'IT Project Dashboard'
  },
  {
    name: 'Chris Green',
    skills: 'NLP, spaCy, NLTK',
    major: Major.AIDS,
    specialization: 'NLP Engineer',
    selectedProjectTitle: 'Sentiment Analysis API',
    isAvailable: false,
    teamProjectTitle: 'Sentiment Analysis API'
  },
  {
    name: 'Amanda Baker',
    skills: 'AWS, Docker, Kubernetes',
    major: Major.CSCYS,
    specialization: 'Cloud Security Engineer',
    selectedProjectTitle: '',
    isAvailable: true
  },
];
