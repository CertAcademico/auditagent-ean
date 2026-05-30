export type CategoryId = "auditoria" | "madurez" | "mercado" | "conocimiento";

export interface Question {
  id: string;
  category: CategoryId;
  label: string;
  desc: string;
  levels: {
    score: number;
    title: string;
    description: string;
  }[];
}

export interface AssessmentResponse {
  [questionId: string]: number; // score from 0 to 100
}

export interface AssessmentTarget {
  [categoryId: string]: number; // target goal from 0 to 100
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface GapData {
  name: string;
  A: number; // Current Score
  B: number; // Target Score
  fullMark: number;
}

export interface CriticalGap {
  id: string;
  name: string;
  current: number;
  target: number;
  gap: number;
  phase: string;
  remedy: string;
}

export interface User {
  name: string;
  email: string;
  loginTime: string;
}

export interface SavedReport {
  id: string;
  projectName: string;
  sector: string;
  date: string;
  overallMaturity: number;
  overallTarget: number;
  gap: number;
  reportText: string;
  responses: AssessmentResponse;
  targets: AssessmentTarget;
}

