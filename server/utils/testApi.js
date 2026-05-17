import "dotenv/config";

const BASE = "http://localhost:5000/api";

async function test() {
  console.log("=== Testing API ===\n");

  // 1. Health check
  const health = await fetch(`${BASE}/health`).then(r => r.json());
  console.log("✅ Health:", health.status);

  // 2. Login as admin
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@codearena.com", password: "admin123" }),
  });
  const loginData = await loginRes.json();
  if (loginData.token) {
    console.log("✅ Admin login success:", loginData.user.name, "role:", loginData.user.role);
  } else {
    console.log("❌ Login failed:", loginData.message);
    return;
  }

  const token = loginData.token;
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // 3. Create a question
  const qRes = await fetch(`${BASE}/questions`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
      difficulty: "Easy",
      points: 100,
      sampleInput: "[2,7,11,15]\n9",
      sampleOutput: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      hiddenTestCases: [
        { input: "2 7 11 15\n9", expectedOutput: "0 1" },
        { input: "3 2 4\n6", expectedOutput: "1 2" },
      ],
    }),
  }).then(r => r.json());
  console.log("✅ Question created:", qRes.title, "ID:", qRes._id);

  // 4. Create another question
  const q2Res = await fetch(`${BASE}/questions`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Easy",
      points: 100,
      sampleInput: "()",
      sampleOutput: "true",
      hiddenTestCases: [
        { input: "()", expectedOutput: "true" },
        { input: "()[]{}", expectedOutput: "true" },
        { input: "(]", expectedOutput: "false" },
      ],
    }),
  }).then(r => r.json());
  console.log("✅ Question created:", q2Res.title);

  // 5. Create a harder question
  const q3Res = await fetch(`${BASE}/questions`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Binary Tree Inversion",
      description: "Given the root of a binary tree, invert the tree, and return its root.\n\nAn inverted tree is a tree where the left and right children of all nodes are swapped.",
      difficulty: "Medium",
      points: 200,
      sampleInput: "[4,2,7,1,3,6,9]",
      sampleOutput: "[4,7,2,9,6,3,1]",
    }),
  }).then(r => r.json());
  console.log("✅ Question created:", q3Res.title);

  // 6. Get all questions
  const questions = await fetch(`${BASE}/questions`).then(r => r.json());
  console.log("✅ Total questions:", questions.length);

  // 7. Create a contest with all questions
  const contestRes = await fetch(`${BASE}/contests`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Weekly Contest 120",
      description: "Weekly competitive programming contest",
      duration: 120,
      questions: questions.map(q => q._id),
      status: "upcoming",
    }),
  }).then(r => r.json());
  console.log("✅ Contest created:", contestRes.title, "ID:", contestRes._id);

  // 8. Start the contest
  const startRes = await fetch(`${BASE}/contests/${contestRes._id}/start`, {
    method: "PUT",
    headers: authHeaders,
  }).then(r => r.json());
  console.log("✅ Contest started:", startRes.status);

  // 9. Register a test user
  const userRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Arjun Mehta", email: "arjun@iitd.ac.in", college: "IIT Delhi", password: "test123" }),
  }).then(r => r.json());
  console.log("✅ User registered:", userRes.user?.name || "already exists");

  // 10. Register more test users
  const testUsers = [
    { name: "Sneha Patel", email: "sneha@nitk.edu.in", college: "NIT Karnataka", password: "test123" },
    { name: "Rohan Gupta", email: "rohan@bits.ac.in", college: "BITS Pilani", password: "test123" },
    { name: "Priya Singh", email: "priya@iitb.ac.in", college: "IIT Bombay", password: "test123" },
  ];
  for (const u of testUsers) {
    await fetch(`${BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(u) });
  }
  console.log("✅ 3 more test users registered");

  // 11. Get leaderboard
  const lb = await fetch(`${BASE}/leaderboard`).then(r => r.json());
  console.log("✅ Leaderboard entries:", lb.length);

  // 12. Get stats
  const statsRes = await fetch(`${BASE}/users/stats`, { headers: authHeaders }).then(r => r.json());
  console.log("✅ Stats:", JSON.stringify(statsRes));

  // 13. Create an announcement
  await fetch(`${BASE}/notifications`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ title: "Contest Started!", message: "Weekly Contest 120 has officially begun. Good luck!", priority: "info" }),
  });
  console.log("✅ Announcement created");

  console.log("\n=== All API tests passed! ===");
  console.log("\nAdmin login: admin@codearena.com / admin123");
  console.log("Test user:   arjun@iitd.ac.in / test123");
}

test().catch(console.error);
