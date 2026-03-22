const buildRoadmap = (targetCareer) => [
  {
    id: "step-1",
    title: "Strengthen your basics",
    description: `Build the academic and practical foundations needed for ${targetCareer}.`,
    timeRequired: "2 to 4 weeks",
  },
  {
    id: "step-2",
    title: "Choose the right learning path",
    description: "Pick a course, certification, or self-learning plan that matches your budget.",
    timeRequired: "1 to 2 weeks",
  },
  {
    id: "step-3",
    title: "Learn job-ready skills",
    description: "Focus on the top technical and communication skills employers actually expect.",
    timeRequired: "2 to 6 months",
  },
  {
    id: "step-4",
    title: "Build proof of work",
    description: "Create projects, a portfolio, and small case studies to show your ability.",
    timeRequired: "1 to 3 months",
  },
  {
    id: "step-5",
    title: "Gain real-world exposure",
    description: "Apply for internships, freelance work, volunteering, or mentorship programs.",
    timeRequired: "1 to 6 months",
  },
  {
    id: "step-6",
    title: "Start applying confidently",
    description: "Prepare your resume, practice interviews, and apply to roles consistently.",
    timeRequired: "1 to 3 months",
  },
];

export const createCareerReportFallback = ({
  stream,
  marks,
  interest,
  budget,
  targetCareer,
}) => {
  const primaryCareer = targetCareer || `${interest} Specialist`;
  const alternativeCareer =
    stream === "Science"
      ? "Data Analyst"
      : stream === "Commerce"
        ? "Business Analyst"
        : "Digital Marketing Executive";

  return {
    overview: `You have a practical starting point for ${primaryCareer} with your ${stream} background and ${interest} interest.`,
    successProbability: Math.min(92, Math.max(52, Number(marks || 0) / 1.2 || 68)),
    timeToJob: budget === "Low" ? "12 to 18 months" : "8 to 14 months",
    primaryCareer,
    backupCareer: alternativeCareer,
    realityCheck: {
      competitionLevel: marks >= 85 ? "High but manageable" : "Moderate to high",
      timeToSuccess: "Consistent effort for 1 to 3 years",
      effortRequired: "Daily practice, portfolio building, and patience",
    },
    careerOptions: [
      {
        title: primaryCareer,
        fitReason: `Matches your ${interest} interest and current academic direction.`,
        courses: ["Degree or diploma program", "Online certification", "Mentored project track"],
        salary: "INR 3.5L to 8L per year",
        difficulty: "Medium",
      },
      {
        title: alternativeCareer,
        fitReason: "A strong backup option with good entry-level opportunities.",
        courses: ["Foundation course", "Internship-focused bootcamp"],
        salary: "INR 3L to 7L per year",
        difficulty: "Medium",
      },
    ],
    skillsRequired: ["Communication", "Problem solving", "Digital tools", "Self-learning"],
    missingSkills: ["Portfolio building", "Interview confidence"],
    learningRoadmap: [
      "Understand the role and entry paths",
      "Learn the core tools and concepts",
      "Build 3 portfolio-ready projects",
      "Apply for internships and beginner roles",
    ],
    miniProjects: [
      {
        title: `${primaryCareer} Starter Portfolio`,
        description: "Create a simple but polished project that solves a real student or local business problem.",
      },
      {
        title: "Career Research Dashboard",
        description: "Compare courses, fees, and salaries in a single dashboard.",
      },
      {
        title: "Resume and Profile Optimizer",
        description: "Build a basic tool or checklist that improves candidate profiles.",
      },
    ],
    dailyPlan: [
      "Day 1: Understand the role, responsibilities, and growth path",
      "Day 2: Learn the first core skill through videos or notes",
      "Day 3: Practice with a mini exercise",
      "Day 4: Build or improve one portfolio section",
      "Day 5: Review job descriptions and required skills",
      "Day 6: Update resume and online profile",
      "Day 7: Reflect, revise, and plan the next week",
    ],
    roadmap: buildRoadmap(primaryCareer),
    reportText: [
      `Primary career: ${primaryCareer}`,
      `Backup career: ${alternativeCareer}`,
      `Success probability: ${Math.min(92, Math.max(52, Number(marks || 0) / 1.2 || 68))}%`,
      `Estimated time to job: ${budget === "Low" ? "12 to 18 months" : "8 to 14 months"}`,
      "Focus on strong fundamentals, practical projects, and steady applications.",
    ].join("\n"),
  };
};

