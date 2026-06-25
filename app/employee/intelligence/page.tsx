"use client";

import Link from "next/link";
import { useMemo } from "react";
import { generateCaseBrief, generateTeamInsights } from "@/lib/ai";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/hooks/useAppData";

export default function IntelligencePage() {
  const { data, ready } = useAppData();

  const urgent = useMemo(
    () => data?.applicants.filter((a) => a.priority === "urgent" || a.status === "additional_info") ?? [],
    [data]
  );

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  const insights = generateTeamInsights(data);

  return (
    <>
      <PageHeader
        title="AI intelligence"
        subtitle="Automated risk detection, case briefs, and team recommendations"
      />
      <PageBody>
        <div className="ai-panel card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg" style={{ color: "var(--gold)" }}>✦</span>
            <h2 className="font-serif text-xl" style={{ color: "var(--navy)" }}>Morning briefing</h2>
          </div>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {insights.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <h2 className="font-serif text-xl mb-4">High-attention cases</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {urgent.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <Link href={`/employee/cases/${a.id}`} className="font-semibold hover:underline" style={{ color: "var(--navy)" }}>
                  {a.firstName} {a.lastName}
                </Link>
                <div className="flex gap-2">
                  <PriorityBadge priority={a.priority} />
                  <StatusBadge status={a.status} />
                </div>
              </div>
              <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {generateCaseBrief(a, data)}
              </pre>
            </div>
          ))}
        </div>

        <p className="text-xs mt-8 text-center" style={{ color: "var(--text-muted)" }}>
          AI features shown are rule-based demos. Connect OpenAI / Anthropic API for live summarisation, document extraction, and natural-language case queries.
        </p>
      </PageBody>
    </>
  );
}
