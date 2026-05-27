import { useMemo, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

function buildReply(message, insights) {
  const lower = message.toLowerCase();
  if (lower.includes('prediction')) {
    return 'Based on the current form, favor teams with strong win percentage, venue familiarity, and top-order strike rate above 150.';
  }
  if (lower.includes('toss')) {
    return 'Toss impact is strongest when the chasing side has a historically better venue conversion rate.';
  }
  if (lower.includes('best player')) {
    return `The current top batting profile points to ${insights?.[0] || 'the leading run-scorer'}.`;
  }
  return insights?.[0] || 'Use batting average, strike rate, and venue conversion to identify winning trends.';
}

export default function InsightChat({ theme, insights = [] }) {
  const isDark = theme === 'dark';
  const shellClass = isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900';
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ask about toss impact, top scorers, prediction logic, or venue trends.' },
  ]);
  const [input, setInput] = useState('');

  const suggestionChips = useMemo(
    () => ['Who is in form?', 'How important is the toss?', 'Best venue for chasing?'],
    [],
  );

  const handleSend = () => {
    const message = input.trim();
    if (!message) return;
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: message },
      { role: 'assistant', text: buildReply(message, insights) },
    ]);
    setInput('');
  };

  return (
    <section className={`${shellClass} rounded-[28px] border p-5 shadow-soft`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">AI insights</p>
          <h3 className="mt-2 text-xl font-semibold">Cricket insights assistant</h3>
        </div>
        <MessageSquare className="h-5 w-5 text-cyan-300" />
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === 'user'
                ? 'ml-auto max-w-[85%] bg-cyan-400/15 text-cyan-100'
                : 'max-w-[90%] bg-white/5 text-slate-300'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestionChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setInput(chip)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSend();
            }
          }}
          placeholder="Ask a question about the league..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
