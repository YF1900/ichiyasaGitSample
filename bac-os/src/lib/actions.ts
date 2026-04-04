"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import {
  constraintSchema,
  hypothesisSchema,
  experimentSchema,
  feedbackSchema,
  releaseNoteSchema,
  type ConstraintInput,
  type HypothesisInput,
  type ExperimentInput,
  type FeedbackInput,
  type ReleaseNoteInput,
} from "@/types/entities";
import { revalidatePath } from "next/cache";

// ===== Constraint Actions =====

export async function getConstraints() {
  try {
    return await prisma.constraint.findMany({
      orderBy: { createdAt: "desc" },
      include: { hypotheses: { select: { id: true } } },
    });
  } catch (error) {
    logger.error("getConstraints", "制約の取得に失敗しました", error);
    throw new Error("制約の取得に失敗しました");
  }
}

export async function getConstraint(id: string) {
  try {
    return await prisma.constraint.findUnique({
      where: { id },
      include: { hypotheses: true },
    });
  } catch (error) {
    logger.error("getConstraint", "制約の取得に失敗しました", error, { id });
    throw new Error("制約の取得に失敗しました");
  }
}

export async function createConstraint(data: ConstraintInput) {
  const validated = constraintSchema.parse(data);
  try {
    const result = await prisma.constraint.create({ data: validated });
    logger.info("createConstraint", "制約を作成しました", { id: result.id });
    revalidatePath("/constraints");
    return result;
  } catch (error) {
    logger.error("createConstraint", "制約の作成に失敗しました", error);
    throw new Error("制約の作成に失敗しました");
  }
}

export async function updateConstraint(id: string, data: ConstraintInput) {
  const validated = constraintSchema.parse(data);
  try {
    const result = await prisma.constraint.update({ where: { id }, data: validated });
    logger.info("updateConstraint", "制約を更新しました", { id });
    revalidatePath("/constraints");
    return result;
  } catch (error) {
    logger.error("updateConstraint", "制約の更新に失敗しました", error, { id });
    throw new Error("制約の更新に失敗しました");
  }
}

export async function deleteConstraint(id: string) {
  try {
    await prisma.constraint.delete({ where: { id } });
    logger.info("deleteConstraint", "制約を削除しました", { id });
    revalidatePath("/constraints");
  } catch (error) {
    logger.error("deleteConstraint", "制約の削除に失敗しました", error, { id });
    throw new Error("制約の削除に失敗しました");
  }
}

// ===== Hypothesis Actions =====

export async function getHypotheses() {
  try {
    return await prisma.hypothesis.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        constraint: { select: { id: true, title: true } },
        experiments: { select: { id: true } },
      },
    });
  } catch (error) {
    logger.error("getHypotheses", "仮説の取得に失敗しました", error);
    throw new Error("仮説の取得に失敗しました");
  }
}

export async function createHypothesis(data: HypothesisInput) {
  const validated = hypothesisSchema.parse(data);
  try {
    const result = await prisma.hypothesis.create({ data: validated });
    logger.info("createHypothesis", "仮説を作成しました", { id: result.id });
    revalidatePath("/hypotheses");
    return result;
  } catch (error) {
    logger.error("createHypothesis", "仮説の作成に失敗しました", error);
    throw new Error("仮説の作成に失敗しました");
  }
}

export async function updateHypothesis(id: string, data: HypothesisInput) {
  const validated = hypothesisSchema.parse(data);
  try {
    const result = await prisma.hypothesis.update({ where: { id }, data: validated });
    logger.info("updateHypothesis", "仮説を更新しました", { id });
    revalidatePath("/hypotheses");
    return result;
  } catch (error) {
    logger.error("updateHypothesis", "仮説の更新に失敗しました", error, { id });
    throw new Error("仮説の更新に失敗しました");
  }
}

export async function deleteHypothesis(id: string) {
  try {
    await prisma.hypothesis.delete({ where: { id } });
    logger.info("deleteHypothesis", "仮説を削除しました", { id });
    revalidatePath("/hypotheses");
  } catch (error) {
    logger.error("deleteHypothesis", "仮説の削除に失敗しました", error, { id });
    throw new Error("仮説の削除に失敗しました");
  }
}

// ===== Experiment Actions =====

export async function getExperiments() {
  try {
    return await prisma.experiment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        hypothesis: { select: { id: true, title: true } },
        feedbacks: { select: { id: true } },
      },
    });
  } catch (error) {
    logger.error("getExperiments", "実験の取得に失敗しました", error);
    throw new Error("実験の取得に失敗しました");
  }
}

export async function createExperiment(data: ExperimentInput) {
  const validated = experimentSchema.parse(data);
  try {
    const result = await prisma.experiment.create({ data: validated });
    logger.info("createExperiment", "実験を作成しました", { id: result.id });
    revalidatePath("/experiments");
    return result;
  } catch (error) {
    logger.error("createExperiment", "実験の作成に失敗しました", error);
    throw new Error("実験の作成に失敗しました");
  }
}

