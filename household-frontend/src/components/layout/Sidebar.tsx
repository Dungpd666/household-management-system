import { NavLink, useNavigate } from 'react-router-dom';
import { SidebarSection } from './SidebarSection';
import { useAuth } from '../../hooks/useAuth';

// Navy sidebar styling: subtle translucent active pill, white text
const navItemClass = ({ isActive }: { isActive?: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium select-none transition-colors ${
    isActive
      ? 'bg-white/10 text-white shadow-sm'
      : 'text-white/70'
  } hover:bg-white/10 hover:text-white`;

const Icon = ({ name }: { name: 'home' | 'household' | 'person' | 'donate' | 'users' }) => {
  const base = 'w-5 h-5';
  switch (name) {
    case 'home':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/></svg>
      );
    case 'household':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M4 10l8-6 8 6v8a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2v-8z"/></svg>
      );
    case 'person':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5.33 0-8 2.67-8 6v2h16v-2c0-3.33-2.67-6-8-6z"/></svg>
      );
    case 'donate':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.49 4.49 0 0 1 6.5 4 4.93 4.93 0 0 1 12 6.09 4.93 4.93 0 0 1 17.5 4 4.49 4.49 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
      );
    case 'users':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-3.33 0-6 1.67-6 5v2h8v-2c0-2.21.9-3.67 2.33-4.58A10.44 10.44 0 0 0 8 13zm8 1c-3.87 0-6 2.13-6 5v2h12v-2c0-2.87-2.13-5-6-5z"/></svg>
      );
  }
};

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.userName || 'Admin';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = user?.userRole || 'admin';

  return (
    <aside className="w-full h-full flex flex-col bg-transparent text-white">
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-lg shadow-sm">HK</div>
        <div className="">
          <div className="text-sm font-semibold leading-tight">Quản lý Hộ khẩu</div>
          <div className="text-[11px] tracking-wide opacity-70 uppercase">Hệ thống</div>
        </div>
      </div>
      <nav className="px-4 py-2 overflow-y-auto">
        <NavLink to="/" className={({ isActive }) => navItemClass({ isActive })} end>
          <Icon name="home" /> <span>Tổng quan</span>
        </NavLink>
        <div className="mt-4 mb-2 text-[11px] font-semibold opacity-60 text-white/60 uppercase">Quản lý</div>
        <SidebarSection
          icon={<Icon name="household" />}
          label="Hộ khẩu"
          subItems={[
            { label: 'Danh sách hộ khẩu', to: '/households' },
            { label: 'Đăng ký mới', to: '/households/new' },
          ]}
        />
        <SidebarSection
          icon={<Icon name="person" />}
          label="Nhân khẩu"
          subItems={[
            { label: 'Danh sách nhân khẩu', to: '/persons' },
            { label: 'Ghi nhận mới', to: '/persons/new' },
          ]}
        />
        <NavLink to="/contributions" className={({ isActive }) => navItemClass({ isActive })}>
          <Icon name="donate" /> <span>Đóng góp</span>
        </NavLink>
        <NavLink to="/population-events" className={({ isActive }) => navItemClass({ isActive })}>
          <Icon name="person" /> <span>Sự kiện dân số</span>
        </NavLink>
        
        <div className="mt-4 mb-2 text-[11px] font-semibold opacity-60 text-white/60 uppercase">Hệ thống</div>
        {(user?.userRole === 'superadmin' || user?.userRole === 'admin') && (
          <NavLink to="/roles" className={({ isActive }) => navItemClass({ isActive })}>
            <Icon name="users" /> <span>Phân quyền</span>
          </NavLink>
        )}
      </nav>

      {/* User info ngay dưới các chức năng */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => navigate('/me')}
          className="w-full flex items-center gap-3 text-left rounded-xl px-2 py-2 hover:bg-white/5 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white truncate max-w-[140px]">{displayName}</span>
            <span className="text-[11px] uppercase tracking-wide py-0.5 rounded-full bg-white/10 text-white/80 w-fit mt-0.5 pr-1.5 pl-0">
              {roleLabel}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
