# UmojaHub - Testing Guide

**Version:** 1.0
**Last Updated:** January 2025
**Purpose:** Comprehensive testing checklist before production deployment

---

## Quick Start Testing

```bash
# 1. Build the application
npm run build

# 2. Start in production mode
npm start

# 3. Open browser to http://localhost:3000

# 4. Run Lighthouse audit
# Chrome DevTools → Lighthouse → Generate Report
```

---

## 🧪 Manual Testing Checklist

### Landing Page (`/`)

- [ ] Page loads within 2 seconds
- [ ] Hero image displays correctly
- [ ] All section images load properly
- [ ] Responsive on mobile (test with DevTools)
- [ ] "Get Started" button redirects to `/register`
- [ ] "Explore Platform" scrolls smoothly to sections
- [ ] Farmers section displays correctly
- [ ] Learners section displays correctly
- [ ] Employment section displays correctly
- [ ] Footer links work
- [ ] Logged-in users auto-redirect to dashboard
- [ ] No console errors

### Authentication

#### Registration (`/register`)
- [ ] Form displays all fields correctly
- [ ] Email validation works
- [ ] Password strength indicator works
- [ ] Role selection (farmer/buyer/learner/student) works
- [ ] Form submission creates user
- [ ] Success message displays
- [ ] Verification email sent (check SMTP logs)
- [ ] Redirect to dashboard after registration
- [ ] Mobile responsive

#### Login (`/login`)
- [ ] Form displays correctly
- [ ] Email/password validation
- [ ] "Remember me" checkbox works
- [ ] Successful login redirects to role-based dashboard
- [ ] Error messages display for wrong credentials
- [ ] "Forgot password" link (if implemented)
- [ ] Mobile responsive

#### Logout
- [ ] Logout button accessible in all dashboards
- [ ] Logout redirects to `/` (NOT localhost:3001)
- [ ] Session cleared completely
- [ ] User cannot access protected pages after logout

### Farmer Dashboard (`/dashboard/farmers`)

- [ ] Dashboard loads with correct user data
- [ ] Stats cards display: Total, Available, Sold, Pending
- [ ] Verification alert shows for unverified users
- [ ] "Create New Listing" button visible
- [ ] Cannot create listing without verification
- [ ] Listings grid displays existing listings
- [ ] Images load with lazy loading
- [ ] "Edit" button opens edit modal
- [ ] "Mark Sold" changes status to sold
- [ ] "Reactivate" changes status back to available
- [ ] "Delete" removes listing with confirmation
- [ ] "Knowledge Hub" button navigates correctly
- [ ] "View Marketplace" navigates to marketplace
- [ ] Logout button works
- [ ] Mobile responsive
- [ ] No console errors

#### Create Listing Modal
- [ ] Modal opens when button clicked
- [ ] All form fields present
- [ ] Crop name input works
- [ ] Quantity/unit selectors work
- [ ] Price input accepts numbers
- [ ] Location dropdown shows all Kenyan counties
- [ ] Description textarea works
- [ ] Image upload (drag & drop) works
- [ ] Image preview displays
- [ ] File type validation (JPG/PNG/WEBP)
- [ ] File size validation (max 5MB)
- [ ] Image removal button works
- [ ] Form validation prevents empty submission
- [ ] Success message after creation
- [ ] Listing appears in grid immediately
- [ ] Image uploads to Cloudinary
- [ ] Mobile responsive

### Marketplace (`/marketplace`)

- [ ] All listings display in grid
- [ ] Images load with lazy loading
- [ ] Search bar filters listings
- [ ] Location filter works (all Kenyan counties)
- [ ] Sort dropdown works (newest, oldest, price, location)
- [ ] Price range filters work
- [ ] Status filter works (available/sold)
- [ ] "Clear All Filters" resets filters
- [ ] Results count displays correctly
- [ ] Listing cards show: image, name, price, location, status
- [ ] Verified badge displays for verified farmers
- [ ] "Contact" button shows alert (demo)
- [ ] "M-Pesa" button only shows for verified farmers
- [ ] "M-Pesa" button opens payment modal
- [ ] Login required for purchases
- [ ] Mobile responsive (3→2→1 grid)
- [ ] No console errors

