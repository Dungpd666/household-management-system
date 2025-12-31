import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { householdApi } from '../../api/householdApi';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/layout/PageHeader';
import { HouseholdLayout } from '../../components/layout/HouseholdLayout';

export const HouseholdChangePasswordPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await householdApi.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/household/dashboard');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Đổi mật khẩu thất bại';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HouseholdLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="Đổi mật khẩu"
          subtitle="Cập nhật mật khẩu mới cho tài khoản hộ gia đình của bạn"
        />

        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Thông tin mật khẩu</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                required
                minLength={6}
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-slate-700">
                  <p className="font-medium mb-1">Lưu ý bảo mật</p>
                  <p className="text-xs text-slate-600">
                    Mật khẩu phải có ít nhất 6 ký tự. Bạn sẽ cần dùng mật khẩu mới để đăng nhập lần sau.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-3">
              <Button
                type="button"
                variant="gray"
                size="md"
                onClick={() => navigate('/household/dashboard')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </HouseholdLayout>
  );
};
