import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass-panel max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-cyan-300/80">404</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">The route you requested is not available. Return to the dashboard or open another analytics view.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Go home</Link>
          <Link to="/analytics" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10">Analytics</Link>
        </div>
      </div>
    </div>
  );
}
