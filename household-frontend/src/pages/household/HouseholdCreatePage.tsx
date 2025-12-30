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
            <input className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50" placeholder="VD: HK123" />
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
                { value: 'Đã chuyển đi', label: 'Đã chuyển đi' },
              ]}
              buttonClassName="w-full h-10 flex items-center justify-between gap-2 border border-slate-200 rounded-full px-4 text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 cursor-pointer"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-textc-secondary">Địa chỉ chi tiết</label>
            <input className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50" placeholder="Số nhà, đường..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Phường/Xã</label>
            <input className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Quận/Huyện</label>
            <input className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">Thành phố</label>
            <input className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="green" size="md">Lưu hộ khẩu</Button>
        </div>
      </Card>
    </div>
  );
};
