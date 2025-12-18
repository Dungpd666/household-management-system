import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const LoginPage = () => {
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    // Nếu đã đăng nhập thì đẩy về dashboard
    navigate('/households');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ username, password });
      navigate('/households');
    } catch {
      // error đã được context xử lý
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="w-full max-w-md shadow-deep" padding>
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary text-white font-semibold mb-3">
            VN
          </div>
          <h1 className="text-xl font-semibold text-textc-primary">Đăng nhập hệ thống</h1>
          <p className="text-xs text-textc-faint mt-1">Sử dụng tài khoản được cấp để truy cập bảng điều khiển.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-textc-secondary">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
              placeholder="Nhập username"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-textc-secondary">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </div>
          )}
          <Button type="submit" variant="gray" full disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
