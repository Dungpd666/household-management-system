export const Header = () => {
  return (
    <div className="flex items-center justify-between min-h-[80px] py-3">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center font-bold text-white text-base shadow-sm">VN</div>
        <div className="flex flex-col justify-center">
          <span className="text-[11px] tracking-wide text-textc-faint uppercase">Hệ thống</span>
          <h1 className="text-xl font-semibold text-textc-primary leading-tight">Quản lý Dân cư</h1>
        </div>
      </div>
      <div className="flex items-center gap-5 text-sm text-textc-secondary">
        <span className="font-medium">Xin chào, Quản trị</span>
        <div className="w-10 h-10 rounded-full bg-slate-200 shadow-inner" />
      </div>
    </div>
  );
};
