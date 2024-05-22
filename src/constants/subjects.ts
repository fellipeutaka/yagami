export const subjects = {
  math: "MATH",
  portuguese: "PORTUGUESE",
  literature: "LITERATURE",
  history: "HISTORY",
  geography: "GEOGRAPHY",
  physics: "PHYSICS",
  chemistry: "CHEMISTRY",
  biology: "BIOLOGY",
  english: "ENGLISH",
  arts: "ARTS",
  philosophy: "PHILOSOPHY",
  sociology: "SOCIOLOGY",
} as const;

export type Subject = (typeof subjects)[keyof typeof subjects];
