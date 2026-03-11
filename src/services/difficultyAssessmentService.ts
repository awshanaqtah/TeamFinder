import { AssessmentQuiz, AssessmentQuestion, AssessmentOption, AssessmentResult } from '../types';

export const ASSESSMENT_QUESTIONS: Record<string, AssessmentQuestion[]> = {
  // AI/Data Science Skills
  'python': [
    {
      id: 'python-basic',
      skill: 'Python',
      question: 'How comfortable are you with Python syntax and basic programming?',
      options: [
        { text: 'Never used Python', score: 0 },
        { text: 'Basic syntax, simple scripts', score: 3 },
        { text: 'Comfortable with functions, classes, modules', score: 6 },
        { text: 'Expert level, used in production', score: 10 }
      ]
    },
    {
      id: 'python-ml',
      skill: 'Python',
      question: 'How experienced are you with Python for Machine Learning tasks?',
      options: [
        { text: 'Never used for ML', score: 0 },
        { text: 'Basic understanding of ML libraries', score: 3 },
        { text: 'Built ML models with Python', score: 6 },
        { text: 'Advanced ML pipelines and deployment', score: 10 }
      ]
    }
  ],
  'tensorflow': [
    {
      id: 'tensorflow-basic',
      skill: 'TensorFlow',
      question: 'How experienced are you with TensorFlow?',
      options: [
        { text: 'Never used TensorFlow', score: 0 },
        { text: 'Followed tutorials', score: 2 },
        { text: 'Built simple models', score: 5 },
        { text: 'Built and deployed complex models', score: 10 }
      ]
    }
  ],
  'keras': [
    {
      id: 'keras-usage',
      skill: 'Keras',
      question: 'How experienced are you with Keras?',
      options: [
        { text: 'Never used Keras', score: 0 },
        { text: 'Followed tutorials', score: 2 },
        { text: 'Built simple models', score: 5 },
        { text: 'Built custom layers/architectures', score: 10 }
      ]
    }
  ],
  'pandas': [
    {
      id: 'pandas-usage',
      skill: 'Pandas',
      question: 'How comfortable are you with Pandas for data manipulation?',
      options: [
        { text: 'Never used Pandas', score: 0 },
        { text: 'Basic DataFrame operations', score: 3 },
        { text: 'Complex data wrangling and analysis', score: 6 },
        { text: 'Expert at Pandas optimization', score: 10 }
      ]
    }
  ],

  // Web Development Skills
  'javascript': [
    {
      id: 'js-basics',
      skill: 'JavaScript',
      question: 'How comfortable are you with JavaScript fundamentals?',
      options: [
        { text: 'Learning JS basics', score: 0 },
        { text: 'Comfortable with basics', score: 4 },
        { text: 'Comfortable with ES6+ features', score: 7 },
        { text: 'Expert, know advanced patterns', score: 10 }
      ]
    }
  ],
  'react': [
    {
      id: 'react-usage',
      skill: 'React',
      question: 'How experienced are you with React development?',
      options: [
        { text: 'Never used React', score: 0 },
        { text: 'Built simple components', score: 3 },
        { text: 'Built apps with hooks, context', score: 6 },
        { text: 'Advanced: performance, SSR, custom hooks', score: 10 }
      ]
    }
  ],
  'typescript': [
    {
      id: 'ts-usage',
      skill: 'TypeScript',
      question: 'How experienced are you with TypeScript?',
      options: [
        { text: 'Never used TypeScript', score: 0 },
        { text: 'Basic type annotations', score: 3 },
        { text: 'Comfortable with generics, utility types', score: 6 },
        { text: 'Expert: advanced patterns, library authoring', score: 10 }
      ]
    }
  ],

  // Security Skills
  'penetration testing': [
    {
      id: 'pentest-basic',
      skill: 'Penetration Testing',
      question: 'How experienced are you with penetration testing?',
      options: [
        { text: 'Learning concepts', score: 0 },
        { text: 'Used tools in labs (HackTheBox)', score: 3 },
        { text: 'Real engagements, bug bounties', score: 7 },
        { text: 'Senior pentester, custom tools', score: 10 }
      ]
    }
  ],

  // Database Skills
  'sql': [
    {
      id: 'sql-usage',
      skill: 'SQL',
      question: 'How experienced are you with SQL and databases?',
      options: [
        { text: 'Learning SQL basics', score: 0 },
        { text: 'Basic queries, joins', score: 4 },
        { text: 'Complex queries, optimization', score: 7 },
        { text: 'Expert: DBA, performance tuning', score: 10 }
      ]
    }
  ]
};

