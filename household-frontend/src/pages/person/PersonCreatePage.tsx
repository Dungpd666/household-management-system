import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const PersonCreatePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Ghi nhận nhân khẩu mới" subtitle="Nhập thông tin cá nhân chi tiết" />
      <Card header={<>Thông tin cá nhân</>} headerGradient>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-textc-secondary">Họ và tên</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" placeholder="VD: Nguyễn Văn A" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Giới tính</label>
            <select className="w-full border border-border rounded px-3 py-2 text-sm">
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Ngày sinh</label>
            <input type="date" className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">CMND/CCCD</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Tình trạng cư trú</label>
            <select className="w-full border border-border rounded px-3 py-2 text-sm">
              <option>Thường trú</option>
              <option>Tạm trú</option>
              <option>Đã chuyển đi</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Quan hệ với chủ hộ</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="green" size="md">Lưu nhân khẩu</Button>
        </div>
      </Card>
    </div>
  );
};
