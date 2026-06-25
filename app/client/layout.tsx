"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getData, getSession } from "@/lib/store";

const NAV = [
  { href: "/client", label: "Dashboard" },
  { href: "/client/cases", label: "My cases" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "client") {
      router.replace("/");
      return;
    }
    const data = getData();
    const name = data.clients.find((c) => c.id === s.clientId)?.name ?? "Client";
    setClientName(name);
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <AppShell role="client" clientName={clientName} nav={NAV}>
      {children}
    </AppShell>
  );
}
