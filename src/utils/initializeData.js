// Initialize app data
export const initializeAppData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      { username: '', email: 'admin@example.com', password: 'Admin123!', role: 'admin', facultyName: '', section: '' },
      { username: '', email: 'faculty@example.com', password: 'Faculty123!', role: 'faculty', facultyName: 'Dr. Smith', section: 'A' },
      { username: '2400032267', email: '2400032267@kluniversity.in', password: 'Student123!', role: 'student', facultyName: '', section: '' },
      { username: '2400032268', email: '2400032268@kluniversity.in', password: 'Student456!', role: 'student', facultyName: '', section: '' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  // Initialize feedback data if not exists
  if (!localStorage.getItem('feedback')) {
    const dummyFeedback = [
      {
        id: 1,
        studentName: "John Doe",
        course: "Mathematics",
        faculty: "Dr. Smith",
        section: "A",
        rating: 5,
        comment: "Excellent teaching!",
        createdAt: "2024-04-01T10:00:00.000Z"
      },
      {
        id: 2,
        studentName: "Jane Smith",
        course: "Physics",
        faculty: "Dr. Smith",
        section: "A",
        rating: 4,
        comment: "Very good course",
        createdAt: "2024-04-02T11:00:00.000Z"
      },
      {
        id: 3,
        studentName: "Bob Johnson",
        course: "Chemistry",
        faculty: "Dr. Johnson",
        section: "B",
        rating: 3,
        comment: "Average experience",
        createdAt: "2024-04-03T12:00:00.000Z"
      },
      {
        id: 4,
        studentName: "Alice Brown",
        course: "Biology",
        faculty: "Dr. Johnson",
        section: "B",
        rating: 4,
        comment: "Good explanations",
        createdAt: "2024-04-04T13:00:00.000Z"
      }
    ];
    localStorage.setItem('feedback', JSON.stringify(dummyFeedback));
  }
};