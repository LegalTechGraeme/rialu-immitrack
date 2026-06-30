function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header
      className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 border-b px-4 py-4 lg:px-10 lg:py-6"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="min-w-0">
        <h1 className="font-serif text-xl lg:text-[1.75rem] leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}

export default function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="p-4 lg:p-10">{children}</div>;
}

export { PageHeader };
