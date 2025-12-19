import { useState, ChangeEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const displayName = user?.userName || 'Tài khoản hiện tại';
  const roleLabel =
    user?.userRole === 'superadmin'
      ? 'SUPERADMIN'
      : user?.userRole === 'admin'
        ? 'ADMIN'
        : user?.userRole === 'user'
          ? 'USER'
          : 'CHƯA PHÂN QUYỀN';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tùy chỉnh trang cá nhân</h1>
        <p className="mt-1 text-sm text-slate-500">
          Trang này mới chỉ là giao diện mẫu để mô phỏng việc cập nhật thông tin cá nhân.
        </p>
      </div>

      <Card padding className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Ảnh đại diện</h2>
          <p className="mt-1 text-xs text-slate-500">
            Chọn ảnh đại diện từ máy tính của bạn. Hiện tại chỉ hiển thị xem thử, chưa lưu về server.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600 overflow-hidden">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <label className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-medium cursor-pointer hover:bg-slate-800 transition">
              <span>Chọn ảnh mới</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <div className="text-xs text-slate-500">
              Gợi ý: sử dụng ảnh vuông, kích thước tối thiểu 200x200px.
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              alert('Hiện tại mới là trang giả, chưa nối với backend. Khi backend sẵn sàng, nút này sẽ gọi API cập nhật hồ sơ.');
            }}
          >
            Lưu thay đổi (demo)
          </Button>
        </div>
      </Card>

      <Card padding className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Thông tin tài khoản</h2>
          <p className="mt-1 text-xs text-slate-500">
            Các thông tin dưới đây lấy từ tài khoản hiện tại, chỉ để xem. Hoàn thiện backend sẽ cho phép cập nhật trực tiếp tại đây.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Họ tên / Tên hiển thị</div>
            <div className="font-medium text-slate-900">{displayName}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Quyền</div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] tracking-wide uppercase">
              {roleLabel}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Tên đăng nhập</div>
            <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
              {user?.userName || '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">ID nội bộ</div>
            <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
              {user?.userID ?? '—'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
