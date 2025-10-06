import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { Database, Course, Lesson } from '../src/types/user';

async function seedCourses() {
  const file = join(process.cwd(), 'db.json');
  const adapter = new JSONFile<Database>(file);
  const db = new Low<Database>(adapter, {
    users: [],
    cropListings: [],
    courses: [],
    enrollments: [],
    certificates: []
  });

  await db.read();

  // Clear existing courses
  if (!db.data.courses) {
    db.data.courses = [];
  } else {
    console.log(`Found ${db.data.courses.length} existing courses. Clearing...`);
    db.data.courses = [];
  }

  // Course data organized by category
  const courses: Course[] = [
    // ========== TECHNOLOGY COURSES ==========
    {
      id: 'tech-001',
      title: 'Building Responsive Websites with HTML & CSS',
      description: 'Learn how to design mobile-friendly websites using modern HTML5 and CSS3. Perfect for beginners who want to start their web development journey.',
      category: 'Technology',
      level: 'Beginner',
      duration: '4 weeks',
      instructor: 'Jane Mwangi',
      instructorBio: 'Frontend developer with 8 years of experience teaching web development across Africa',
      image: '/images/learners/webdesign.jpg',
      lessons: [
        {
          id: 'tech-001-lesson-1',
          title: 'Introduction to HTML',
          content: `# Welcome to Web Development!

HTML (HyperText Markup Language) is the backbone of every website. In this lesson, you'll learn:

## What You'll Learn
- What HTML is and why it matters
- Basic HTML structure and syntax
- Common HTML tags (headings, paragraphs, links, images)
- Creating your first web page

## Key Concepts
HTML uses **tags** to structure content. Tags are surrounded by angle brackets like this: \`<tagname>\`

### Example:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>This is my first website.</p>
  </body>
</html>
\`\`\`

## Practice Exercise
Create a simple HTML page with:
1. A heading
2. Two paragraphs
3. An image
4. A link to your favorite website`,
          duration: 45,
          type: 'text',
          order: 1
        },
        {
          id: 'tech-001-lesson-2',
          title: 'CSS Fundamentals',
          content: `# Styling Your Website with CSS

CSS (Cascading Style Sheets) makes websites beautiful and user-friendly.

## Topics Covered
- CSS syntax and selectors
- Colors, fonts, and spacing
- The box model
- Adding CSS to HTML

### Example:
\`\`\`css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #007F4E;
  text-align: center;
}
\`\`\`

## Practice
Style your HTML page from Lesson 1 with:
- Custom colors
- Better fonts
- Proper spacing`,
          duration: 60,
          type: 'text',
          order: 2
        },
        {
          id: 'tech-001-lesson-3',
          title: 'Responsive Design with Flexbox',
          content: `# Making Websites Mobile-Friendly

Learn to create layouts that work on any device using Flexbox.

## Key Concepts
- What is responsive design?
- Flexbox container and items
- Common flexbox properties
- Media queries

### Flexbox Example:
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
\`\`\`

Build a responsive navigation bar and card layout.`,
          duration: 75,
          type: 'text',
          order: 3
        },
        {
          id: 'tech-001-lesson-4',
          title: 'Final Project: Build a Portfolio Site',
          content: `# Put It All Together

Create a complete personal portfolio website showcasing your new skills!

## Project Requirements
1. Homepage with introduction
2. About section
3. Skills/Services section
4. Contact form
5. Responsive design
6. Custom styling

Your portfolio should work perfectly on mobile, tablet, and desktop.

Submit your project for review!`,
          duration: 120,
          type: 'text',
          order: 4
        }
      ],
      enrollmentCount: 156,
      rating: 4.8,
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2025-01-15')
    },

    // Technology Course 2
    {
      id: 'tech-002',
      title: 'Data Analysis with Python',
      description: 'Master data analysis using Python, pandas, and visualization libraries. Learn to extract insights from real-world data.',
      category: 'Technology',
      level: 'Intermediate',
      duration: '6 weeks',
      instructor: 'Dr. Samuel Ochieng',
      instructorBio: 'Data scientist with a PhD in Computer Science, specialized in African market data',
      image: '/images/learners/dataanalysis.jpg',
      lessons: [
        {
          id: 'tech-002-lesson-1',
          title: 'Python Basics for Data Analysis',
          content: `# Getting Started with Python

Introduction to Python programming language and setting up your environment.

## Topics:
- Installing Python and Jupyter
- Variables and data types
- Lists, dictionaries, and tuples
- Basic operations

Start writing your first Python code!`,
          duration: 60,
          type: 'text',
          order: 1
        },
        {
          id: 'tech-002-lesson-2',
          title: 'Working with Pandas',
          content: `# Data Manipulation with Pandas

Learn to work with datasets using the powerful pandas library.

## What You'll Learn:
- Reading CSV and Excel files
- DataFrames and Series
- Filtering and sorting data
- Handling missing values

Work with real African market data!`,
          duration: 90,
          type: 'text',
          order: 2
        },
        {
          id: 'tech-002-lesson-3',
          title: 'Data Visualization',
          content: `# Creating Insightful Charts

Master data visualization with matplotlib and seaborn.

## Topics:
- Line plots and bar charts
- Scatter plots and histograms
- Customizing visualizations
- Telling stories with data

Create professional charts for reports.`,
          duration: 75,
          type: 'text',
          order: 3
        },
        {
          id: 'tech-002-lesson-4',
          title: 'Real-World Project',
          content: `# Analyze Agricultural Market Data

Apply your skills to analyze crop prices and market trends.

## Project Goals:
- Import and clean dataset
- Perform statistical analysis
- Create visualizations
- Present insights

Make data-driven recommendations!`,
          duration: 120,
          type: 'text',
          order: 4
        }
      ],
      enrollmentCount: 89,
      rating: 4.9,
      createdAt: new Date('2024-12-10'),
      updatedAt: new Date('2025-01-20')
    },

    // ========== BUSINESS COURSES ==========
    {
      id: 'biz-001',
      title: 'Digital Marketing Fundamentals',
      description: 'Learn to market your business online using social media, SEO, and content marketing strategies.',
      category: 'Business',
      level: 'Beginner',
      duration: '5 weeks',
      instructor: 'Mary Wanjiru',
      instructorBio: 'Marketing consultant helping 100+ African businesses grow online',
      image: '/images/learners/digitalmarketing.jpg',
      lessons: [
        {
          id: 'biz-001-lesson-1',
          title: 'Introduction to Digital Marketing',
          content: `# Welcome to Digital Marketing

Understand the digital marketing landscape and how it can transform your business.

## Topics:
- What is digital marketing?
- Online vs traditional marketing
- Key channels and platforms
- Success metrics

Build your marketing foundation!`,
          duration: 45,
          type: 'text',
          order: 1
        },
        {
          id: 'biz-001-lesson-2',
          title: 'Social Media Marketing',
          content: `# Growing Your Business on Social Media

Master Facebook, Instagram, Twitter, and WhatsApp for business.

## Learn About:
- Creating engaging content
- Building your audience
- Running campaigns
- Analytics and insights

Connect with customers effectively!`,
          duration: 60,
          type: 'text',
          order: 2
        },
        {
          id: 'biz-001-lesson-3',
          title: 'SEO and Content Marketing',
          content: `# Getting Found Online

Learn search engine optimization and content strategy.

## Topics:
- How search engines work
- Keyword research
- On-page optimization
- Creating valuable content

Increase your online visibility!`,
          duration: 75,
          type: 'text',
          order: 3
        },
        {
          id: 'biz-001-lesson-4',
          title: 'Marketing Strategy Project',
          content: `# Build Your Marketing Plan

Create a complete digital marketing strategy for your business.

## Deliverables:
- Target audience analysis
- Content calendar
- Social media plan
- Budget allocation

Launch your first campaign!`,
          duration: 90,
          type: 'text',
          order: 4
        }
      ],
      enrollmentCount: 203,
      rating: 4.7,
      createdAt: new Date('2024-11-20'),
      updatedAt: new Date('2025-01-10')
    },

    // ========== AGRICULTURE COURSES ==========
    {
      id: 'agri-001',
      title: 'Modern Farming Techniques',
      description: 'Learn sustainable and profitable farming methods using modern agricultural technology and best practices.',
      category: 'Agriculture',
      level: 'Beginner',
      duration: '6 weeks',
      instructor: 'John Kamau',
      instructorBio: 'Agricultural extension officer with 15 years of field experience',
      image: '/images/learners/modernfarming.jpg',
      lessons: [
        {
          id: 'agri-001-lesson-1',
          title: 'Soil Health and Preparation',
          content: `# Building Healthy Soil

Understand soil composition and prepare your land for optimal yields.

## Learn About:
- Soil types and testing
- pH levels and nutrients
- Composting and fertilization
- Crop rotation benefits

Strong soil = Strong crops!`,
          duration: 60,
          type: 'text',
          order: 1
        },
        {
          id: 'agri-001-lesson-2',
          title: 'Water Management',
          content: `# Efficient Irrigation Techniques

Master water conservation and modern irrigation methods.

## Topics:
- Drip irrigation systems
- Water harvesting
- Scheduling irrigation
- Drought management

Save water, increase yields!`,
          duration: 75,
          type: 'text',
          order: 2
        },
        {
          id: 'agri-001-lesson-3',
          title: 'Pest and Disease Management',
          content: `# Protecting Your Crops

Learn integrated pest management strategies.

## What You'll Master:
- Identifying common pests
- Organic pest control
- Disease prevention
- Safe chemical use

Keep your crops healthy!`,
          duration: 60,
          type: 'text',
          order: 3
        },
        {
          id: 'agri-001-lesson-4',
          title: 'Farm Business Management',
          content: `# Running a Profitable Farm

Turn your farm into a successful business.

## Topics:
- Record keeping
- Cost analysis
- Marketing your produce
- Scaling your operations

Maximize your profits!`,
          duration: 90,
          type: 'text',
          order: 4
        }
      ],
      enrollmentCount: 178,
      rating: 4.9,
      createdAt: new Date('2024-12-05'),
      updatedAt: new Date('2025-01-25')
    },

    // ========== CREATIVE COURSES ==========
    {
      id: 'creative-001',
      title: 'Graphic Design with Canva',
      description: 'Create professional graphics for social media, marketing, and branding using Canva.',
      category: 'Creative',
      level: 'Beginner',
      duration: '4 weeks',
      instructor: 'Grace Akinyi',
      instructorBio: 'Freelance designer creating visual content for 50+ African brands',
      image: '/images/learners/graphicdesign.jpg',
      lessons: [
        {
          id: 'creative-001-lesson-1',
          title: 'Design Fundamentals',
          content: `# Principles of Good Design

Learn the foundations of visual communication.

## Core Concepts:
- Color theory
- Typography basics
- Layout and composition
- Visual hierarchy

Create eye-catching designs!`,
          duration: 45,
          type: 'text',
          order: 1
        },
        {
          id: 'creative-001-lesson-2',
          title: 'Mastering Canva',
          content: `# Getting Started with Canva

Explore Canva's powerful design tools.

## What You'll Learn:
- Navigating the interface
- Using templates
- Working with images
- Adding text effects

Design like a pro!`,
          duration: 60,
          type: 'text',
          order: 2
        },
        {
          id: 'creative-001-lesson-3',
          title: 'Social Media Graphics',
          content: `# Creating Content That Engages

Design graphics optimized for different platforms.

## Learn To Create:
- Instagram posts and stories
- Facebook covers and ads
- Twitter headers
- LinkedIn banners

Boost your social presence!`,
          duration: 75,
          type: 'text',
          order: 3
        },
        {
          id: 'creative-001-lesson-4',
          title: 'Brand Identity Project',
          content: `# Design Your Brand Package

Create a complete visual identity.

## Deliverables:
- Logo design
- Color palette
- Social media templates
- Marketing materials

Launch your brand!`,
          duration: 90,
          type: 'text',
          order: 4
        }
      ],
      enrollmentCount: 142,
      rating: 4.8,
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2025-01-18')
    }
  ];

  // Add courses to database
  db.data.courses = courses;
  
  await db.write();
  
  console.log('✅ Successfully seeded courses!');
  console.log(`📚 Total courses: ${courses.length}`);
  console.log('   - Technology: 2');
  console.log('   - Business: 1');
  console.log('   - Agriculture: 1');
  console.log('   - Creative: 1');
}

seedCourses().catch(console.error);