export const createComparisonFallback = (careerOne, careerTwo) => ({
  careers: [
    {
      name: careerOne,
      duration: "3 to 4 years",
      fees: "Medium to high",
      salary: "INR 3.5L to 8L",
      difficulty: "Medium",
    },
    {
      name: careerTwo,
      duration: "3 to 4 years",
      fees: "Medium",
      salary: "INR 3L to 7L",
      difficulty: "Medium",
    },
  ],
  verdict: `Choose ${careerOne} if you want the stronger match with your interest. Keep ${careerTwo} as a practical backup.`,
});

export const createSkillGapFallback = (targetCareer, currentSkills = []) => {
  const requiredSkills = [
    "Communication",
    "Problem solving",
    "Industry tools",
    "Project execution",
    "Interview readiness",
  ];
  const normalizedSkills = currentSkills.map((skill) => skill.toLowerCase());
  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedSkills.includes(skill.toLowerCase())
  );

  return {
    targetCareer,
    requiredSkills,
    missingSkills,
    learningRoadmap: [
      `Spend week 1 understanding the core expectations for ${targetCareer}.`,
      "Build one small project every 2 weeks.",
      "Practice communication and mock interview answers weekly.",
      "Track progress and update your portfolio monthly.",
    ],
  };
};

export const createProjectsFallback = (career) => ({
  projects: [
    {
      title: `${career} Portfolio Project`,
      description: "Solve a real beginner-level problem and document your approach.",
    },
    {
      title: `${career} Case Study`,
      description: "Analyze a common workflow, pain point, or customer journey in this field.",
    },
    {
      title: `${career} Collaboration Project`,
      description: "Work with one friend or peer and show teamwork, planning, and execution.",
    },
  ],
});

export const createDailyPlanFallback = (career) => ({
  timeline: [
    `Day 1: Research the top roles in ${career}`,
    "Day 2: Learn a core concept",
    "Day 3: Practice with a focused exercise",
    "Day 4: Improve your resume or portfolio",
    "Day 5: Build a mini deliverable",
    "Day 6: Review jobs and required skills",
    "Day 7: Reflect and plan your next sprint",
  ],
});

export const createInterviewFallback = (career) => ({
  technical: [
    `What are the core tools or concepts used in ${career}?`,
    `Explain one real project idea you would build for ${career}.`,
    `How do you stay updated in ${career}?`,
  ],
  hr: [
    "Tell me about yourself.",
    `Why do you want to build a career in ${career}?`,
    "Describe a challenge you handled and what you learned.",
  ],
  coding: [
    "Write a simple function to validate user input.",
    "Find the largest number in an array.",
    "Explain the difference between an array and an object.",
  ],
});

export const createResumeFallback = (targetCareer) => ({
  score: 68,
  summary: `Your resume has a decent starting structure for ${targetCareer}, but it needs stronger evidence of skills and outcomes.`,
  suggestions: [
    "Add measurable achievements instead of only responsibilities.",
    "Include 2 to 3 relevant projects with tools used.",
    "Improve the summary so it targets the exact role you want.",
    "Highlight certifications, internships, or volunteer work.",
  ],
});

export const createMentorFallback = (message) =>
  `You can absolutely move forward from here. Start by breaking "${message}" into one clear decision, one skill to build this week, and one small action you can finish today.`;

export const createRoadmapDetailFallback = (step) => ({
  title: step,
  whatToDo: "Focus on one clear output from this step and finish it before moving forward.",
  skillsNeeded: ["Consistency", "Research", "Execution"],
  tips: ["Keep it simple", "Track progress weekly", "Ask for feedback early"],
  timeRequired: "1 to 4 weeks",
});

export const createConfusionFallback = (message) => ({
  reply: `Let's simplify it. Based on "${message}", what matters most to you right now: salary, interest, stability, or short study duration?`,
  followUpQuestions: [
    "Which stream did you complete?",
    "What kind of work do you enjoy?",
    "What is your realistic budget and timeline?",
  ],
});
