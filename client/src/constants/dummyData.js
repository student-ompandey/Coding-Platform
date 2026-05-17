// ============ USERS ============
export const users = [
  { id: 1, name: "Arjun Mehta", email: "arjun@iitd.ac.in", college: "IIT Delhi", score: 450, status: "active", avatar: "AM", solved: 12, rank: 1 },
  { id: 2, name: "Sneha Patel", email: "sneha@nitk.edu.in", college: "NIT Karnakata", score: 420, status: "active", avatar: "SP", solved: 11, rank: 2 },
  { id: 3, name: "Rohan Gupta", email: "rohan@bits.ac.in", college: "BITS Pilani", score: 395, status: "active", avatar: "RG", solved: 10, rank: 3 },
  { id: 4, name: "Priya Singh", email: "priya@iitb.ac.in", college: "IIT Bombay", score: 380, status: "active", avatar: "PS", solved: 9, rank: 4 },
  { id: 5, name: "Vikram Joshi", email: "vikram@iisc.ac.in", college: "IISc Bangalore", score: 360, status: "active", avatar: "VJ", solved: 9, rank: 5 },
  { id: 6, name: "Ananya Reddy", email: "ananya@vit.ac.in", college: "VIT Vellore", score: 340, status: "active", avatar: "AR", solved: 8, rank: 6 },
  { id: 7, name: "Karan Sharma", email: "karan@dtu.ac.in", college: "DTU Delhi", score: 310, status: "banned", avatar: "KS", solved: 7, rank: 7 },
  { id: 8, name: "Meera Nair", email: "meera@nitt.edu", college: "NIT Trichy", score: 290, status: "active", avatar: "MN", solved: 7, rank: 8 },
  { id: 9, name: "Aditya Kumar", email: "aditya@iitkgp.ac.in", college: "IIT Kharagpur", score: 270, status: "active", avatar: "AK", solved: 6, rank: 9 },
  { id: 10, name: "Divya Iyer", email: "divya@coe.ac.in", college: "CoE Pune", score: 250, status: "disqualified", avatar: "DI", solved: 6, rank: 10 },
  { id: 11, name: "Nikhil Verma", email: "nikhil@iitr.ac.in", college: "IIT Roorkee", score: 230, status: "active", avatar: "NV", solved: 5, rank: 11 },
  { id: 12, name: "Ritu Agarwal", email: "ritu@nsut.ac.in", college: "NSUT Delhi", score: 210, status: "active", avatar: "RA", solved: 5, rank: 12 },
];

// ============ QUESTIONS ============
export const questions = [
  { id: 1, title: "Two Sum", difficulty: "Easy", points: 100, submissions: 156, accepted: 98, languages: ["C++", "Python", "Java", "JavaScript"], status: "published" },
  { id: 2, title: "Binary Tree Inversion", difficulty: "Medium", points: 200, submissions: 120, accepted: 45, languages: ["C++", "Python", "Java"], status: "published" },
  { id: 3, title: "Merge K Sorted Lists", difficulty: "Hard", points: 300, submissions: 89, accepted: 12, languages: ["C++", "Python", "Java", "JavaScript"], status: "published" },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", points: 100, submissions: 200, accepted: 178, languages: ["C++", "Python", "Java", "JavaScript", "Go"], status: "published" },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", points: 200, submissions: 95, accepted: 34, languages: ["C++", "Python"], status: "published" },
  { id: 6, title: "Regular Expression Matching", difficulty: "Hard", points: 350, submissions: 67, accepted: 8, languages: ["C++", "Python", "Java"], status: "draft" },
  { id: 7, title: "Container With Most Water", difficulty: "Medium", points: 200, submissions: 110, accepted: 56, languages: ["C++", "Python", "Java", "JavaScript"], status: "published" },
  { id: 8, title: "Median of Two Sorted Arrays", difficulty: "Hard", points: 300, submissions: 45, accepted: 5, languages: ["C++", "Python"], status: "published" },
];

