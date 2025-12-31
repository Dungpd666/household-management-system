import { ReactNode, useState } from 'react';
import { HouseholdHeader } from './HouseholdHeader';
import { HouseholdSidebar } from './HouseholdSidebar';

interface HouseholdLayoutProps {
  children: ReactNode;
}

export const HouseholdLayout = ({ children }: HouseholdLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <HouseholdHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <HouseholdSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:pl-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