#### M-Pesa Payment Modal
- [ ] Modal opens with listing details
- [ ] Phone number input validates format
- [ ] Quantity selector works
- [ ] Total price calculates correctly
- [ ] Delivery options display
- [ ] Payment initiation works (STK Push)
- [ ] Loading state during payment
- [ ] Success/failure messages
- [ ] Modal closes properly

### Knowledge Hub (`/dashboard/farmers/knowledge`)

- [ ] Page loads with article grid
- [ ] Search bar filters articles
- [ ] Category filter works (6 categories)
- [ ] Article count displays correctly
- [ ] Article cards show: image, title, category, date
- [ ] Images load with lazy loading
- [ ] "Read More" opens article modal
- [ ] "Ask Farming Assistant" navigates to chat
- [ ] Mobile responsive (3→2→1 grid)

#### Article Modal
- [ ] Modal displays full article
- [ ] Article image loads
- [ ] Content displays properly
- [ ] "Open Full Article" link works
- [ ] "Ask Chatbot About This" navigates to chat
- [ ] "Close" button works
- [ ] Mobile responsive

#### AI Chatbot (`/dashboard/farmers/knowledge/chat`)
- [ ] Chat interface loads
- [ ] Input field accepts text
- [ ] Send button works
- [ ] Messages display in conversation
- [ ] AI responses generate (Ollama)
- [ ] Context from articles works
- [ ] Loading indicator during AI response
- [ ] Scroll to bottom on new message
- [ ] Mobile responsive

### Learning Hub (`/dashboard/learners`)

- [ ] Dashboard displays enrolled courses
- [ ] Course discovery section shows courses
- [ ] Search and filters work
- [ ] University filter (12 universities)
- [ ] Category filter (12+ categories)
- [ ] Difficulty filter (Beginner/Intermediate/Advanced)
- [ ] Course cards display correctly
- [ ] "Continue Learning" for enrolled courses
- [ ] "Enroll Now" for new courses
- [ ] Progress bars show completion
- [ ] Mobile responsive

#### Course Discovery (`/learn`)
- [ ] 1000+ courses load (with pagination)
- [ ] Search filters courses
- [ ] University filter works
- [ ] Category filter works
- [ ] Difficulty filter works
- [ ] Course cards show: image, title, university, rating
- [ ] Click navigates to course details

#### Course Details (`/learn/courses/[id]`)
- [ ] Course information displays
- [ ] Syllabus/lessons list
- [ ] Enroll button works
- [ ] Rating and reviews display
- [ ] Instructor information
- [ ] Prerequisites listed
- [ ] "Start Learning" after enrollment
- [ ] Mobile responsive

#### Learning Interface (`/dashboard/learners/learn/[enrollmentId]`)
- [ ] Lessons list in sidebar
- [ ] Current lesson displays
- [ ] Video player works (if implemented)
- [ ] "Mark Complete" button works
- [ ] Progress tracks correctly
- [ ] Next lesson navigation
- [ ] Quiz section (if present)
- [ ] "Generate Summary" works (Ollama)
- [ ] Mobile responsive

#### Certificates (`/dashboard/learners/certificates`)
- [ ] All earned certificates display
- [ ] Certificate details show
- [ ] Download button generates PDF
- [ ] Certificate ID visible
- [ ] Completion date displays
- [ ] Mobile responsive

### Employment Hub (`/employment`)

- [ ] Hero section displays with stats
- [ ] Search bar filters projects
- [ ] Filter button toggles filters
- [ ] Status filter works
- [ ] Category filter works (6 categories)
- [ ] Difficulty filter works
- [ ] "Clear Filters" resets all
- [ ] Project grid displays (3→2→1)
- [ ] Project cards show: category icon, difficulty, title, skills
- [ ] Open projects have "Open" badge
- [ ] Click navigates to project details
- [ ] Pagination works (if many projects)
- [ ] Mobile responsive
- [ ] No console errors

