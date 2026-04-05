export const dynamic = "force-dynamic";

import { ShieldFill, LightbulbFill, Flask, BookFill } from "react-bootstrap-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions";

async function getStats() {
  try {
    const stats = await getDashboardStats();
    return {
      constraints: stats.constraints,
      hypotheses: stats.hypotheses.reduce(
        (sum: number, g: { _count: number }) => sum + g._count,
        0
      ),
      experiments: stats.experiments.reduce(
        (sum: number, g: { _count: number }) => sum + g._count,
        0
      ),
      feedbacks: stats.feedbacks.reduce(
        (sum: number, g: { _count: number }) => sum + g._count,
        0
      ),
    };
  } catch {
    return { constraints: 0, hypotheses: 0, experiments: 0, feedbacks: 0 };
  }
}

const statCards = [
  {
    key: "constraints" as const,
    label: "制約",
    icon: ShieldFill,
    color: "#ef4444",
    bg: "#fde8e8",
    desc: "ビジネス上の制約",
  },
  {
    key: "hypotheses" as const,
    label: "仮説",
    icon: LightbulbFill,
    color: "#f59e0b",
    bg: "#fff3cd",
    desc: "検証すべき仮説",
  },
  {
    key: "experiments" as const,
    label: "実験",
    icon: Flask,
    color: "#4361ee",
    bg: "#e8ecff",
    desc: "実行中・完了した実験",
  },
  {
    key: "feedbacks" as const,
    label: "学習",
    icon: BookFill,
    color: "#10b981",
    bg: "#d8f3dc",
    desc: "蓄積された学習",
  },
];

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          BaC OS ダッシュボード
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
          Business = f(C, L, A, E) &mdash; 制約・仮説・実験・学習のサイクルで学習速度を最大化する
        </p>
      </div>

      {/* Stat Cards */}
      <section aria-label="統計情報">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon, color, bg, desc }) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </CardTitle>
                <div
                  className="rounded-lg p-2"
                  style={{ background: bg }}
                  aria-hidden="true"
                >
                  <Icon size={18} style={{ color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold tabular-nums"
                  style={{ color: "var(--text-primary)" }}
                  aria-label={`${label}: ${stats[key]}件`}
                >
                  {stats[key]}
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* BaC Cycle */}
      <section aria-label="BaCサイクル">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          BaC サイクル
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { label: "制約", sub: "Constraint", color: "#ef4444", bg: "#fde8e8" },
                { label: "→", sub: "", color: "#adb5bd", bg: "transparent" },
                { label: "仮説", sub: "Hypothesis", color: "#f59e0b", bg: "#fff3cd" },
                { label: "→", sub: "", color: "#adb5bd", bg: "transparent" },
                { label: "実験", sub: "Experiment", color: "#4361ee", bg: "#e8ecff" },
                { label: "→", sub: "", color: "#adb5bd", bg: "transparent" },
                { label: "学習", sub: "Feedback", color: "#10b981", bg: "#d8f3dc" },
                { label: "→", sub: "", color: "#adb5bd", bg: "transparent" },
                { label: "改善", sub: "Improve β", color: "#8b5cf6", bg: "#ede9fe" },
              ].map((item, i) =>
                item.sub === "" ? (
                  <span key={i} className="text-2xl font-light" style={{ color: item.color }}>
                    {item.label}
                  </span>
                ) : (
                  <div
                    key={i}
                    className="flex flex-col items-center px-4 py-3 rounded-xl"
                    style={{ background: item.bg }}
                  >
                    <span className="text-sm font-bold" style={{ color: item.color }}>
                      {item.label}
                    </span>
                    <span className="text-xs mt-0.5" style={{ color: item.color, opacity: 0.7 }}>
                      {item.sub}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Learning Velocity */}
      <section aria-label="学習速度">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          学習速度（β）
        </h2>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              データが蓄積されると学習速度グラフが表示されます
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
