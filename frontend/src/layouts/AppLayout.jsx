import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === 'dark';
  const buttonStyle = isDark
    ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mesh-background opacity-70" />
      <Sidebar theme={theme} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="relative lg:pl-80">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} onMenuToggle={() => setMobileOpen((current) => !current)} />
        <main className="px-4 pb-10 pt-4 lg:px-6">
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className={`mb-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${buttonStyle}`}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <Outlet context={{ theme, onToggleTheme }} />
        </main>
      </div>
    </div>
  );
}
