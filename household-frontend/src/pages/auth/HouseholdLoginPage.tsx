import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import bkLogo from '../../assets/logo2.jpg';

export const HouseholdLoginPage = () => {
  const { householdLogin, loading, error, clearError, isAuthenticated, isHouseholdUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [householdCode, setHouseholdCode] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    clearError();
  }, [error, toast, clearError]);

  if (isAuthenticated && isHouseholdUser()) {
    // Nếu đã đăng nhập bằng tài khoản hộ gia đình thì đẩy về household dashboard
    navigate('/household/dashboard');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await householdLogin({ householdCode, password });
      navigate('/household/dashboard');
    } catch {
      // error đã được context xử lý
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-sm border border-slate-200" padding>
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Đăng nhập Hộ gia đình
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Nhập mã hộ khẩu và mật khẩu của bạn
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mã hộ khẩu</label>
            <input
              type="text"
              value={householdCode}
              onChange={(e) => setHouseholdCode(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition bg-white"
              placeholder="VD: HO001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition bg-white"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline font-medium transition"
          >
            Đăng nhập quản trị viên
          </Link>
        </div>
      </Card>
    </div>
  );
};
