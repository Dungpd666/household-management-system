import { NavLink } from 'react-router-dom';

interface HouseholdSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItemClass = ({ isActive }: { isActive?: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium select-none transition-colors ${
    isActive
      ? 'bg-white/10 text-white shadow-sm'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`;

export const HouseholdSidebar = ({ isOpen, onClose }: HouseholdSidebarProps) => {
  const navItems = [
    {
      path: '/household/dashboard',
      label: 'Trang chủ',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/>
        </svg>
      )
    },
    {
      path: '/household/payment',
      label: 'Đóng góp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      path: '/household/change-password',
      label: 'Đổi mật khẩu',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1a5 5 0 00-5 5v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm0 2a3 3 0 013 3v2H9V6a3 3 0 013-3z"/>
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                HK
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">Hộ gia đình</div>
                <div className="text-[11px] tracking-wide opacity-70 uppercase">Portal</div>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => navItemClass({ isActive })}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="px-4 pb-4 pt-3 border-t border-white/10">
            <div className="rounded-xl p-3 hover:bg-white/5 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Cần hỗ trợ?</p>
                  <p className="text-xs text-white/70">Liên hệ quản trị viên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
