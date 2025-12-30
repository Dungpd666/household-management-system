import bkLogo from '../../assets/logo2.jpg';

export const Footer = () => {
  const year = new Date().getFullYear();
  const chipClass =
    'px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 shadow-inner text-xs text-textc-secondary';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1.5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 md:h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
          <img src={bkLogo} alt="Logo" className="h-full w-auto object-contain" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-textc-primary leading-tight truncate">
            Hệ thống quản lý hộ gia đình
          </div>
          <div className="text-xs text-textc-secondary truncate">Demo • © {year}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={chipClass}>Địa chỉ: 123 Đường Demo, Quận Demo</span>
        <span className={chipClass}>Hotline: 0900 000 000</span>
        <span className={chipClass}>Email: demo@household.local</span>
        <span className={`${chipClass} opacity-70`}>Phiên bản: v0.0-demo</span>
      </div>
    </div>
  );
};