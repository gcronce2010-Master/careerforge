export interface Education {
  id: string;
  degreeName: string;
  institutionName: string;
  completionDate: string;
  coursework?: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  year: string;
  url?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  organization: string;
  dates: string;
  responsibilities: string;
  achievement: string;
  refinedResponsibilities?: string;
  refinedAchievement?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  skills: string;
  link?: string;
  refinedDescription?: string;
}

export interface PortfolioData {
  aboutMe: {
    name: string;
    currentRole: string;
    interests: string;
    shortTermGoal: string;
    longTermGoal: string;
    generatedContent: string;
  };
  education: Education[];
  certifications: Certification[];
  experience: WorkExperience[];
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
  };
  projects: Project[];
  contact: {
    email: string;
    linkedIn: string;
    github: string;
    other?: string;
  };
}

export const initialPortfolioData: PortfolioData = {
  aboutMe: {
    name: '',
    currentRole: 'Sales Manager',
    interests: 'AI, cyber security, software engineering, operating systems, web design, app design',
    shortTermGoal: 'get connected with professionals in AI, tech world',
    longTermGoal: 'find my career after I get my degree in AI',
    generatedContent: '',
  },
  education: [
    {
      id: '1',
      degreeName: 'Information technology essentials',
      institutionName: 'Devry University',
      completionDate: 'June 2026',
      coursework: 'AI',
    }
  ],
  certifications: [],
  experience: [],
  skills: {
    technical: [],
    tools: [],
    soft: [],
  },
  projects: [],
  contact: {
    email: '',
    linkedIn: '',
    github: '',
  },
};
