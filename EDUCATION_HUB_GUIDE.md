# UmojaHub Education Hub - Complete Guide

## Overview

The Education Hub is a comprehensive learning management system that allows users to:
- Browse and search courses by category and level
- Enroll in courses
- Track learning progress
- Complete lessons with markdown content
- Earn certificates upon course completion
- View and share earned certificates

## Architecture

### Pages Structure

```
src/app/dashboard/learners/
├── page.tsx                      # Learning dashboard (overview)
├── courses/
│   ├── page.tsx                  # Course catalog (browse/search)
│   └── [id]/
│       └── page.tsx              # Course detail page (enroll)
├── learn/
│   └── [enrollmentId]/
│       └── page.tsx              # Learning interface (lesson viewer)
└── certificates/
    └── page.tsx                  # Certificates gallery
```

### API Routes

```
src/app/api/
├── courses/
│   ├── route.ts                  # GET (list), POST (create - admin only)
│   └── [id]/
│       └── route.ts              # GET (single course)
├── enrollments/
│   ├── route.ts                  # GET (user's enrollments), POST (enroll)
│   └── [id]/
│       ├── route.ts              # GET (single enrollment)
│       └── progress/
│           └── route.ts          # PUT (update progress)
└── certificates/
    └── route.ts                  # GET (user's certificates), POST (generate)
```

## Data Models

### Course

```typescript
interface Course {
  id: string;                     // Unique identifier
  title: string;                  // Course title
  description: string;            // Course description
  category: string;               // Technology, Business, Agriculture, Creative
  level: string;                  // Beginner, Intermediate, Advanced
  duration: string;               // e.g., "4 weeks"
  instructor: string;             // Instructor name
  instructorBio: string;          // Instructor biography
  image: string;                  // Course image URL
  lessons: Lesson[];              // Array of lessons
  enrollmentCount: number;        // Number of enrolled students
  rating: number;                 // Course rating (1-5)
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Lesson

```typescript
interface Lesson {
  id: string;                     // Unique identifier
  title: string;                  // Lesson title
  content: string;                // Markdown content
  duration: number;               // Duration in minutes
  type: string;                   // Content type (text, video, quiz)
  order: number;                  // Lesson order in course
}
```

### Enrollment

```typescript
interface Enrollment {
  id: string;                     // Unique identifier
  userId: string;                 // User ID
  userName: string;               // User name
  courseId: string;               // Course ID
  courseTitle: string;            // Course title (cached)
  progress: number;               // Progress percentage (0-100)
  completedLessons: string[];     // Array of completed lesson IDs
  currentLessonId: string;        // Current lesson ID
  completed: boolean;             // Course completion status
  certificateId?: string;         // Certificate ID (if completed)
  enrolledAt: Date;              // Enrollment timestamp
  lastAccessedAt: Date;          // Last access timestamp
  completedAt?: Date;            // Completion timestamp
}
```

### Certificate

```typescript
interface Certificate {
  id: string;                     // Unique identifier
  userId: string;                 // User ID
  userName: string;               // User name
  courseId: string;               // Course ID
  courseTitle: string;            // Course title
  completionDate: Date;          // Completion date
  certificateUrl: string;         // Certificate download URL
  verificationCode: string;       // Unique verification code
  issuedAt: Date;                // Issue timestamp
}
```

## User Workflows

### 1. Browsing Courses

**Page:** `/dashboard/learners/courses`

**Features:**
- Search courses by title, description, or instructor
- Filter by category (Technology, Business, Agriculture, Creative)
- Filter by level (Beginner, Intermediate, Advanced)
- View course cards with:
  - Title and description
  - Category and level badges
  - Instructor name
  - Duration, enrollment count, and rating

**API Call:**
```javascript
GET /api/courses?category=Technology&level=Beginner&search=python
```

### 2. Viewing Course Details

**Page:** `/dashboard/learners/courses/[id]`

**Features:**
- Full course description
- Instructor information
- Course statistics (duration, students, rating, lessons)
- Complete lesson list with completion indicators
- Enrollment button (or progress if already enrolled)

**API Calls:**
```javascript
GET /api/courses/[id]        // Get course details
GET /api/enrollments         // Check if already enrolled
```

### 3. Enrolling in a Course

**Action:** Click "Enroll Now" button on course detail page

**API Call:**
```javascript
POST /api/enrollments
Body: { courseId: "course-123" }
```

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "id": "enrollment-456",
    "courseId": "course-123",
    "progress": 0,
    "completedLessons": [],
    "currentLessonId": "lesson-1"
  },
  "message": "Successfully enrolled in course"
}
```

