import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectStatus, ProjectDifficulty } from '@/types/employment';

/**
 * Curated real-world projects
 * In production, these would be fetched from GitHub, GSoC, Kaggle APIs
 * For now, we'll use curated high-quality projects
 */

const CURATED_PROJECTS: Omit<Project, 'id' | 'postedAt'>[] = [
  // Web Development Projects
  {
    title: 'Open Source E-Commerce Platform',
    description: 'Build a modern e-commerce platform using React, Node.js, and MongoDB. Features include product management, shopping cart, payment integration, and admin dashboard.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'REST API', 'Stripe'],
    organization: 'Open Commerce Initiative',
    difficulty: 'Advanced',
    duration: '4 months',
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/images/projects/ecommerce.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 6,
    currentTeamSize: 0,
    category: 'Web Development',
    tags: ['E-Commerce', 'Full-Stack', 'Payment Integration'],
  },
  {
    title: 'Community Health Tracker',
    description: 'Develop a web application to track community health metrics, appointments, and vaccination records for rural health centers in Kenya.',
    skills: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'PWA'],
    organization: 'HealthTech Africa',
    difficulty: 'Intermediate',
    duration: '3 months',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/images/projects/health-tracker.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 5,
    currentTeamSize: 0,
    category: 'Web Development',
    tags: ['Healthcare', 'Social Impact', 'PWA'],
  },
  {
    title: 'Student Collaboration Platform',
    description: 'Create a real-time collaboration tool for students with video calls, document sharing, and project management features.',
    skills: ['Next.js', 'WebRTC', 'Socket.io', 'PostgreSQL'],
    organization: 'EduConnect',
    difficulty: 'Advanced',
    duration: '5 months',
    image: '/images/projects/collaboration.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 7,
    currentTeamSize: 0,
    category: 'Web Development',
    tags: ['Real-time', 'Video Conferencing', 'Education'],
  },

  // Data Science Projects
  {
    title: 'Agricultural Yield Prediction Model',
    description: 'Build a machine learning model to predict crop yields based on weather data, soil conditions, and farming practices for Kenyan farmers.',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Data Visualization'],
    organization: 'AgriTech Kenya',
    difficulty: 'Advanced',
    duration: '3 months',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/images/projects/agriculture-ml.jpg',
    status: 'Open',
    source: 'Kaggle',
    maxTeamSize: 4,
    currentTeamSize: 0,
    category: 'Data Science',
    tags: ['Machine Learning', 'Agriculture', 'Predictive Analytics'],
  },
  {
    title: 'Wildlife Conservation Dashboard',
    description: 'Create an interactive dashboard analyzing wildlife population data and migration patterns to support conservation efforts.',
    skills: ['Python', 'Jupyter', 'Matplotlib', 'Plotly', 'SQL'],
    organization: 'Wildlife Conservation Society',
    difficulty: 'Intermediate',
    duration: '2 months',
    image: '/images/projects/wildlife.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 3,
    currentTeamSize: 0,
    category: 'Data Science',
    tags: ['Data Visualization', 'Conservation', 'Analytics'],
  },
  {
    title: 'Financial Fraud Detection System',
    description: 'Develop a machine learning system to detect fraudulent transactions using anomaly detection algorithms.',
    skills: ['Python', 'Scikit-learn', 'XGBoost', 'Feature Engineering'],
    organization: 'FinSec Solutions',
    difficulty: 'Advanced',
    duration: '4 months',
    image: '/images/projects/fraud-detection.jpg',
    status: 'Open',
    source: 'Kaggle',
    maxTeamSize: 4,
    currentTeamSize: 0,
    category: 'Data Science',
    tags: ['Machine Learning', 'Security', 'Finance'],
  },

  // Mobile Development Projects
  {
    title: 'Mobile Banking App for Rural Communities',
    description: 'Build a React Native mobile app for microfinance and mobile money transactions in rural areas with offline support.',
    skills: ['React Native', 'TypeScript', 'SQLite', 'REST API'],
    organization: 'Rural Finance Initiative',
    difficulty: 'Advanced',
    duration: '5 months',
    deadline: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/images/projects/mobile-banking.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 5,
    currentTeamSize: 0,
    category: 'Mobile Development',
    tags: ['FinTech', 'Offline-First', 'Social Impact'],
  },
  {
    title: 'Language Learning App',
    description: 'Create a gamified mobile app for learning local African languages with voice recognition and cultural lessons.',
    skills: ['Flutter', 'Dart', 'Firebase', 'Speech Recognition API'],
    organization: 'AfroLingo',
    difficulty: 'Intermediate',
    duration: '4 months',
    image: '/images/projects/language-app.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 4,
    currentTeamSize: 0,
    category: 'Mobile Development',
    tags: ['Education', 'Gamification', 'AI'],
  },

  // DevOps & Cloud Projects
  {
    title: 'CI/CD Pipeline for Microservices',
    description: 'Design and implement a complete CI/CD pipeline using Jenkins, Docker, and Kubernetes for a microservices architecture.',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Git', 'Bash'],
    organization: 'DevOps Academy',
    difficulty: 'Advanced',
    duration: '3 months',
    image: '/images/projects/devops.jpg',
    status: 'Open',
    source: 'GitHub',
    maxTeamSize: 3,
    currentTeamSize: 0,
    category: 'DevOps',
    tags: ['CI/CD', 'Containers', 'Automation'],
  },
  {
    title: 'Cloud Infrastructure Monitoring',
    description: 'Build a monitoring and alerting system for cloud infrastructure using Prometheus, Grafana, and AWS CloudWatch.',
    skills: ['AWS', 'Prometheus', 'Grafana', 'Python', 'Terraform'],
    organization: 'CloudWatch Solutions',
    difficulty: 'Intermediate',
    duration: '2 months',
    image: '/images/projects/monitoring.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 3,
    currentTeamSize: 0,
    category: 'DevOps',
    tags: ['Monitoring', 'Cloud', 'Infrastructure'],
  },

  // AI/ML Projects
  {
    title: 'Chatbot for Mental Health Support',
    description: 'Develop an AI-powered chatbot providing mental health support and resources for university students using natural language processing.',
    skills: ['Python', 'NLP', 'TensorFlow', 'Rasa', 'FastAPI'],
    organization: 'MindCare AI',
    difficulty: 'Advanced',
    duration: '4 months',
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/images/projects/mental-health-ai.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 4,
    currentTeamSize: 0,
    category: 'Artificial Intelligence',
    tags: ['NLP', 'Mental Health', 'Chatbot'],
  },
  {
    title: 'Image Recognition for Plant Diseases',
    description: 'Train a computer vision model to identify plant diseases from leaf images to help farmers detect issues early.',
    skills: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'Mobile Deployment'],
    organization: 'FarmVision',
    difficulty: 'Advanced',
    duration: '3 months',
    image: '/images/projects/plant-disease.jpg',
    status: 'Open',
    source: 'Kaggle',
    maxTeamSize: 4,
    currentTeamSize: 0,
    category: 'Artificial Intelligence',
    tags: ['Computer Vision', 'Agriculture', 'Deep Learning'],
  },

  // Blockchain Projects
  {
    title: 'Supply Chain Tracking on Blockchain',
    description: 'Build a blockchain-based system for tracking agricultural products from farm to market ensuring transparency.',
    skills: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'Smart Contracts'],
    organization: 'BlockChain Agriculture',
    difficulty: 'Advanced',
    duration: '5 months',
    image: '/images/projects/blockchain-supply.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 5,
    currentTeamSize: 0,
    category: 'Blockchain',
    tags: ['Smart Contracts', 'Supply Chain', 'Transparency'],
  },

  // Beginner-Friendly Projects
  {
    title: 'Community Event Platform',
    description: 'Create a simple web platform for listing and managing community events with RSVP functionality.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Firebase'],
    organization: 'Community Connect',
    difficulty: 'Beginner',
    duration: '2 months',
    image: '/images/projects/events.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 4,
    currentTeamSize: 0,
    category: 'Web Development',
    tags: ['Frontend', 'Community', 'Events'],
  },
  {
    title: 'Personal Budget Tracker',
    description: 'Build a web application to help users track their income, expenses, and savings goals with charts and reports.',
    skills: ['React', 'JavaScript', 'Chart.js', 'LocalStorage'],
    organization: 'FinLit Education',
    difficulty: 'Beginner',
    duration: '6 weeks',
    image: '/images/projects/budget.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 3,
    currentTeamSize: 0,
    category: 'Web Development',
    tags: ['Finance', 'Data Visualization', 'Learning'],
  },
  {
    title: 'Recipe Sharing Website',
    description: 'Create a website where users can share, search, and rate recipes from different African cuisines.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
    organization: 'Afro Cuisine',
    difficulty: 'Beginner',
    duration: '2 months',
    image: '/images/projects/recipes.jpg',
    status: 'Open',
    source: 'Curated',
    maxTeamSize: 3,
    currentTeamSize: 0,
    category: 'Web Development',
    tags: ['Food', 'Community', 'Full-Stack'],
  },
];

/**
 * Generate project data with IDs and timestamps
 */
export async function seedProjects(): Promise<Project[]> {
  const projects: Project[] = CURATED_PROJECTS.map((project) => ({
    ...project,
    id: uuidv4(),
    postedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Posted within last 30 days
  }));

  return projects;
}

/**
 * Get project statistics
 */
export function getProjectStats(projects: Project[]) {
  return {
    total: projects.length,
    open: projects.filter((p) => p.status === 'Open').length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    closed: projects.filter((p) => p.status === 'Closed').length,
    byDifficulty: {
      beginner: projects.filter((p) => p.difficulty === 'Beginner').length,
      intermediate: projects.filter((p) => p.difficulty === 'Intermediate').length,
      advanced: projects.filter((p) => p.difficulty === 'Advanced').length,
    },
    byCategory: projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
