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

function navLabel(label: string) {
  const short: Record<string, string> = {
    Overview: "Home",
    Dashboard: "Home",
    "All cases": "Cases",
    "My cases": "Cases",
    "Reports & alerts": "Reports",
    "AI intelligence": "AI",
  };
  return short[label] ?? label.split(" ")[0];
}

export default function AppShell({
  role,
  clientName,
  nav,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== `/${role}` && pathname.startsWith(href));

  return (
    <div className="flex min-h-screen max-lg:flex-col">
      {/* Desktop sidebar — unchanged at lg+ */}
      <aside
        className="hidden lg:flex w-[260px] shrink-0 border-r flex-col sticky top-0 h-screen"
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
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium transition"
              style={{
                background: isActive(item.href) ? "var(--navy)" : "transparent",
                color: isActive(item.href) ? "white" : "var(--text-muted)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

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

      {/* Mobile top bar — only below lg */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <div className="font-serif text-lg leading-tight" style={{ color: "var(--navy)" }}>
            Rialu ImmiTrack
          </div>
          <p className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
            {role === "employee" ? "Immigration team" : clientName ?? "Client"}
          </p>
        </div>
        <button
          onClick={() => {
            clearSession();
            router.push("/");
          }}
          className="btn btn-ghost text-xs shrink-0"
        >
          Exit
        </button>
      </header>

      <div className="flex-1 flex flex-col min-w-0 max-lg:pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {children}
      </div>

      {/* Mobile bottom nav — only below lg */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label="Main navigation"
      >
        <div className="flex items-stretch justify-around">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 min-h-[3.25rem] text-center transition"
              style={{
                color: isActive(item.href) ? "var(--navy)" : "var(--text-muted)",
                background: isActive(item.href) ? "#EEF2F7" : "transparent",
              }}
            >
              <span className="text-[0.65rem] font-semibold leading-tight">
                {navLabel(item.label)}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
