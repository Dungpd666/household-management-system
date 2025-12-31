import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { HouseholdLayout } from '../../components/layout/HouseholdLayout';
import { householdApi } from '../../api/householdApi';
import { contributionApi } from '../../api/contributionApi';
import type { Contribution } from '../../types/contribution';

export const HouseholdPayment = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [unpaidContributions, setUnpaidContributions] = useState<Contribution[]>([]);
  const [selectedContributions, setSelectedContributions] = useState<number[]>([]);

  useEffect(() => {
    const fetchUnpaidContributions = async () => {
      try {
        const response = await householdApi.getMyContributions();
        const unpaid = (response.data || []).filter((c: Contribution) => !c.paid);
        setUnpaidContributions(unpaid);
      } catch (err: any) {
        toast.error(err?.message || 'Không thể tải danh sách phí');
      }
    };

    fetchUnpaidContributions();
  }, [toast]);

  const handleToggleContribution = (id: number) => {
    setSelectedContributions(prev => {
      if (prev.includes(id)) {
        return prev.filter(cId => cId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedContributions.length === unpaidContributions.length) {
      setSelectedContributions([]);
    } else {
      setSelectedContributions(unpaidContributions.map(c => c.id!).filter((id): id is number => id !== undefined));
    }
  };

  const totalAmount = unpaidContributions
    .filter(c => c.id && selectedContributions.includes(c.id))
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log('Selected contributions:', selectedContributions);

    if (selectedContributions.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khoản phí để thanh toán');
      return;
    }

    setLoading(true);
    try {
      console.log('Calling API with:', selectedContributions);
      // Call backend API to create VNPay payment URL
      const response = await contributionApi.createVnpayUrlMultiple(selectedContributions);
      console.log('API response:', response);

      if (response.data && response.data.paymentUrl) {
        console.log('Redirecting to:', response.data.paymentUrl);
        // Redirect to VNPay payment gateway
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán từ server');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể tạo yêu cầu thanh toán');
      setLoading(false);
    }
  };

  const getContributionIcon = (type: string) => {
    if (type.includes('Điện') || type.includes('điện')) return '⚡';
    if (type.includes('Nước') || type.includes('nước')) return '💧';
    if (type.includes('Vệ sinh') || type.includes('vệ sinh')) return '🧹';
    if (type.includes('Bảo vệ') || type.includes('bảo vệ')) return '🛡️';
    if (type.includes('từ thiện')) return '❤️';
    return '💰';
  };

  return (
    <HouseholdLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Payment Form */}
        <Card padding className="bg-white border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Chọn phí cần thanh toán</h2>
            {unpaidContributions.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm font-medium text-brand-purple hover:bg-purple-50 rounded-lg transition"
              >
                {selectedContributions.length === unpaidContributions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Unpaid Contributions List */}
            {unpaidContributions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-base text-slate-600">Không có khoản phí nào cần thanh toán</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unpaidContributions.map((contribution) => (
                  <label
                    key={contribution.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      contribution.id && selectedContributions.includes(contribution.id)
                        ? 'border-brand-purple bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={contribution.id ? selectedContributions.includes(contribution.id) : false}
                      onChange={() => contribution.id && handleToggleContribution(contribution.id)}
                      className="w-5 h-5 text-brand-purple rounded focus:ring-2 focus:ring-brand-purple/60"
                    />
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-amber-100">
                      {getContributionIcon(contribution.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-slate-900">{contribution.type}</div>
                      <div className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Hạn đóng: {contribution.dueDate ? new Date(contribution.dueDate).toLocaleDateString('vi-VN') : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-slate-900">
                        {(contribution.amount || 0).toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Summary */}
            {selectedContributions.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Số khoản đã chọn:</span>
                    <span className="font-semibold text-slate-900">{selectedContributions.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                    <span className="text-slate-700 font-semibold text-lg">Tổng thanh toán:</span>
                    <span className="text-3xl font-bold text-blue-700">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/household/dashboard')}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-slate-700 font-semibold text-base rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || selectedContributions.length === 0}
                className="flex-1 bg-brand-purple text-white font-semibold text-base py-3 rounded-lg hover:bg-brand-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
              >
                {loading ? 'Đang xử lý...' : `Thanh toán ${selectedContributions.length > 0 ? `(${selectedContributions.length})` : ''}`}
              </button>
            </div>
          </form>
        </Card>

        {/* Payment Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-base text-slate-700">
              <p className="font-semibold mb-2">Thanh toán qua VNPay</p>
              <p className="text-sm text-slate-600">
                Bạn sẽ được chuyển đến cổng thanh toán VNPay. Hỗ trợ thẻ ATM, Visa, Mastercard và ví điện tử.
              </p>
            </div>
          </div>
        </div>
      </div>
    </HouseholdLayout>
  );
};
