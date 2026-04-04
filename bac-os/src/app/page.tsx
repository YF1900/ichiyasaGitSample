export const dynamic = "force-dynamic";

import { Shield, Lightbulb, FlaskConical, BookOpen } from "lucide-react";
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
  { key: "constraints" as const, label: "制約", icon: Shield, color: "text-rose-500" },
  { key: "hypotheses" as const, label: "仮説", icon: Lightbulb, color: "text-amber-500" },
  { key: "experiments" as const, label: "実験", icon: FlaskConical, color: "text-blue-500" },
  { key: "feedbacks" as const, label: "学習", icon: BookOpen, color: "text-emerald-500" },
];

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          BaC OS ダッシュボード
        </h1>
        <p className="mt-1 text-zinc-500">
          Business = f(C, L, A, E) &mdash; 制約・学習・行動・実験から事業を駆動する
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                {label}
              </CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats[key]}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">学習速度（&beta;）</h2>
        <Card>
          <CardContent className="flex items-center justify-center h-64 text-zinc-400">
            Recharts グラフ（近日実装予定）
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
