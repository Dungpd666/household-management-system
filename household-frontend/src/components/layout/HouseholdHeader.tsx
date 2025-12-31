import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import bkLogo from '../../assets/logo2.jpg';
import type { HouseholdAuthUser } from '../../api/authApi';

export const HouseholdHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const householdUser = user as HouseholdAuthUser;
  const displayName = householdUser?.householdCode || 'Hộ gia đình';

  const searchItems = [
    { label: 'Trang chủ', path: '/household/dashboard', keywords: ['trang chu', 'dashboard', 'home', 'tong quan'] },
    { label: 'Đóng góp', path: '/household/payment', keywords: ['dong gop', 'thanh toan', 'payment', 'contribution'] },
    { label: 'Đổi mật khẩu', path: '/household/change-password', keywords: ['doi mat khau', 'password', 'change password', 'mat khau'] },
  ];

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

  const handleSearchNavigate = () => {
    const q = normalize(query);
    if (!q) return;

    const match =
      searchItems.find((item) => {
        const base = normalize(item.label + ' ' + item.keywords.join(' '));
        return base.includes(q);
      }) || searchItems[0];

    navigate(match.path);
    setQuery('');
    setIsFocused(false);
  };

  const qNormalized = normalize(query);
  const suggestions = qNormalized
    ? searchItems.filter((item) => {
        const base = normalize(item.label + ' ' + item.keywords.join(' '));
        return base.includes(qNormalized);
      })
    : searchItems.slice(0, 3);

  return (
    <div className="flex items-center justify-between min-h-[64px] py-1.5">
      <div className="flex items-center gap-5 md:gap-6 flex-1">
        <div className="h-10 md:h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
          <img src={bkLogo} alt="Logo" className="h-full w-auto object-contain" />
        </div>
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 120);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchNavigate();
                }
              }}
              placeholder="Tìm nhanh: đóng góp, đổi mật khẩu..."
              className="w-full pl-9 pr-3 py-2 rounded-full border border-slate-200 bg-white/80 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 placeholder:text-slate-400"
            />
            {isFocused && suggestions.length > 0 && (
              <div className="absolute z-20 mt-1 left-0 right-0 rounded-2xl bg-white shadow-lg shadow-slate-200 border border-slate-100 overflow-hidden text-sm">
                {suggestions.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className="w-full flex flex-col items-start px-3 py-2 hover:bg-slate-50 text-left cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setQuery('');
                      setIsFocused(false);
                    }}
                  >
                    <span className="text-[13px] font-medium text-slate-900">{item.label}</span>
                    <span className="mt-0.5 text-[11px] text-slate-400 truncate max-w-full">
                      {item.keywords.slice(0, 3).join(' · ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5 text-sm text-textc-secondary">
        <span className="font-medium">Xin chào, {displayName}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/household/dashboard')}
            className="w-10 h-10 rounded-full bg-slate-200 shadow-inner border border-slate-300 hover:border-brand-purple/60 hover:shadow-md transition"
          />
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/household-login');
            }}
            className="px-3 py-1.5 rounded-full border border-slate-300 text-xs font-medium text-textc-secondary hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};
