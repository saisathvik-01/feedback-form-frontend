# Component Reference Guide

## 📚 Complete Component Documentation

---

## 1. Login Page (`src/pages/Login.js`)

**Route:** `/`

### Features:
- Email input with validation
- Password input field
- Error message display
- Loading state on submit
- Demo credentials helper text
- Gradient background (purple/pink)
- Logo icon in circle

### State:
```javascript
const [loginData, setLoginData] = useState({
  email: '',
  password: '',
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

### Key Functions:
- `handleChange()` - Updates form data
- `handleSubmit()` - Form submission with validation
- Navigation to `/dashboard` on success

### MUI Components Used:
- `Box` - Layout container
- `Card` - Main card wrapper
- `TextField` - Email/password inputs
- `Button` - Submit button
- `Typography` - Text elements
- `Alert` - Error messages
- `InputAdornment` - Icon decorations

### Styling:
- Gradient background
- Icon inputs
- Card shadow
- Responsive layout

---

## 2. Student Dashboard (`src/pages/StudentDashboard.js`)

**Route:** `/dashboard`

### Features:
- Welcome greeting
- 3 quick action cards
- Recent courses section
- AppBar with user menu
- Logout functionality
- Responsive grid layout

### State:
```javascript
const [anchorEl, setAnchorEl] = React.useState(null);
// Menu open/close state
```

### Data Structure:
```javascript
const dashboardCards = [
  {
    id: 1,
    title: 'Submit Feedback',
    description: '...',
    icon: <AssignmentIcon />,
    action: () => navigate('/feedback'),
  },
  // ... more cards
];

const recentCourses = [
  {
    id: 1,
    name: 'Introduction to React',
    instructor: 'Dr. John Smith',
    status: 'Active',
  },
  // ... more courses
];
```

### Key Functions:
- `handleMenuOpen()` - Open user menu
- `handleMenuClose()` - Close user menu
- `handleLogout()` - Logout user
- `handleNavigate()` - Navigate to pages

### MUI Components Used:
- `AppBar` & `Toolbar` - Top navigation
- `Card` - Action cards
- `Grid` - Responsive layout
- `Avatar` & `Menu` - User menu
- `Box` & `Container` - Layout
- Icons - Visual indicators

---

## 3. Feedback Form (`src/pages/FeedbackForm.js`) ⭐

**Route:** `/feedback`

### 🌟 PRIORITY COMPONENT - FULLY FEATURED

### Features:
- Course dropdown selection
- Faculty dropdown selection
- Teaching Quality rating (1-5 stars)
- Course Content rating (1-5 stars)
- Communication rating (1-5 stars)
- Overall Satisfaction rating (1-5 stars)
- Comments textarea
- Form validation
- Error messages
- Success notification
- Auto-reset after submission

### State:
```javascript
const [formData, setFormData] = useState({
  course: '',
  faculty: '',
  teachingQuality: 0,
  courseContent: 0,
  communication: 0,
  overallSatisfaction: 0,
  comments: '',
});
const [submitted, setSubmitted] = useState(false);
const [errors, setErrors] = useState({});
```

### Sample Data:
```javascript
const courses = [
  { id: 1, name: 'Introduction to React' },
  { id: 2, name: 'Advanced JavaScript' },
  // ... 5 total
];

