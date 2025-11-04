export enum Major {
  AIDS = 'AI/DS',
  CSCYS = 'CS/CYS',
  CISBIT = 'CIS/BIT',
}

export interface Profile {
  name: string;
  skills: string;
  major: Major | '';
  selectedProjectTitle?: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
}