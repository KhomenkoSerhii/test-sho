export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-paper-raised">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg text-ink">Terra Studio</p>
        <p className="font-mono text-xs uppercase tracking-widest">
          Речі для дому, зроблені повільно · {new Date().getFullYear() || "2026"}
        </p>
      </div>
    </footer>
  );
}