#### Project Details (`/employment/projects/[id]`)
- [ ] Project information displays
- [ ] Organization details shown
- [ ] Skills list displays
- [ ] Team size shows (current/max)
- [ ] Duration and deadline display
- [ ] Tags section shows project tags
- [ ] "Apply to Join" button visible (if not applied)
- [ ] Login required prompt works
- [ ] Application modal opens
- [ ] Already applied shows status badge
- [ ] "View Application" navigates correctly
- [ ] Certificate badge shows if applicable
- [ ] Mobile responsive

#### Application Modal
- [ ] Modal opens with project details
- [ ] All form fields present:
  - Name (prefilled if possible)
  - Email (prefilled)
  - Institution
  - Course/Major
  - Skills (multi-select from project skills)
  - Statement (min 50 chars validation)
  - Hours per week (1-40 validation)
  - Portfolio URL (optional)
- [ ] Skills multi-select works
- [ ] Form validation prevents submission with errors
- [ ] Character count for statement
- [ ] Success message after submission
- [ ] Modal closes automatically
- [ ] Application appears in "My Applications"

#### My Applications (`/employment/my-applications`)
- [ ] All applications display
- [ ] Filter by status works
- [ ] Application cards show: project, status, date
- [ ] Status badges color-coded:
  - Pending: Yellow
  - Approved: Green
  - Rejected: Red
  - Revision Requested: Blue
- [ ] Click to view details
- [ ] Resubmit option for revision requests
- [ ] Mobile responsive

### Lecturer Dashboard (`/dashboard/lecturer`)

- [ ] Dashboard loads with statistics
- [ ] Pending applications count
- [ ] Total applications
- [ ] Approval rate
- [ ] Projects stats
- [ ] Applications list displays
- [ ] Filter by status works
- [ ] Filter by project works
- [ ] "Review" button opens review modal
- [ ] Mobile responsive

#### Review Modal
- [ ] Modal displays application details
- [ ] Student information shown
- [ ] Institution and course visible
- [ ] Skills assessment section
- [ ] Statement displays (readable)
- [ ] Availability shows
- [ ] Portfolio link (if provided)
- [ ] "Approve" button works
- [ ] "Reject" button works
- [ ] "Request Revision" works
- [ ] Feedback textarea required for reject/revision
- [ ] Success message displays
- [ ] Team auto-creates on approval
- [ ] Student added to team
- [ ] Project team size updates
- [ ] Notification sent to student (if implemented)

### Admin Dashboard (`/dashboard/admin`)

- [ ] Dashboard loads with analytics
- [ ] Total users by role
- [ ] Verification statistics
- [ ] Platform metrics
- [ ] Users list displays
- [ ] Filter by role works
- [ ] Search users works
- [ ] "Verify" button for farmers works
- [ ] Verification badge appears immediately
- [ ] User management actions work
- [ ] Mobile responsive

### Buyer Dashboard (`/dashboard/buyers`)

- [ ] Dashboard loads
- [ ] Purchase history (if implemented)
- [ ] Order tracking
- [ ] Favorite listings
- [ ] Can navigate to marketplace
- [ ] Mobile responsive

---

## 🤖 Automated Testing

### Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Target Scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

**Pages to Audit:**
1. Landing page (`/`)
2. Marketplace (`/marketplace`)
3. Employment Hub (`/employment`)
4. Dashboard (any role)

### Performance Testing

```bash
# Build for production
npm run build

# Start production server
npm start

# Test with Chrome DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Throttle to "Slow 3G"
4. Reload page
5. Verify load time < 5s

# Test with Performance tab:
1. Open DevTools Performance tab
2. Click Record
3. Interact with page
4. Stop recording
5. Analyze metrics
```

### Mobile Testing

**Using Chrome DevTools:**
```
1. Open DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M)
3. Select device:
   - iPhone 12 Pro
   - iPhone SE
   - Pixel 5
   - iPad
4. Test both portrait and landscape
5. Verify no horizontal scrolling
6. Check touch targets are 48x48px+
```

**Real Device Testing:**
- iPhone (Safari)
- Android (Chrome)
- Tablet (any)

---

## 🐛 Common Issues & Solutions

