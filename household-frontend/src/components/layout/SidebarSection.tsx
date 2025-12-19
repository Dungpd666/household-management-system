import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface SubItem {
  label: string;
  to: string;
}

interface SidebarSectionProps {
  icon: React.ReactNode;
  label: string;
  subItems: SubItem[];
}

export const SidebarSection = ({ icon, label, subItems }: SidebarSectionProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-transparent transition-colors ${
          open ? 'bg-white/10 text-white shadow-sm' : 'text-white/70'
        } hover:bg-white/10 hover:text-white`}
      >
        <span className="flex items-center gap-2">{icon}{label}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-64 mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pl-2 flex flex-col gap-1">
          {subItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm transition-colors border-l-2 ${
                  isActive
                    ? 'bg-white/10 text-white border-white/20 shadow-sm'
                    : 'text-white/70 border-transparent'
                } hover:bg-white/10 hover:text-white`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
