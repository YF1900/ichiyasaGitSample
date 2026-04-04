import { z } from "zod";

// ===== Constraint =====
export const constraintSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  category: z.enum(["market", "resource", "technical", "regulation", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  owner: z.string().min(1, "オーナーは必須です"),
});

export type ConstraintInput = z.infer<typeof constraintSchema>;

// ===== Hypothesis =====
export const hypothesisSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  assumption: z.string().min(1, "前提は必須です"),
  expectedOutcome: z.string().min(1, "期待結果は必須です"),
  status: z.enum(["draft", "testing", "validated", "invalidated"]),
  constraintId: z.string().optional(),
  owner: z.string().min(1, "オーナーは必須です"),
});

export type HypothesisInput = z.infer<typeof hypothesisSchema>;

// ===== Experiment =====
export const experimentSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  method: z.string().min(1, "手法は必須です"),
  result: z.string().optional(),
  status: z.enum(["planned", "running", "completed", "cancelled"]),
  hypothesisId: z.string().optional(),
  owner: z.string().min(1, "オーナーは必須です"),
});

export type ExperimentInput = z.infer<typeof experimentSchema>;

// ===== Feedback =====
export const feedbackSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  insight: z.string().min(1, "インサイトは必須です"),
  learningType: z.enum(["success", "failure", "observation", "improvement"]),
  actionItems: z.string().optional(),
  experimentId: z.string().optional(),
  owner: z.string().min(1, "オーナーは必須です"),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

// ===== ReleaseNote =====
export const releaseNoteSchema = z.object({
  version: z.string().min(1, "バージョンは必須です"),
  summary: z.string().min(1, "概要は必須です"),
  added: z.string().optional(),
  changed: z.string().optional(),
  fixed: z.string().optional(),
  migrationNotes: z.string().optional(),
  owner: z.string().min(1, "オーナーは必須です"),
});

export type ReleaseNoteInput = z.infer<typeof releaseNoteSchema>;
