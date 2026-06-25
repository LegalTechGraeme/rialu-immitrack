"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { clearSession } from "@/lib/store";

interface NavItem {
  href: string;
  label: string;
}

interface AppShellProps {
  role: Role;
  clientName?: string;
  nav: NavItem[];
  children: React.ReactNode;
  stats?: { label: string; value: string | number }[];
}

export default function AppShell({
  role,
  clientName,
  nav,
  children,
  stats,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <aside
        className="w-[260px] shrink-0 border-r flex flex-col sticky top-0 h-screen"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="font-serif text-[1.35rem] leading-tight" style={{ color: "var(--navy)" }}>
            Rialu ImmiTrack
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {role === "employee" ? "Immigration team portal" : clientName ?? "Client portal"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== `/${role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium transition"
                style={{
                  background: active ? "var(--navy)" : "transparent",
                  color: active ? "white" : "var(--text-muted)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {stats && stats.length > 0 && (
          <div className="p-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
            {stats.map((s) => (
              <div key={s.label} className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>{s.label}</span>
                <span className="font-semibold" style={{ color: "var(--navy)" }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => {
              clearSession();
              router.push("/");
            }}
            className="btn btn-ghost w-full text-xs"
          >
            Exit demo
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
