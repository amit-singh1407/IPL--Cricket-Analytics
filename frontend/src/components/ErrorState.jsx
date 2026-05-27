import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', message = 'We could not load the latest cricket analytics data.', onRetry }) {
  return (
    <div className="glass-panel rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-rose-400/15 p-3 text-rose-200">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">{message}</p>
          </div>
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
