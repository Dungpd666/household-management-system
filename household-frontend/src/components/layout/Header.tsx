import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import bkLogo from '../../assets/logo2.jpg';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const displayName = isAuthenticated ? user?.userName || 'Người dùng' : 'Khách';

  const searchItems = [
    { label: 'Tổng quan', path: '/', keywords: ['tong quan', 'dashboard', 'home', 'trang chu'] },
    { label: 'Danh sách hộ khẩu', path: '/households', keywords: ['ho khau', 'ho gia dinh', 'household'] },
    { label: 'Đăng ký hộ khẩu mới', path: '/households/new', keywords: ['dang ky ho khau', 'them ho khau', 'tao ho khau'] },
    { label: 'Danh sách nhân khẩu', path: '/persons', keywords: ['nhan khau', 'nguoi dan', 'cong dan', 'person'] },
    { label: 'Ghi nhận nhân khẩu mới', path: '/persons/new', keywords: ['them nhan khau', 'dang ky nhan khau', 'tao nhan khau'] },
    { label: 'Đóng góp', path: '/contributions', keywords: ['dong gop', 'thu phi', 'quy', 'contribution'] },
    { label: 'Người dùng', path: '/users', keywords: ['nguoi dung', 'tai khoan', 'user', 'quan tri'] },
    { label: 'Trang cá nhân', path: '/me', keywords: ['trang ca nhan', 'profile', 'tai khoan cua toi', 'me'] },
  ];

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ') // gộp nhiều khoảng trắng
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
    : searchItems.slice(0, 5);

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
                // delay để cho phép click vào suggestion
                setTimeout(() => setIsFocused(false), 120);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchNavigate();
                }
              }}
              placeholder="Tìm nhanh chức năng: hộ khẩu, nhân khẩu, đóng góp..."
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
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-slate-300 bg-white/80 shadow-inner flex items-center justify-center text-slate-600 hover:border-brand-purple/60 hover:text-brand-purple hover:shadow-md transition cursor-pointer"
          aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        >
          {theme === 'dark' ? (
            // Icon mặt trời khi ở dark mode
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            // Icon mặt trăng khi ở light mode
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
            </svg>
          )}
        </button>
        <span className="font-medium">Xin chào, {displayName}</span>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/me')}
              className="w-10 h-10 rounded-full bg-slate-200 shadow-inner border border-slate-300 hover:border-brand-purple/60 hover:shadow-md transition"
            />
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3 py-1.5 rounded-full border border-slate-300 text-xs font-medium text-textc-secondary hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-medium shadow-sm hover:bg-brand-primary/90 hover:shadow-md transition"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
};
