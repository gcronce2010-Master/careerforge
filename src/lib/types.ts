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
    name: 'Alex Rivera',
    currentRole: 'Assistant Store Manager',
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
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Assistant Store Manager',
      organization: 'Rent a Center-Fort Gratiot Township, MI',
      dates: 'March 2024 to Present',
      responsibilities: 'In charge of all sales and staff management. Responsible for opening and closing of store, all daily paperwork, cash register operations, and maintaining store organization.',
      achievement: 'Successfully managing daily operations and sales team to meet store performance targets.'
    },
    {
      id: 'exp2',
      jobTitle: 'Office Manager',
      organization: 'AutoCar Inc-Lenox, MI',
      dates: 'September 2024 to October 2024',
      responsibilities: 'Managed computer programming and software updates. Utilized Quickbooks, SAP Front, and Outlook for scheduling, estimates, invoices, and payroll. Proficient in Excel, PowerPoint, Word, Access, and Google Docs.',
      achievement: 'Streamlined office operations by managing accounts payable/receivable and coordinating client vehicle rentals.'
    }
  ],
  skills: {
    technical: ['Quickbooks', 'SAP Front', 'METRC', 'Dutchie', 'Microsoft Access', 'Computer Programming', 'Hardware Setup'],
    tools: ['Excel', 'PowerPoint', 'Word', 'Outlook', 'Zoom', 'Shop Boss', 'PDF Editing'],
    soft: ['Leadership', 'Team Motivation', 'Customer Service', 'Conflict Resolution', 'Inventory Management'],
  },
  projects: [],
  contact: {
    email: '',
    linkedIn: '',
    github: '',
  },
};
