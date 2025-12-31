import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { HouseholdAuthUser } from '../../api/authApi';

// Navy sidebar styling: white text, subtle active state
const navItemClass = ({ isActive }: { isActive?: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium select-none transition-colors ${
    isActive
      ? 'bg-white/10 text-white shadow-sm'
      : 'text-white/70'
  } hover:bg-white/10 hover:text-white`;

const Icon = ({ name }: { name: 'home' | 'payment' | 'password' }) => {
  const base = 'w-5 h-5';
  switch (name) {
    case 'home':
      return (
        <svg className={base} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/>
        </svg>
      );
    case 'payment':
      return (
        <svg className={base} fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'password':
      return (
        <svg className={base} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1a5 5 0 00-5 5v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm0 2a3 3 0 013 3v2H9V6a3 3 0 013-3z"/>
        </svg>
      );
  }
};

export const HouseholdSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const householdUser = user as HouseholdAuthUser;
  const displayName = householdUser?.householdCode || 'Thành viên';
  const initials = displayName
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { path: '/household/dashboard', label: 'Trang chủ', icon: 'home' as const },
    { path: '/household/payment', label: 'Đóng góp', icon: 'payment' as const },
    { path: '/household/change-password', label: 'Đổi mật khẩu', icon: 'password' as const },
  ];

  return (
    <aside className="w-full h-full flex flex-col bg-transparent text-white">
      {/* Logo/Brand */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-lg shadow-sm">
          HK
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">Hộ gia đình</div>
          <div className="text-[11px] tracking-wide opacity-70 uppercase">Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-2 overflow-y-auto flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => navItemClass({ isActive })}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom with border-top */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => navigate('/household/dashboard')}
          className="w-full flex items-center gap-3 text-left rounded-xl px-2 py-2 hover:bg-white/5 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white truncate max-w-[140px]">{displayName}</span>
            <span className="text-[11px] uppercase tracking-wide py-0.5 rounded-full bg-white/10 text-white/80 w-fit mt-0.5 pr-1.5 pl-0">
              HỘ KHẨU
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