export async function updateExperiment(id: string, data: ExperimentInput) {
  const validated = experimentSchema.parse(data);
  try {
    const result = await prisma.experiment.update({ where: { id }, data: validated });
    logger.info("updateExperiment", "実験を更新しました", { id });
    revalidatePath("/experiments");
    return result;
  } catch (error) {
    logger.error("updateExperiment", "実験の更新に失敗しました", error, { id });
    throw new Error("実験の更新に失敗しました");
  }
}

export async function deleteExperiment(id: string) {
  try {
    await prisma.experiment.delete({ where: { id } });
    logger.info("deleteExperiment", "実験を削除しました", { id });
    revalidatePath("/experiments");
  } catch (error) {
    logger.error("deleteExperiment", "実験の削除に失敗しました", error, { id });
    throw new Error("実験の削除に失敗しました");
  }
}

// ===== Feedback Actions =====

export async function getFeedbacks() {
  try {
    return await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        experiment: { select: { id: true, title: true } },
      },
    });
  } catch (error) {
    logger.error("getFeedbacks", "フィードバックの取得に失敗しました", error);
    throw new Error("フィードバックの取得に失敗しました");
  }
}

export async function createFeedback(data: FeedbackInput) {
  const validated = feedbackSchema.parse(data);
  try {
    const result = await prisma.feedback.create({ data: validated });
    logger.info("createFeedback", "フィードバックを作成しました", { id: result.id });
    revalidatePath("/feedbacks");
    return result;
  } catch (error) {
    logger.error("createFeedback", "フィードバックの作成に失敗しました", error);
    throw new Error("フィードバックの作成に失敗しました");
  }
}

export async function updateFeedback(id: string, data: FeedbackInput) {
  const validated = feedbackSchema.parse(data);
  try {
    const result = await prisma.feedback.update({ where: { id }, data: validated });
    logger.info("updateFeedback", "フィードバックを更新しました", { id });
    revalidatePath("/feedbacks");
    return result;
  } catch (error) {
    logger.error("updateFeedback", "フィードバックの更新に失敗しました", error, { id });
    throw new Error("フィードバックの更新に失敗しました");
  }
}

export async function deleteFeedback(id: string) {
  try {
    await prisma.feedback.delete({ where: { id } });
    logger.info("deleteFeedback", "フィードバックを削除しました", { id });
    revalidatePath("/feedbacks");
  } catch (error) {
    logger.error("deleteFeedback", "フィードバックの削除に失敗しました", error, { id });
    throw new Error("フィードバックの削除に失敗しました");
  }
}

// ===== ReleaseNote Actions =====

export async function getReleaseNotes() {
  try {
    return await prisma.releaseNote.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    logger.error("getReleaseNotes", "リリースノートの取得に失敗しました", error);
    throw new Error("リリースノートの取得に失敗しました");
  }
}

export async function createReleaseNote(data: ReleaseNoteInput) {
  const validated = releaseNoteSchema.parse(data);
  try {
    const result = await prisma.releaseNote.create({ data: validated });
    logger.info("createReleaseNote", "リリースノートを作成しました", { id: result.id });
    revalidatePath("/releases");
    return result;
  } catch (error) {
    logger.error("createReleaseNote", "リリースノートの作成に失敗しました", error);
    throw new Error("リリースノートの作成に失敗しました");
  }
}

export async function updateReleaseNote(id: string, data: ReleaseNoteInput) {
  const validated = releaseNoteSchema.parse(data);
  try {
    const result = await prisma.releaseNote.update({ where: { id }, data: validated });
    logger.info("updateReleaseNote", "リリースノートを更新しました", { id });
    revalidatePath("/releases");
    return result;
  } catch (error) {
    logger.error("updateReleaseNote", "リリースノートの更新に失敗しました", error, { id });
    throw new Error("リリースノートの更新に失敗しました");
  }
}

export async function deleteReleaseNote(id: string) {
  try {
    await prisma.releaseNote.delete({ where: { id } });
    logger.info("deleteReleaseNote", "リリースノートを削除しました", { id });
    revalidatePath("/releases");
  } catch (error) {
    logger.error("deleteReleaseNote", "リリースノートの削除に失敗しました", error, { id });
    throw new Error("リリースノートの削除に失敗しました");
  }
}

// ===== Dashboard Stats =====

export async function getDashboardStats() {
  try {
    const [constraints, hypotheses, experiments, feedbacks] = await Promise.all([
      prisma.constraint.count(),
      prisma.hypothesis.groupBy({ by: ["status"], _count: true }),
      prisma.experiment.groupBy({ by: ["status"], _count: true }),
      prisma.feedback.groupBy({ by: ["learningType"], _count: true }),
    ]);

    return { constraints, hypotheses, experiments, feedbacks };
  } catch (error) {
    logger.error("getDashboardStats", "ダッシュボード統計の取得に失敗しました", error);
    throw new Error("ダッシュボード統計の取得に失敗しました");
  }
}
