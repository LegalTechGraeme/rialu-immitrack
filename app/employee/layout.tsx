"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getSession } from "@/lib/store";

const NAV = [
  { href: "/employee", label: "Overview" },
  { href: "/employee/cases", label: "All cases" },
  { href: "/employee/reports", label: "Reports & alerts" },
  { href: "/employee/intelligence", label: "AI intelligence" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "employee") router.replace("/");
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <AppShell role="employee" nav={NAV}>
      {children}
    </AppShell>
  );
}
