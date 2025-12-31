import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { HouseholdAuthUser } from '../../api/authApi';

interface HouseholdHeaderProps {
  onMenuClick: () => void;
}

export const HouseholdHeader = ({ onMenuClick }: HouseholdHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const householdUser = user as HouseholdAuthUser;
  const displayName = householdUser?.householdCode || 'Hộ gia đình';

  return (
    <header className="sticky top-0 z-30 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 lg:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] py-1.5">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Title for mobile */}
          <h1 className="lg:hidden text-base font-semibold text-white">
            Hộ gia đình
          </h1>

          {/* Spacer for desktop */}
          <div className="hidden lg:block" />

          {/* User info and logout */}
          <div className="flex items-center gap-5 text-sm text-slate-200">
            <span className="font-medium">Xin chào, {displayName}</span>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/household-login');
              }}
              className="px-3 py-1.5 rounded-full border border-slate-500 text-xs font-medium text-slate-200 hover:border-red-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
