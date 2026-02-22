# Student Feedback and Evaluation System - React Frontend

A modern, responsive React frontend for managing student feedback and course evaluations.

## 📋 Features

### Pages Implemented

1. **Login Page** (`/`)
   - Email and password authentication form
   - Gradient background design
   - Demo credentials display
   - Navigation to Student Dashboard

2. **Student Dashboard** (`/dashboard`)
   - Welcome message
   - Quick action cards (Submit Feedback, View Analytics, View Courses)
   - Recent courses list with status indicators
   - Responsive layout

3. **Feedback Form** (`/feedback`) ⭐ **PRIORITY**
   - Clean, centered card layout
   - Course dropdown (MUI Select)
   - Faculty member dropdown
   - Rating inputs (1-5 stars) for:
     - Teaching Quality
     - Course Content
     - Communication
     - Overall Satisfaction
   - Multiline comments textarea
   - Form validation
   - Success message on submission
   - Responsive design

4. **Admin Dashboard** (`/admin`)
   - Statistics overview cards
   - Recent feedback submissions table
   - Student, course, faculty counts
   - Rating indicators with color chips
   - Navigation to analytics

5. **Analytics & Insights Page** (`/analytics`)
   - Comprehensive feedback analysis
   - Category-wise average ratings
   - Trend indicators
   - Top-rated courses list
   - Faculty ratings
   - Back navigation button

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Navigate to the project directory:
```bash
cd "g:\FSAD Project\feedback form Frontend\feedback-form"
```

2. Install dependencies (if not already done):
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-router-dom
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Folder Structure

```
src/
├── pages/
│   ├── Login.js                 # Login page component
│   ├── StudentDashboard.js      # Student dashboard
│   ├── FeedbackForm.js          # Main feedback form (PRIORITY)
│   ├── AdminDashboard.js        # Admin dashboard
│   └── Analytics.js             # Analytics page
├── components/
│   └── (For future reusable components)
├── App.js                       # Main app with routing
├── App.css                      # Global styles
└── index.js                     # Entry point
```

## 🎨 Design Features

### Material UI Components Used
- **Card** - Layout container with elevation
- **TextField** - Input fields with validation
- **Select/MenuItem** - Dropdown selections
- **Rating** - Star rating input (1-5)
- **Button** - Various button styles
- **Grid** - Responsive layout system
- **AppBar** - Navigation header
- **Avatar** - User profile icon
- **Menu** - Dropdown menu
- **Table** - Data display
- **Chip** - Status indicators
- **Alert** - Success/error messages

### Design Principles
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Clean Spacing** - MUI Grid and Box for consistent padding
- **Color Scheme** - Professional gradient backgrounds
- **Accessibility** - Semantic HTML and ARIA labels
- **User Feedback** - Toast notifications and form validation
- **Hover Effects** - Interactive card and button animations

## 🔌 State Management

Currently using React `useState` hooks for local state management:
- Form data
- Login credentials
- Menu open/close states
- Success messages

## 🔄 Navigation Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Login | Login page |
| `/dashboard` | StudentDashboard | Student main dashboard |
| `/feedback` | FeedbackForm | Feedback submission form |
| `/admin` | AdminDashboard | Admin dashboard |
| `/analytics` | Analytics | Analytics and insights |

## 📝 Demo Data

The app includes demo data for:
- Courses (5 sample courses)
- Faculty members (5 sample faculty)
- Student feedback (4 sample feedback entries)
- Top-rated courses and faculty ratings

## 🎯 Form Validation

The Feedback Form includes validation for:
- ✓ Required course selection
- ✓ Required faculty selection
- ✓ Required ratings (all categories)
- ✓ Required comments
- ✓ Error messages for each field

## 🌈 Color Scheme

- **Primary Blue**: #1976d2 - Main brand color
- **Secondary Orange**: #f57c00 - Accent color
- **Success Green**: #388e3c - Success states
- **Background Gray**: #f5f5f5 - Page background
- **Text Gray**: #333, #666, #999 - Text colors

## 📱 Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

## 🔮 Future Enhancements

1. Backend API integration
2. User authentication with JWT
3. Database persistence
4. Excel export for analytics
5. Email notifications
6. Advanced filtering and sorting
7. Real-time feedback updates
8. User profile management

## 📚 Dependencies

- **react**: ^19.x - UI library
- **react-dom**: ^19.x - React DOM
- **react-router-dom**: ^6.x - Client-side routing
- **@mui/material**: ^5.x - Component library
- **@mui/icons-material**: ^5.x - Icon set
- **@emotion/react**: ^11.x - CSS-in-JS
- **@emotion/styled**: ^11.x - Styled components

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (⚠️ irreversible)
npm run eject
```

## 📄 License

This project is part of the FSAD (Full Stack Application Development) curriculum.

## ✨ Notes

- All components are **functional components** using React Hooks
- No backend integration yet - data is mock/demo data
- Form submission logs data to console and shows success message
- Each page is self-contained and exports as default function
- Code is beginner-friendly with clear comments and structure