### 4. Learning (Taking Lessons)

**Page:** `/dashboard/learners/learn/[enrollmentId]`

**Features:**
- Sidebar with all lessons and completion status
- Main content area with markdown-rendered lesson
- Navigation buttons (Previous/Next)
- Mark Complete button
- Progress bar at top

**Key Components:**
- Uses `react-markdown` for lesson content rendering
- Tracks current lesson and completed lessons
- Auto-advances to next lesson on completion

**API Calls:**
```javascript
GET /api/enrollments/[id]              // Get enrollment data
GET /api/courses/[courseId]            // Get course and lessons
PUT /api/enrollments/[id]/progress     // Mark lesson complete
```

### 5. Completing a Lesson

**Action:** Click "Mark Complete & Continue" button

**API Call:**
```javascript
PUT /api/enrollments/[enrollmentId]/progress
Body: { lessonId: "lesson-1" }
```

**Backend Logic:**
1. Add lesson to completedLessons array
2. Calculate new progress percentage
3. If all lessons completed:
   - Set enrollment.completed = true
   - Auto-generate certificate
   - Add certificate to user profile

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "progress": 50,
    "completedLessons": ["lesson-1", "lesson-2"],
    "completed": false
  },
  "message": "Progress updated successfully"
}
```

### 6. Earning a Certificate

**Trigger:** Automatic when last lesson is completed

**Backend Process:**
1. Mark enrollment as completed
2. Generate unique verification code (e.g., "ABCD-1234-EFGH")
3. Create certificate record
4. Link certificate to user profile
5. Return updated enrollment with certificate ID

**Certificate Data:**
```json
{
  "id": "cert-789",
  "userName": "John Doe",
  "courseTitle": "Building Responsive Websites",
  "completionDate": "2025-01-15",
  "verificationCode": "ABCD-1234-EFGH-5678",
  "certificateUrl": "/api/certificates/ABCD-1234-EFGH-5678/download"
}
```

### 7. Viewing Certificates

**Page:** `/dashboard/learners/certificates`

**Features:**
- Grid of earned certificates
- Each certificate shows:
  - Course title
  - Completion date
  - Verification code
  - Download button
  - Share button

**API Call:**
```javascript
GET /api/certificates
```

## Learning Dashboard

**Page:** `/dashboard/learners`

**Sections:**

1. **Stats Overview**
   - Enrolled Courses count
   - Overall Progress percentage
   - Certificates earned count

2. **Continue Learning**
   - Shows in-progress courses
   - Displays progress bars
   - Click to resume learning

3. **Quick Actions**
   - Browse Courses
   - My Certificates
   - Back to Home

4. **Recommended Courses**
   - Top 3 popular courses
   - Based on enrollment count

## Admin Functions

### Creating a Course

**Endpoint:** `POST /api/courses`

**Permission:** Admin role required

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "category": "Technology",
  "level": "Beginner",
  "duration": "4 weeks",
  "instructor": "Jane Doe",
  "instructorBio": "Expert with 10 years experience",
  "image": "/images/course.jpg",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Introduction",
      "content": "# Lesson Content\n\nMarkdown text...",
      "duration": 45,
      "type": "text",
      "order": 1
    }
  ]
}
```

## Seeding Courses

### Running the Seed Script

```bash
npx tsx scripts/seed-courses.ts
```

### Seed Data Includes:

1. **Technology Courses (2)**
   - Building Responsive Websites with HTML & CSS
   - Data Analysis with Python

2. **Business Courses (1)**
   - Digital Marketing Fundamentals

3. **Agriculture Courses (1)**
   - Modern Farming Techniques

4. **Creative Courses (1)**
   - Graphic Design with Canva

Each course has 4 detailed lessons with markdown content.

## Lesson Content
