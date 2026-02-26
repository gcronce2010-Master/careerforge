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
    },
    {
      id: 'exp3',
      jobTitle: 'Sales Floor Lead',
      organization: 'Jars Cannabis-Port Huron, MI',
      dates: 'February 2023 to September 2024',
      responsibilities: 'Controlled all aspects of sales floor operations and team leadership. Managed inventory control, stocking, and patient onboarding using Dutchie and METRC systems.',
      achievement: 'Maintained 100% customer service rating while consistently exceeding all performance goals.'
    },
    {
      id: 'exp4',
      jobTitle: 'Store Manager',
      organization: 'Continental Home Centers-Port Huron, MI',
      dates: 'January 2022 to January 2024',
      responsibilities: 'Managed all aspects of store operations, including hiring and training 10 employees. Handled scheduling, motivation, product placement, and visual merchandising standards.',
      achievement: 'Raised customer base from 390 to 600 in just 8 months and earned Store of the Month 3 times during tenure.'
    },
    {
      id: 'exp5',
      jobTitle: 'Office Installer/Driver',
      organization: 'Office Installations-Westland, MI',
      dates: 'April 2012 to February 2014',
      responsibilities: 'Built office furniture, read blue prints, and drove delivery trucks. Managed loading and unloading of product for client installations.',
      achievement: 'Demonstrated exceptional independent work skills and team collaboration in high-pressure delivery environments.'
    },
    {
      id: 'exp6',
      jobTitle: 'Sales Manager',
      organization: "Aaron's sales and lease-Port Huron, MI",
      dates: 'October 2010 to August 2011',
      responsibilities: 'Managed inventory, schedules, service issues, and team of employees. Handled opening/closing procedures and cash management.',
      achievement: 'Recognized for excellent leadership skills and ability to manage multiple complex tasks simultaneously.'
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