const faculty = [
  { id: 1, name: 'Dr. John Smith' },
  { id: 2, name: 'Prof. Sarah Johnson' },
  // ... 5 total
];
```

### Validation Rules:
- Course must be selected
- Faculty must be selected
- All ratings must be 1-5 (not 0)
- Comments must not be empty
- Shows specific error for each field

### Key Functions:
- `handleSelectChange()` - Updates dropdowns
- `handleRatingChange()` - Updates star ratings
- `handleTextChange()` - Updates comments
- `validateForm()` - Validates all fields
- `handleSubmit()` - Processes form submission

### Form Flow:
1. User fills all fields
2. Click "Submit Feedback"
3. Validation runs
4. If valid → success message shows
5. Form resets after 2 seconds
6. If invalid → error messages appear

### MUI Components Used:
- `Container` - Width control
- `Card` - Main card wrapper
- `Grid` - Field layout
- `TextField` - Comments input
- `Select` & `MenuItem` - Dropdowns
- `FormControl` & `InputLabel` - Form wrappers
- `Rating` - Star rating component
- `Button` - Submit button
- `Alert` - Success message
- `Typography` - Labels & text

### Styling:
- Centered card layout
- Blue color scheme (#1976d2)
- Large responsive star ratings
- Clean spacing with Grid
- Hover effects on button
- Error styling in red

---

## 4. Admin Dashboard (`src/pages/AdminDashboard.js`)

**Route:** `/admin`

### Features:
- 4 statistics cards (Students, Feedback, Courses, Faculty)
- Recent feedback submissions table
- Color-coded ratings
- View All button to analytics
- AppBar with user menu
- Professional data display

### State:
```javascript
const [anchorEl, setAnchorEl] = React.useState(null);
```

### Statistics Data:
```javascript
const statCards = [
  {
    title: 'Total Students',
    value: '1,250',
    icon: <PeopleIcon />,
    color: '#e3f2fd',
  },
  // ... 4 total
];
```

### Recent Feedback Data:
```javascript
const recentFeedback = [
  {
    id: 1,
    student: 'Alice Johnson',
    course: 'React Basics',
    faculty: 'Dr. John Smith',
    rating: 4.5,
    date: '2026-02-20',
  },
  // ... more entries
];
```

### Key Functions:
- `getRatingColor()` - Returns color based on rating
- `handleMenuOpen()` - Open user menu
- `handleMenuClose()` - Close user menu
- `handleLogout()` - Logout user
- `handleNavigate()` - Navigate to analytics

### MUI Components Used:
- `AppBar` & `Toolbar` - Top navigation
- `Card` - Statistics cards
- `Table` - Feedback table
- `Chip` - Rating indicators
- `Container` & `Grid` - Layout
- `Avatar` & `Menu` - User menu
- Icons - Visual indicators

### Styling:
- Purple gradient AppBar
- Color-coded stat cards
- Professional table design
- Hover effects on rows
- Chip badges for ratings

---

## 5. Analytics Page (`src/pages/Analytics.js`)

**Route:** `/analytics`

### Features:
- 4 category analytics cards
- Average ratings display
- Trend indicators (+5%, +8%, etc.)
- Top rated courses list (ranking 1-5)
- Faculty ratings section
- Two-column layout
- Back button for navigation

### State:
```javascript
const [anchorEl, setAnchorEl] = React.useState(null);
```

### Analytics Data:
```javascript
const analyticsData = [
  {
    category: 'Teaching Quality',
    average: 4.2,
    total: 945,
    trend: '+5%',
  },
  // ... 4 total
];
```

### Top Courses Data:
```javascript
const topCourses = [
  { rank: 1, name: 'Introduction to React', rating: 4.8, reviews: 156 },
  // ... 5 total
];
```

### Faculty Ratings Data:
```javascript
const facultyRatings = [
  { name: 'Dr. John Smith', rating: 4.7, courses: 5 },
  // ... 5 total
];
```

### Key Functions:
- `handleMenuOpen()` - Open user menu
- `handleMenuClose()` - Close user menu
- `handleLogout()` - Logout user
- `handleNavigate()` - Navigate to other pages

### MUI Components Used:
- `AppBar` & `Toolbar` - Top navigation
- `Card` - Analytics cards
- `Box` - Content grouping
- `Typography` - Text elements
- `Button` - Back button
- `Grid` - Layout system
- `Avatar` & `Menu` - User menu
- Icons - Visual indicators

### Styling:
- Orange gradient AppBar
- Numbered ranking badges
- Trend indicators with icons
- Color-coded rating boxes
- Responsive two-column layout

---

## 6. Main App Component (`src/App.js`)

**No Direct Route - Root Component**

### Features:
- React Router configuration
- Theme provider setup
- CssBaseline for global styles
- Route definitions
- MUI theme customization

### Theme Configuration:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f57c00' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### Routes:
| Path | Component |
|------|-----------|
| `/` | Login |
| `/dashboard` | StudentDashboard |
| `/feedback` | FeedbackForm |
| `/admin` | AdminDashboard |
| `/analytics` | Analytics |
| `*` | Navigate to `/` |

### MUI Components Used:
- `ThemeProvider` - Theme setup
- `CssBaseline` - Global reset

---

## 7. Global Styling Files

### `src/App.css`
- Card hover effects
- Button animations
- Scrollbar styling
- Input focus states
- Alert animations
- Responsive typography

### `src/index.css`
- Body default styles
- Font smoothing
- Focus states
- Smooth transitions

---

## 📊 Component Hierarchy

```
App (Router & Theme)
├── ThemeProvider
├── CssBaseline
└── Router
    └── Routes
        ├── Login (/
        ├── StudentDashboard (/dashboard)
        ├── FeedbackForm (/feedback) ⭐
        ├── AdminDashboard (/admin)
        └── Analytics (/analytics)
```

---

## 🎯 Component Dependencies

### All Pages Use:
- `react` - Core library
- `react-router-dom` - Navigation
- `@mui/material` - Components
- `@mui/icons-material` - Icons

### Specific to Each Page:
- **Login:** `useNavigate`, form validation
- **StudentDashboard:** `useNavigate`, sample data
- **FeedbackForm:** Form handling, validation, state management
- **AdminDashboard:** Data display, tables, charts
- **Analytics:** Data visualization, metrics

---

## 💾 State Management Summary

### Login Page:
- Form inputs (email, password)
- Loading state
- Error messages

### StudentDashboard:
- Menu anchor element

### FeedbackForm:
- Form data (course, faculty, ratings, comments)
- Form errors
- Submission status

### AdminDashboard:
- Menu anchor element

### Analytics:
- Menu anchor element

**Total:** Uses only `useState` from React Hooks, no Redux/Context needed

---

## 🔌 Data Flow

1. **User enters Login page**
   ↓
2. **Submits login → navigates to StudentDashboard**
   ↓
3. **Clicks "Submit Feedback" → goes to FeedbackForm**
   ↓
4. **Fills form → validates → submits → success message**
   ↓
5. **Can navigate to Analytics or back to Dashboard**
   ↓
6. **Admin can view AdminDashboard**
   ↓
7. **All can logout to return to Login**

---

## 📱 Responsive Behavior

### Mobile (< 600px):
- All components stack vertically
- Single column grids
- Full-width cards
- Adjusted font sizes

### Tablet (600-960px):
- 2-column layouts
- Medium-sized cards
- Balanced spacing

### Desktop (> 960px):
- Multi-column layouts
- Full data display
- Maximum information density

---

**All components are production-ready and beginner-friendly!**
