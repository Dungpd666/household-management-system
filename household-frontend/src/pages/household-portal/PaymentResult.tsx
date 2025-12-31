import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HouseholdLayout } from '../../components/layout/HouseholdLayout';
import { Card } from '../../components/ui/Card';
import axiosClient from '../../api/axiosClient';

export const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Forward all query params to backend
        const params = Object.fromEntries(searchParams.entries());

        const response = await axiosClient.get('/contribution/vnpay-return', {
          params,
        });

        setResult(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi khi xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <HouseholdLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Card padding className="bg-white border border-gray-200 shadow-md text-center">
            <div className="animate-spin w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">Đang xác thực thanh toán...</p>
          </Card>
        </div>
      </HouseholdLayout>
    );
  }

  if (error || !result) {
    return (
      <HouseholdLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Card padding className="bg-white border border-red-200 shadow-md">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-3">Thanh toán thất bại</h2>
              <p className="text-base text-slate-600 mb-6">{error || 'Không thể xác thực giao dịch'}</p>
              <button
                onClick={() => navigate('/household/dashboard')}
                className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition"
              >
                Quay về trang chủ
              </button>
            </div>
          </Card>
        </div>
      </HouseholdLayout>
    );
  }

  if (result.success) {
    return (
      <HouseholdLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Card padding className="bg-white border border-green-200 shadow-md">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-3">Thanh toán thành công!</h2>
              <p className="text-base text-slate-600 mb-2">
                Đã thanh toán {result.contributionIds?.length || 1} khoản phí
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Mã giao dịch: <span className="font-mono font-semibold">{result.transactionRef}</span>
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/household/dashboard')}
                  className="px-6 py-3 bg-brand-purple text-white font-semibold rounded-lg hover:bg-brand-purple/90 transition"
                >
                  Quay về trang chủ
                </button>
              </div>
            </div>
          </Card>
        </div>
      </HouseholdLayout>
    );
  }

  return (
    <HouseholdLayout>
      <div className="max-w-2xl mx-auto py-12">
        <Card padding className="bg-white border border-amber-200 shadow-md">
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-600 mb-3">Thanh toán chưa hoàn tất</h2>
            <p className="text-base text-slate-600 mb-2">{result.message}</p>
            <p className="text-sm text-slate-500 mb-6">
              Mã giao dịch: <span className="font-mono font-semibold">{result.transactionRef}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/household/payment')}
                className="px-6 py-3 border border-gray-300 text-slate-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate('/household/dashboard')}
                className="px-6 py-3 bg-brand-purple text-white font-semibold rounded-lg hover:bg-brand-purple/90 transition"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </Card>
      </div>
    </HouseholdLayout>
  );
};
