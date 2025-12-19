import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PillDropdown } from '../../components/ui/PillDropdown';

export const HouseholdCreatePage = () => {
  const [householdType, setHouseholdType] = useState('');
  return (
    <div className="space-y-6">
      <PageHeader title="Đăng ký hộ khẩu mới" subtitle="Nhập thông tin chi tiết của hộ khẩu" />
      <Card header={<>Thông tin chung</>} headerGradient>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Mã hộ khẩu</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" placeholder="VD: HK123" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Loại hộ</label>
            <PillDropdown
              value={householdType}
              onChange={setHouseholdType}
              placeholder="Chọn loại hộ"
              options={[
                { value: 'Thường trú', label: 'Thường trú' },
                { value: 'Tạm trú', label: 'Tạm trú' },
                { value: 'Tạm vắng', label: 'Tạm vắng' },
                { value: 'Tập thể', label: 'Tập thể' },
                { value: 'Khác', label: 'Khác' },
              ]}
              buttonClassName="w-full flex items-center justify-between gap-2 border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-textc-secondary">Địa chỉ chi tiết</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" placeholder="Số nhà, đường..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Phường/Xã</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Quận/Huyện</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Thành phố</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="green" size="md">Lưu hộ khẩu</Button>
        </div>
      </Card>
    </div>
  );
};
