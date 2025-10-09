import { JSONFilePreset } from 'lowdb/node';
import { Database, Project, ProjectSubmission } from '../src/types/user.js';
import { v4 as uuidv4 } from 'uuid';

const defaultData: Database = {
  users: [],
  cropListings: [],
  courses: [],
  enrollments: [],
  certificates: [],
  projects: [],
  projectSubmissions: [],
  lecturerVerifications: []
};

// Demo Projects for Portfolio Builder Network
const demoProjects: Project[] = [
  {
    id: uuidv4(),
    title: 'Customer Churn Analysis for TeleConnect',
    role: 'Data Analyst',
    difficulty: 'Intermediate',
    dataSource: 'Kaggle',
    estimatedHours: 30,
    skills: ['Python', 'Pandas', 'Data Visualization', 'SQL'],
    
    clientBackground: 'TeleConnect is a mid-sized telecommunications company serving 50,000 customers across Kenya. They are experiencing a 15% annual customer churn rate and need data-driven insights to improve retention.',
    projectGoal: 'Analyze customer behavior patterns to identify key factors driving churn and provide actionable recommendations to reduce churn by at least 5% in the next quarter.',
    businessValue: 'Reducing churn by 5% would save approximately KSh 25 million annually in customer acquisition costs and increase customer lifetime value.',
    
    dataSourceLink: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
    requiredTools: ['Python', 'Pandas', 'Matplotlib/Seaborn', 'Jupyter Notebook'],
    
    deliverables: [
      {
        id: uuidv4(),
        title: 'Data Cleaning Script',
        description: 'Python script with full comments showing data cleaning process',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Exploratory Data Analysis',
        description: 'Jupyter notebook with visualizations and statistical analysis',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Executive Summary',
        description: 'Max 3-page report with key findings and recommendations',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Dashboard/Visualization',
        description: 'Interactive dashboard showing churn patterns',
        completed: false
      }
    ],
    
    detailedRequirements: `
**Strict Requirements:**
- Executive summary must be ≤ 3 pages (PDF format)
- All Python code must include inline comments explaining methodology
- Minimum 5 visualizations showing churn patterns
- Include at least 3 actionable recommendations with expected impact
- Dashboard must be interactive (Tableau Public or Plotly Dash)
- All files must be uploaded to public GitHub repository
`,
    
    stakeholderFeedback: `
**Stakeholder Review - Requested Revisions:**

Hi there,

Thank you for the initial analysis. The marketing team has reviewed your findings and has the following feedback:

1. **Missing Demographic Breakdown:** We need to see churn rates broken down by customer demographics (age, location, contract type). This is critical for targeting retention campaigns.

2. **Unclear Recommendations:** Your recommendation to "improve customer service" is too vague. Please provide specific, measurable actions with estimated costs and expected ROI.

3. **Dashboard Navigation:** The Tableau dashboard is good, but stakeholders found it difficult to navigate. Please add clear filters and a "Key Insights" landing page.

4. **Data Source Verification:** Please add a section in your report explaining how you verified data quality and handled missing values. The finance team needs this for audit purposes.

Please revise and resubmit by end of week.

Best,  
Sarah M. (Product Manager)
`,
    
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  
  {
    id: uuidv4(),
    title: 'E-Commerce Mobile App Redesign',
    role: 'UX Designer',
    difficulty: 'Intermediate',
    dataSource: 'GitHub',
    estimatedHours: 35,
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
    
    clientBackground: 'ShopEase Kenya is an e-commerce platform with 100,000 monthly users. User feedback indicates a confusing checkout process, resulting in a 60% cart abandonment rate.',
    projectGoal: 'Redesign the mobile app checkout flow to reduce cart abandonment to below 40% and improve user satisfaction scores.',
    businessValue: 'Reducing cart abandonment by 20% could increase monthly revenue by KSh 5 million. Improved UX will also reduce customer support costs.',
    
    dataSourceLink: 'https://github.com/public-apis/public-apis',
    requiredTools: ['Figma', 'UserTesting.com (free trial)', 'Maze (for usability testing)'],
    
    deliverables: [
      {
        id: uuidv4(),
        title: 'User Research Report',
        description: 'Document current pain points with 5+ user interviews',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Wireframes',
        description: 'Low-fidelity wireframes for new checkout flow',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'High-Fidelity Prototype',
        description: 'Interactive Figma prototype with at least 3 user flows',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Design Rationale Document',
        description: 'Max 5-page document explaining design decisions',
        completed: false
      }
    ],
    
    detailedRequirements: `
**Strict Requirements:**
- Conduct minimum 5 user interviews and document findings
- Wireframes must show complete checkout flow (cart → payment → confirmation)
- High-fidelity prototype must be interactive in Figma with clickable buttons
- Include accessibility considerations (WCAG 2.1 AA standards)
- Design rationale must be ≤ 5 pages with screenshots
- All files must be shared via public Figma link
- Include before/after comparison showing improvements
`,
    
    stakeholderFeedback: `
**Stakeholder Review - Requested Revisions:**

Hey!

The design team loves the direction, but we need some changes before development:

1. **Missing Payment Options:** The prototype doesn't show M-Pesa integration, which is our #1 payment method in Kenya. Please add this flow with proper error states.

2. **Accessibility Concerns:** The color contrast ratios don't meet WCAG 2.1 AA standards. Please fix the button colors and text contrast.

3. **Loading States:** What happens when the payment is processing? We need loading indicators and timeout error handling in the prototype.

4. **User Testing Results:** Your design rationale mentions "users prefer this," but we don't see actual usability test results. Please conduct at least 3 user tests and document findings.

Let's schedule a call next week to discuss!

- Mark T. (Lead Designer)
`,
    
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20')
  },
  
  {
    id: uuidv4(),
    title: 'Recipe Finder Web Application',
    role: 'Frontend Developer',
    difficulty: 'Beginner',
    dataSource: 'Public API',
    estimatedHours: 25,
    skills: ['React', 'JavaScript', 'API Integration', 'CSS'],
    
    clientBackground: 'FoodieHub is a startup building a platform to help Kenyan home cooks discover recipes based on available ingredients.',
    projectGoal: 'Build a responsive web application that allows users to search for recipes, filter by ingredients, and save favorites.',
    businessValue: 'This MVP will be used to secure Series A funding. A working prototype increases funding chances by 40% according to investor feedback.',
    
    dataSourceLink: 'https://spoonacular.com/food-api',
    requiredTools: ['React', 'CSS/Tailwind', 'Spoonacular API (free tier)'],
    
    deliverables: [
      {
        id: uuidv4(),
        title: 'Component Architecture',
        description: 'Document showing component structure and data flow',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Working Application',
        description: 'Deployed web app with search and filter features',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Source Code',
        description: 'Clean, commented code on GitHub',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'README Documentation',
        description: 'Setup instructions and feature description',
        completed: false
      }
    ],
    
    detailedRequirements: `
**Strict Requirements:**
- Must be responsive (mobile, tablet, desktop)
- Search functionality must use Spoonacular API
- Include at least 3 filters (dietary restrictions, cuisine type, prep time)
- Implement favorites/saved recipes (localStorage is acceptable)
- All code must be commented and follow React best practices
- Must be deployed (Vercel/Netlify)
- README must include setup instructions and API key configuration
`,
    
    stakeholderFeedback: `
**Stakeholder Review - Requested Revisions:**

Hi,

Thanks for the prototype! Our QA team found some issues:

1. **Mobile Responsiveness:** The recipe cards break on screens smaller than 375px. Please test on actual mobile devices.

2. **API Error Handling:** What happens when the API is down or rate-limited? Currently the app just shows a blank screen. Please add proper error messages and retry functionality.

3. **Performance:** The app is slow when showing 50+ recipes. Please implement pagination or lazy loading.

4. **Accessibility:** Missing alt text on recipe images and keyboard navigation doesn't work properly.

Please fix these issues before our investor demo!

- Lisa K. (CTO)
`,
    
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25')
  },
  
  {
    id: uuidv4(),
    title: 'Content Marketing Strategy for AgriTech Startup',
    role: 'Digital Marketer',
    difficulty: 'Intermediate',
    dataSource: 'Research Paper',
    estimatedHours: 28,
    skills: ['Content Strategy', 'SEO', 'Social Media Marketing', 'Analytics'],
    
    clientBackground: 'FarmConnect is an AgriTech startup connecting smallholder farmers with buyers. They have 5,000 registered farmers but low engagement rates.',
    projectGoal: 'Develop a 3-month content marketing strategy to increase farmer engagement by 50% and attract 10,000 new users.',
    businessValue: 'Increased engagement directly correlates with marketplace transactions. A 50% engagement boost could increase GMV by KSh 15 million quarterly.',
    
    dataSourceLink: 'https://scholar.google.com',
    requiredTools: ['Google Analytics', 'SEMrush/Ahrefs (free trial)', 'Canva', 'Buffer/Hootsuite'],
    
    deliverables: [
      {
        id: uuidv4(),
        title: 'Market Research Report',
        description: 'Analysis of target audience and competitors',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Content Calendar',
        description: '3-month calendar with topics, formats, and channels',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Sample Content',
        description: '5 pieces of sample content (blog posts, social media)',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Performance Metrics Plan',
        description: 'KPIs and measurement strategy',
        completed: false
      }
    ],
    
    detailedRequirements: `
**Strict Requirements:**
- Market research must include at least 3 competitor analysis
- Content calendar must specify exact posting dates and times
- Sample content must be production-ready (no placeholders)
- All content must be optimized for SEO (include keyword research)
- Strategy must address both organic and paid channels
- Include budget breakdown (assume KSh 500,000 budget)
- Present findings in a professional slide deck (max 15 slides)
`,
    
    stakeholderFeedback: `
**Stakeholder Review - Requested Revisions:**

Hello,

The marketing team reviewed your strategy. Great start, but we need adjustments:

1. **Language Considerations:** Your content is all in English, but 60% of our farmers prefer Swahili. Please localize at least 50% of the content calendar.

2. **Budget Allocation:** You allocated 70% to social media ads, but our data shows email marketing has 3x better ROI for farmer engagement. Please rebalance.

3. **Missing SMS Strategy:** Many farmers don't have smartphones. Where's the SMS marketing component?

4. **Content Samples:** The blog posts are too technical. Our farmers need simple, practical advice. Please rewrite in simpler language with more visuals.

Let's iterate on this!

- David O. (Marketing Director)
`,
    
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01')
  },
  
  {
    id: uuidv4(),
    title: 'REST API for Inventory Management',
    role: 'Backend Developer',
    difficulty: 'Advanced',
    dataSource: 'GitHub',
    estimatedHours: 40,
    skills: ['Node.js', 'Express', 'MongoDB', 'API Design', 'Authentication'],
    
    clientBackground: 'RetailPro manages 50 retail stores across Kenya and needs a centralized inventory management system.',
    projectGoal: 'Build a secure REST API that allows store managers to track inventory in real-time, generate reports, and sync data across locations.',
    businessValue: 'Better inventory tracking could reduce stock-outs by 30% and overstocking by 25%, saving KSh 10 million annually.',
    
    dataSourceLink: 'https://github.com/typicode/json-server',
    requiredTools: ['Node.js', 'Express', 'MongoDB/PostgreSQL', 'Postman', 'JWT'],
    
    deliverables: [
      {
        id: uuidv4(),
        title: 'API Documentation',
        description: 'Complete API documentation with all endpoints',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Working API',
        description: 'Deployed API with all CRUD operations',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Database Schema',
        description: 'Entity relationship diagram and schema design',
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Test Suite',
        description: 'Unit and integration tests with >80% coverage',
        completed: false
      }
    ],
    
    detailedRequirements: `
**Strict Requirements:**
- Minimum 10 API endpoints (CRUD for products, inventory, locations)
- Implement JWT authentication and role-based access control
- Include input validation and error handling
- Database must be normalized (3NF minimum)
- API must handle concurrent requests (test with 100+ simultaneous requests)
- Documentation must follow OpenAPI 3.0 specification
- All code must include unit tests (Jest/Mocha)
- Deploy API to cloud platform (Heroku/Railway)
`,
    
    stakeholderFeedback: `
**Stakeholder Review - Requested Revisions:**

Hi Developer,

The DevOps team tested your API and found critical issues:

1. **Security Vulnerabilities:** Your JWT tokens never expire! This is a major security risk. Please implement token refresh and expiration.

2. **Missing Rate Limiting:** The API can be easily DDoS'd. Please add rate limiting (100 requests/minute per user).

3. **Poor Error Messages:** When validation fails, the API returns "Bad Request" with no details. Please return specific error messages.

4. **No Logging:** How do we debug production issues? Please implement structured logging (Winston/Pino).

5. **Database Indexing:** Query performance is terrible with 10,000+ records. Please add proper indexes.

This needs to be fixed before production deployment.

- James M. (DevOps Lead)
`,
    
    createdAt: new Date('2025-02-05'),
    updatedAt: new Date('2025-02-05')
  }
];

async function seedProjects() {
  console.log('🌱 Seeding Employment Hub Projects...\n');
  
  try {
    const db = await JSONFilePreset<Database>('db.json', defaultData);
    
    // Initialize projects array if it doesn't exist
    if (!db.data.projects) {
      db.data.projects = [];
    }
    if (!db.data.projectSubmissions) {
      db.data.projectSubmissions = [];
    }
    if (!db.data.lecturerVerifications) {
      db.data.lecturerVerifications = [];
    }
    
    // Add projects if they don't exist
    const existingProjectIds = new Set(db.data.projects.map(p => p.id));
    const newProjects = demoProjects.filter(p => !existingProjectIds.has(p.id));
    
    if (newProjects.length > 0) {
      db.data.projects.push(...newProjects);
      await db.write();
      console.log(`✅ Added ${newProjects.length} new projects to database\n`);
      
      // Display project summary
      newProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`);
        console.log(`   Role: ${project.role} | Difficulty: ${project.difficulty}`);
        console.log(`   Skills: ${project.skills.join(', ')}`);
        console.log(`   Estimated Hours: ${project.estimatedHours}\n`);
      });
    } else {
      console.log('ℹ️  All projects already exist in database\n');
    }
    
    console.log('✨ Project seeding complete!');
    console.log(`📊 Total projects in database: ${db.data.projects.length}\n`);
    
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  }
}

seedProjects();
