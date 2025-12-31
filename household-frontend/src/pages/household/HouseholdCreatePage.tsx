import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PillDropdown } from '../../components/ui/PillDropdown';
import { HouseholdCredentialsModal } from '../../components/household/HouseholdCredentialsModal';
import { householdApi } from '../../api/householdApi';
import { useToast } from '../../hooks/useToast';

export const HouseholdCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [householdCode, setHouseholdCode] = useState('');
  const [householdType, setHouseholdType] = useState('');
  const [address, setAddress] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<{
    householdCode: string;
    generatedPassword: string;
    address: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!householdCode.trim()) {
      toast.error('Vui lòng nhập mã hộ khẩu');
      return;
    }
    if (!householdType) {
      toast.error('Vui lòng chọn loại hộ');
      return;
    }
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ chi tiết');
      return;
    }

    setLoading(true);
    try {
      const response = await householdApi.create({
        householdCode: householdCode.trim(),
        householdType,
        address: address.trim(),
        ward: ward.trim(),
        district: district.trim(),
        city: city.trim(),
      });

      console.log('Full response:', response);
      console.log('response.data:', response.data);
      
      // Axios wraps the response body in response.data
      const data = response.data;
      
      // Check if generatedPassword exists
      if (!data) {
        toast.error('Phản hồi không hợp lệ từ server');
        return;
      }
      
      console.log('Checking for generatedPassword:', data.generatedPassword);

      // Backend trả về generatedPassword trong response
      if (data.generatedPassword) {
        console.log('Found generatedPassword, showing modal');
        setCredentials({
          householdCode: data.householdCode,
          generatedPassword: data.generatedPassword,
          address: data.address,
        });
        setShowCredentialsModal(true);
        toast.success('Tạo hộ khẩu thành công');
      } else {
        console.log('No generatedPassword found');
        toast.success('Tạo hộ khẩu thành công');
        navigate('/households');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tạo hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCredentials = () => {
    setShowCredentialsModal(false);
    navigate('/households');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Đăng ký hộ khẩu mới" subtitle="Nhập thông tin chi tiết của hộ khẩu" />
      <form onSubmit={handleSubmit}>
        <Card header={<>Thông tin chung</>} headerGradient>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">
                Mã hộ khẩu <span className="text-red-500">*</span>
              </label>
              <input
                value={householdCode}
                onChange={(e) => setHouseholdCode(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                placeholder="VD: HK123"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">
                Loại hộ <span className="text-red-500">*</span>
              </label>
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
              <label className="text-xs font-medium text-textc-secondary">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                placeholder="Số nhà, đường..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Phường/Xã</label>
              <input
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Quận/Huyện</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Thành phố</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="gray"
              size="md"
              onClick={() => navigate('/households')}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu hộ khẩu'}
            </Button>
          </div>
        </Card>
      </form>

      {credentials && (
        <HouseholdCredentialsModal
          isOpen={showCredentialsModal}
          onClose={handleCloseCredentials}
          householdCode={credentials.householdCode}
          generatedPassword={credentials.generatedPassword}
          address={credentials.address}
        />
      )}
    </div>
  );
};
