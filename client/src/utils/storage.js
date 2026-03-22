export const APP_KEYS = {
  form: "career-platform-form",
  report: "career-platform-report",
  roadmap: "career-platform-roadmap",
  completedSteps: "career-platform-completed-steps",
  theme: "career-platform-theme",
  mentorChat: "career-platform-mentor-chat",
  confusionChat: "career-platform-confusion-chat",
  user: "career-platform-user",
  points: "career-platform-points",
  lastLoginDate: "career-platform-last-login",
  leaderboard: "career-platform-leaderboard",
};

export const getTodayKey = () => new Date().toISOString().split("T")[0];

export const downloadTextReport = async (reportText) => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(reportText, 180);
  doc.setFontSize(18);
  doc.text("AI Career Report", 14, 18);
  doc.setFontSize(11);
  doc.text(lines, 14, 32);
  doc.save("career-report.pdf");
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

export const getLeaderboardData = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(APP_KEYS.leaderboard) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const mergeLeaderboard = (entries, user, points) => {
  const baseEntries = [
    { name: "Aarav", points: 140 },
    { name: "Siya", points: 120 },
    { name: "Kabir", points: 110 },
  ];
  const merged = [...baseEntries, ...entries].filter(
    (entry, index, array) =>
      index === array.findIndex((item) => item.name.toLowerCase() === entry.name.toLowerCase())
  );

  if (user?.name) {
    const existingIndex = merged.findIndex(
      (entry) => entry.name.toLowerCase() === user.name.toLowerCase()
    );
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], points };
    } else {
      merged.push({ name: user.name, points });
    }
  }

  const ranked = merged.sort((a, b) => b.points - a.points).slice(0, 8);
  localStorage.setItem(APP_KEYS.leaderboard, JSON.stringify(ranked));
  return ranked;
};

export const getProgressValue = (roadmap, completedSteps) => {
  if (!roadmap?.length) {
    return 0;
  }

  return Math.round((completedSteps.length / roadmap.length) * 100);
};
