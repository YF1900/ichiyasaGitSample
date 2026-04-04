"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cpu,
  LayoutDashboard,
  Shield,
  Lightbulb,
  FlaskConical,
  BookOpen,
  Bot,
  Rocket,
} from "lucide-react";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/constraints", label: "制約", icon: Shield },
  { href: "/hypotheses", label: "仮説", icon: Lightbulb },
  { href: "/experiments", label: "実験", icon: FlaskConical },
  { href: "/feedbacks", label: "学習", icon: BookOpen },
  { href: "/ai-prompt", label: "AIプロンプト", icon: Bot },
  { href: "/releases", label: "リリース", icon: Rocket },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-zinc-900 text-zinc-100 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-800">
        <Cpu className="h-6 w-6 text-emerald-400" />
        <span className="text-lg font-bold tracking-tight">BaC OS</span>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
