/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenState = 'splash' | 'login' | 'quiz' | 'analyzing' | 'plans' | 'app';
export type PlanType = 'free' | 'pro' | 'elite';
export type StyleType = 'Ousado' | 'Engraçado' | 'Brincalhão' | 'Romântico' | 'Sedutor';

export interface UserSession {
  hasCompletedSplash: boolean;
  isLoggedIn: boolean;
  quizAnswers: Record<number, string>;
  quizStep: number;
  selectedPlan: PlanType | null;
  credits: number;
  maxCredits: number;
  creditsUsed: number;
  totalResponsesGenerated: number;
  totalPickupsCreated: number;
  activeTab: 'respuestas' | 'cantadas' | 'estadisticas';
  googleUser?: {
    displayName: string;
    email: string;
    photoURL?: string;
  };
}

export interface GeneratedResponseAnalysis {
  context: string;
  style: string;
  recommendation: string;
  levelText: string;
  percentage: number;
  content: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: {
    text: string;
    icon: string; // lucide icon name
  }[];
}
