import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-transparent">
      <div className="px-6 py-4 flex justify-end items-center gap-4">
        <input
          className="hidden md:block w-72 text-[13px] bg-white/60 border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
          placeholder="Tìm kiếm nhanh..."
        />
        <div className="w-9 h-9 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-semibold shadow-card">
          CB
        </div>
      </div>
    </nav>
  );
};
