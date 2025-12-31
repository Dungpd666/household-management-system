import { ReactNode } from 'react';
import { HouseholdHeader } from './HouseholdHeader';
import { HouseholdSidebar } from './HouseholdSidebar';
import { Footer } from './Footer';
import { Card } from '../ui/Card';

interface HouseholdLayoutProps {
  children: ReactNode;
}

export const HouseholdLayout = ({ children }: HouseholdLayoutProps) => {
  return (
    <div className="min-h-screen app-shell flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Sidebar: full height, fixed width, dark theme */}
      <div className="hidden md:block w-60 xl:w-64 bg-slate-950 text-white">
        <HouseholdSidebar />
      </div>

      {/* Main content column: header + content + footer */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Header card */}
        <div className="mt-0.5">
          <Card padding={true}>
            <HouseholdHeader />
          </Card>
        </div>

        {/* Content card */}
        <Card className="flex-1" padding={false}>
          <main className="p-6">
            {children}
          </main>
        </Card>

        {/* Footer card */}
        <div className="mb-0.5">
          <Card padding={true}>
            <Footer />
          </Card>
        </div>
      </div>
    </div>
  );
};