export const generateAssessmentQuiz = (
  projectId: string,
  techStack: string[]
): AssessmentQuiz => {
  const questions: AssessmentQuestion[] = [];

  // Parse tech stack and find relevant questions
  techStack.forEach(tech => {
    const lowerTech = tech.toLowerCase().trim();

    // Find matching questions
    Object.entries(ASSESSMENT_QUESTIONS).forEach(([skill, skillQuestions]) => {
      if (lowerTech.includes(skill) || skill.includes(lowerTech)) {
        questions.push(...skillQuestions);
      }
    });
  });

  return {
    projectId,
    techStack,
    questions: questions.filter((q, i, arr) => arr.findIndex(x => x.id === q.id) === i)
  };
};

export const calculateDifficultyAdjustment = (
  answers: Map<string, number>,
  originalDifficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): AssessmentResult => {
  // Calculate average score from answers
  const scores = Array.from(answers.values());
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  // Define difficulty thresholds
  const thresholds = {
    Beginner: { min: 0, max: 4 },
    Intermediate: { min: 3, max: 7 },
    Advanced: { min: 6, max: 10 }
  };

  const originalThreshold = thresholds[originalDifficulty];

  // Determine adjusted difficulty
  let adjustedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' = originalDifficulty;

  if (avgScore < originalThreshold.min) {
    // User scored below expected level
    adjustedDifficulty = 'Advanced' as 'Beginner' | 'Intermediate' | 'Advanced';
    if (originalDifficulty === 'Advanced') adjustedDifficulty = 'Intermediate';
    else if (originalDifficulty === 'Intermediate') adjustedDifficulty = 'Beginner';
  } else if (avgScore > originalThreshold.max) {
    // User scored above expected level
    adjustedDifficulty = 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced';
    if (originalDifficulty === 'Beginner') adjustedDifficulty = 'Intermediate';
    else if (originalDifficulty === 'Intermediate') adjustedDifficulty = 'Advanced';
  }

  // Calculate confidence score (0-100)
  const confidenceScore = Math.min(100, Math.round((avgScore / 10) * 100));

  // Generate recommendations
  const recommendations = generateRecommendations(answers, avgScore);

  return {
    originalDifficulty,
    adjustedDifficulty,
    confidenceScore,
    skillScores: answers,
    recommendations
  };
};

const generateRecommendations = (
  answers: Map<string, number>,
  avgScore: number
): string[] => {
  const recommendations: string[] = [];

  if (avgScore < 4) {
    recommendations.push('Consider completing introductory tutorials for the required technologies.');
    recommendations.push('Start with simpler projects to build foundational skills.');
  } else if (avgScore < 6) {
    recommendations.push('Practice with small projects using these technologies.');
    recommendations.push('Review documentation and follow official tutorials.');
  } else if (avgScore < 8) {
    recommendations.push('You have solid fundamentals. Consider advanced features.');
    recommendations.push('Build a portfolio project to demonstrate your skills.');
  } else {
    recommendations.push('Great! You seem well-prepared for this project.');
    recommendations.push('Consider contributing to the project team as a technical lead.');
  }

  return recommendations;
};

const DIFFICULTY_RANK: Record<string, number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

export const getDifficultyRecommendations = (result: AssessmentResult): string[] => {
  const recs: string[] = [];
  const adjustedRank = DIFFICULTY_RANK[result.adjustedDifficulty] ?? 0;
  const originalRank = DIFFICULTY_RANK[result.originalDifficulty] ?? 0;

  if (adjustedRank < originalRank) {
    recs.push('✓ Based on your experience, this project may be easier than marked.');
    recs.push('✓ Consider taking on additional responsibilities or learning new skills.');
  } else if (adjustedRank > originalRank) {
    recs.push('⚠️ This project may be more challenging for your current skill level.');
    recs.push('⚠️ Consider finding teammates with stronger relevant experience.');
    recs.push('⚠️ Allocate extra time for learning during the project.');
  } else {
    recs.push('✓ Your skills match well with this project difficulty level.');
  }

  return [...recs, ...result.recommendations];
};
