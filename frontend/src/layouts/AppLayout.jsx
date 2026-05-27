import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mesh-background opacity-70" />
      <Sidebar theme={theme} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="relative lg:pl-80">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} onMenuToggle={() => setMobileOpen((current) => !current)} />
        <main className="px-4 pb-10 pt-4 lg:px-6">
          <Outlet context={{ theme, onToggleTheme }} />
        </main>
      </div>
    </div>
  );
}
