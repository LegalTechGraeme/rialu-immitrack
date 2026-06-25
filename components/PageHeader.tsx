function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header
      className="flex flex-wrap items-center justify-between gap-4 border-b px-10 py-6"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div>
        <h1 className="font-serif text-[1.75rem]">{title}</h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
        )}
      </div>
      {actions}
    </header>
  );
}

export default function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="p-10">{children}</div>;
}

export { PageHeader };