### Issue: Images not loading
**Solution:** Check Cloudinary configuration in `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Issue: M-Pesa not working
**Solution:** Verify M-Pesa credentials:
```env
MPESA_CONSUMER_KEY=your-key
MPESA_CONSUMER_SECRET=your-secret
MPESA_SHORTCODE=your-shortcode
MPESA_PASSKEY=your-passkey
```

### Issue: Email not sending
**Solution:** Check SMTP configuration:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Issue: Logout redirects to wrong URL
**Solution:** Verify `.env` has:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000
```

### Issue: AI chatbot not responding
**Solution:** Ensure Ollama is running:
```bash
# Check Ollama status
ollama list

# Pull phi3 model if needed
ollama pull phi3

# Start Ollama server
ollama serve
```

### Issue: Database not seeding
**Solution:**
```bash
# Delete db.json and reseed
rm db.json

# Seed courses
npm run seed:courses

# Seed employment projects
npm run seed:employment
```

---

## 📊 Performance Benchmarks

### Target Metrics:

| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint | < 1.8s | < 3.0s |
| Largest Contentful Paint | < 2.5s | < 4.0s |
| Time to Interactive | < 3.8s | < 7.3s |
| Total Blocking Time | < 200ms | < 600ms |
| Cumulative Layout Shift | < 0.1 | < 0.25 |

### Image Optimization Targets:

| Image Type | Max Size | Format |
|------------|----------|--------|
| Hero images | 500KB | WebP |
| Product images | 200KB | WebP |
| Thumbnails | 50KB | WebP |
| Icons | 10KB | SVG |

---

## ✅ Pre-Production Checklist

### Environment Setup
- [ ] Production `.env` configured
- [ ] Database seeded correctly
- [ ] Cloudinary account active
- [ ] M-Pesa credentials valid
- [ ] SMTP email configured
- [ ] Ollama server running

### Code Quality
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint warnings
- [ ] No console.log statements in production
- [ ] Error boundaries implemented
- [ ] Loading states present
- [ ] Proper error messages

### Security
- [ ] Environment variables not in code
- [ ] Passwords hashed properly
- [ ] CSRF protection enabled
- [ ] XSS prevention in place
- [ ] SQL injection safe (using LowDB)
- [ ] Rate limiting considered

### Performance
- [ ] Lighthouse score 90+
- [ ] Images optimized with lazy loading
- [ ] Code splitting implemented
- [ ] Proper caching headers
- [ ] Gzip compression enabled
- [ ] CDN configured (if available)

### Functionality
- [ ] All roles tested thoroughly
- [ ] Email verification works
- [ ] Payment flow complete
- [ ] Applications and approvals work
- [ ] Certificates generate correctly
- [ ] Navigation consistent

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment guide ready
- [ ] User guide available

---

## 🚀 Deployment Steps

1. **Final Testing:**
   ```bash
   npm run build
   npm start
   # Test thoroughly in production mode
   ```

2. **Run Lighthouse:**
   ```bash
   lighthouse http://localhost:3000 --view
   # Verify all scores 90+
   ```

3. **Commit Changes:**
   ```bash
   git add .
   git commit -m "chore: production-ready optimizations"
   git push
   ```

4. **Deploy to Hosting:**
   - Vercel (recommended)
   - Netlify
   - AWS
   - Custom VPS

5. **Post-Deployment:**
   - Test production URL
   - Verify SSL certificate
   - Check all features
   - Monitor error logs
   - Set up analytics

---

## 📝 Test Results Template

```markdown
# UmojaHub Test Results

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Local/Production]

## Lighthouse Scores
- Performance: __/100
- Accessibility: __/100
- Best Practices: __/100
- SEO: __/100

## Manual Testing
- Landing Page: ☐ Pass ☐ Fail
- Authentication: ☐ Pass ☐ Fail
- Marketplace: ☐ Pass ☐ Fail
- Learning Hub: ☐ Pass ☐ Fail
- Employment Hub: ☐ Pass ☐ Fail
- All Dashboards: ☐ Pass ☐ Fail

## Issues Found
1. [Issue description]
2. [Issue description]

## Notes
[Additional observations]
```

---

**Testing Complete! ✅**

Once all tests pass, UmojaHub is ready for production deployment!

---

**Generated by Claude Code**
**UmojaHub Testing Guide**
**© 2025 UmojaHub. All rights reserved.**
