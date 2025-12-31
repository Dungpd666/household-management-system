import { NavLink } from 'react-router-dom';

export const HouseholdNavbar = () => {
  const navItems = [
    { path: '/household/dashboard', label: 'Trang chủ' },
    { path: '/household/payment', label: 'Đóng góp' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