// ============ SUBMISSIONS ============
export const submissions = [
  { id: 1, user: "Arjun Mehta", problem: "Two Sum", language: "C++", status: "Accepted", runtime: "4ms", memory: "8.2MB", time: "2 min ago" },
  { id: 2, user: "Sneha Patel", problem: "Binary Tree Inversion", language: "Python", status: "Accepted", runtime: "32ms", memory: "14.1MB", time: "3 min ago" },
  { id: 3, user: "Rohan Gupta", problem: "Merge K Sorted Lists", language: "Java", status: "Wrong Answer", runtime: "-", memory: "-", time: "5 min ago" },
  { id: 4, user: "Priya Singh", problem: "Valid Parentheses", language: "JavaScript", status: "Accepted", runtime: "1ms", memory: "7.8MB", time: "6 min ago" },
  { id: 5, user: "Vikram Joshi", problem: "Two Sum", language: "C++", status: "Time Limit", runtime: "-", memory: "-", time: "8 min ago" },
  { id: 6, user: "Ananya Reddy", problem: "Longest Palindromic Substring", language: "Python", status: "Runtime Error", runtime: "-", memory: "-", time: "10 min ago" },
  { id: 7, user: "Karan Sharma", problem: "Container With Most Water", language: "Java", status: "Accepted", runtime: "12ms", memory: "10.5MB", time: "12 min ago" },
  { id: 8, user: "Meera Nair", problem: "Binary Tree Inversion", language: "C++", status: "Wrong Answer", runtime: "-", memory: "-", time: "15 min ago" },
  { id: 9, user: "Aditya Kumar", problem: "Two Sum", language: "Python", status: "Accepted", runtime: "28ms", memory: "13.4MB", time: "18 min ago" },
  { id: 10, user: "Divya Iyer", problem: "Regular Expression Matching", language: "C++", status: "Compilation Error", runtime: "-", memory: "-", time: "20 min ago" },
  { id: 11, user: "Arjun Mehta", problem: "Merge K Sorted Lists", language: "C++", status: "Accepted", runtime: "8ms", memory: "9.1MB", time: "22 min ago" },
  { id: 12, user: "Sneha Patel", problem: "Valid Parentheses", language: "Python", status: "Accepted", runtime: "24ms", memory: "12.7MB", time: "25 min ago" },
];

// ============ LEADERBOARD ============
export const leaderboard = users
  .filter(u => u.status !== "disqualified")
  .sort((a, b) => b.score - a.score)
  .map((u, i) => ({ ...u, rank: i + 1, penalty: Math.floor(Math.random() * 200) + 50 }));

// ============ ANNOUNCEMENTS ============
export const announcements = [
  { id: 1, title: "Contest Started!", message: "The Coding Championship 2025 has officially begun. Good luck to all participants!", priority: "info", time: "1 hour ago", author: "Admin" },
  { id: 2, title: "Server Maintenance", message: "Brief maintenance window from 2:00 AM to 2:15 AM IST. Submissions during this time may be delayed.", priority: "warning", time: "3 hours ago", author: "System" },
  { id: 3, title: "Scoring Update", message: "Problem #3 scoring has been adjusted. All submissions will be re-evaluated.", priority: "urgent", time: "5 hours ago", author: "Admin" },
  { id: 4, title: "New Problem Added", message: "A bonus problem has been added to the contest. Check the Questions tab for details.", priority: "info", time: "6 hours ago", author: "Admin" },
];

// ============ CHART DATA ============
export const submissionChartData = [
  { time: "10:00", submissions: 12, accepted: 8 },
  { time: "10:30", submissions: 25, accepted: 15 },
  { time: "11:00", submissions: 45, accepted: 28 },
  { time: "11:30", submissions: 38, accepted: 22 },
  { time: "12:00", submissions: 52, accepted: 35 },
  { time: "12:30", submissions: 61, accepted: 40 },
  { time: "13:00", submissions: 48, accepted: 32 },
  { time: "13:30", submissions: 55, accepted: 38 },
  { time: "14:00", submissions: 42, accepted: 30 },
  { time: "14:30", submissions: 67, accepted: 48 },
  { time: "15:00", submissions: 73, accepted: 52 },
  { time: "15:30", submissions: 58, accepted: 41 },
];

// ============ DASHBOARD STATS ============
export const dashboardStats = [
  { label: "Total Users", value: "1,284", change: "+12%", trend: "up", icon: "Users" },
  { label: "Active Participants", value: "847", change: "+8%", trend: "up", icon: "UserCheck" },
  { label: "Total Submissions", value: "5,432", change: "+24%", trend: "up", icon: "Send" },
  { label: "Running Contests", value: "2", change: "0", trend: "neutral", icon: "Trophy" },
  { label: "Accepted Solutions", value: "3,218", change: "+18%", trend: "up", icon: "CheckCircle" },
  { label: "System Status", value: "Online", change: "99.9%", trend: "up", icon: "Activity" },
];
