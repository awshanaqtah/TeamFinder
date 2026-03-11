import { Major } from '../types';

export const COMMON_SKILLS = {
  [Major.AIDS]: [
    // Programming Languages
    'Python',
    'R',
    'Julia',
    'MATLAB',

    // Machine Learning Frameworks
    'TensorFlow',
    'PyTorch',
    'Keras',
    'Scikit-learn',
    'XGBoost',
    'LightGBM',

    // Data Analysis
    'Pandas',
    'NumPy',
    'SciPy',
    'Statsmodels',

    // Data Visualization
    'Matplotlib',
    'Seaborn',
    'Plotly',
    'Tableau',
    'PowerBI',
    'D3.js',

    // Big Data
    'Apache Spark',
    'Hadoop',
    'Hive',
    'Apache Kafka',

    // Databases
    'SQL',
    'MongoDB',
    'Cassandra',
    'Redis',

    // Natural Language Processing
    'NLTK',
    'spaCy',
    'TextBlob',
    'Transformers',
    'BERT',
    'GPT',

    // Computer Vision
    'OpenCV',
    'Pillow',
    'YOLO',

    // Concepts
    'Machine Learning',
    'Deep Learning',
    'Neural Networks',
    'Data Analysis',
    'Statistics',
    'Data Mining',
    'Feature Engineering',
    'Model Training',
    'Data Preprocessing',
    'Model Evaluation',
    'A/B Testing',
    'Statistical Analysis'
  ],

  [Major.CSCYS]: [
    // Programming Languages
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C',
    'Go',
    'Rust',
    'C#',
    'Ruby',
    'PHP',

    // Frontend Frameworks
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt.js',

    // Backend Frameworks
    'Node.js',
    'Express.js',
    'Django',
    'Flask',
    'FastAPI',
    'Spring Boot',
    'ASP.NET',
    'Laravel',

    // Database Technologies
    'SQL',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Cassandra',
    'Elasticsearch',

    // DevOps & Cloud
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'Google Cloud',
    'CI/CD',
    'Jenkins',
    'GitLab CI',
    'GitHub Actions',

    // Version Control
    'Git',
    'GitHub',
    'GitLab',
    'Bitbucket',

    // Web Technologies
    'HTML',
    'CSS',
    'SASS',
    'LESS',
    'REST API',
    'GraphQL',
    'WebSockets',

    // Security & Cybersecurity
    'Penetration Testing',
    'Network Security',
    'Cryptography',
    'OWASP',
    'Burp Suite',
    'Metasploit',
    'Wireshark',
    'Firewall Management',
    'Incident Response',
    'Threat Analysis',
    'Security Auditing',
    'Identity Management',
    'Network Administration',
    'Linux Administration',

    // Mobile Development
    'React Native',
    'Flutter',
    'Swift',
    'Kotlin',
    'iOS Development',
    'Android Development',

    // Testing
    'Jest',
    'Mocha',
    'Selenium',
    'Cypress',
    'JUnit',
    'PyTest'
  ],

  [Major.CISBIT]: [
    // Business Intelligence & Analytics
    'Tableau',
    'PowerBI',
    'QlikView',
    'Looker',
    'Domo',
    'SAP BusinessObjects',

    // Programming & Scripting
    'Python',
    'R',
    'SQL',
    'VBA',
    'Excel Macros',
    'JavaScript',

    // Data Analysis
    'Pandas',
    'NumPy',
    'Data Analysis',
    'Statistical Analysis',
    'Predictive Analytics',
    'Descriptive Analytics',

    // Business Processes
    'Business Analysis',
    'Requirements Gathering',
    'Process Mapping',
    'Workflow Optimization',
    'Stakeholder Management',

    // Project Management
    'Agile',
    'Scrum',
    'Kanban',
    'Waterfall',
    'Project Management',
    'JIRA',
    'Confluence',
    'Trello',
    'Asana',
    'Monday.com',

    // Enterprise Systems
    'SAP',
    'Salesforce',
    'Oracle',
    'Microsoft Dynamics',
    'NetSuite',
    'ServiceNow',
    'Workday',

    // Data Visualization
    'Data Visualization',
    'Dashboard Design',
    'Report Generation',
    'KPI Tracking',
    'Metrics Analysis',

    // Communication
    'PowerPoint',
    'Presentation Skills',
    'Stakeholder Communication',
    'Technical Writing',
    'Documentation',

    // Database Skills
    'Database Management',
    'SQL',
    'NoSQL',
    'Data Modeling',
    'Data Warehousing',

    // Business Intelligence Concepts
    'Business Intelligence',
    'Data Mining',
    'Market Research',
    'Competitive Analysis',
    'Business Intelligence Reporting',
    'Executive Dashboards'
  ]
};

export const ALL_SKILLS = [...new Set(Object.values(COMMON_SKILLS).flat())];