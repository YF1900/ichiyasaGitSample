"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid1x2Fill,
  ShieldFill,
  LightbulbFill,
  Flask,
  BookFill,
  Robot,
  RocketFill,
  CpuFill,
} from "react-bootstrap-icons";

const navItems = [
  { href: "/",            label: "ダッシュボード", icon: Grid1x2Fill },
  { href: "/constraints", label: "制約",           icon: ShieldFill },
  { href: "/hypotheses",  label: "仮説",           icon: LightbulbFill },
  { href: "/experiments", label: "実験",           icon: Flask },
  { href: "/feedbacks",   label: "学習",           icon: BookFill },
  { href: "/ai-prompt",   label: "AIプロンプト",   icon: Robot },
  { href: "/releases",    label: "リリース",        icon: RocketFill },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="メインナビゲーション"
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <CpuFill size={24} style={{ color: "#4361ee" }} aria-hidden="true" />
        <div>
          <p className="text-white font-bold text-base leading-tight">BaC OS</p>
          <p className="text-xs leading-tight" style={{ color: "#a0aec0" }}>
            Business as Code
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <ul className="flex-1 px-3 py-4 space-y-1 list-none" role="list">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                style={{
                  color: isActive ? "#ffffff" : "#a0aec0",
                  background: isActive ? "#4361ee" : "transparent",
                }}
              >
                <Icon size={17} aria-hidden="true" className="flex-shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t border-white/10 text-xs"
        style={{ color: "#718096" }}
        aria-hidden="true"
      >
        Business = f(C, L, A, E)
      </div>
    </nav>
  );
}
