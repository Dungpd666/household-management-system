import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/layout/PageHeader';
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
      setSelectedContributions(unpaidContributions.map(c => c.id).filter((id): id is number => id !== undefined));
    }
  };

  const totalAmount = unpaidContributions
<<<<<<< HEAD
    .filter(c => c.id !== undefined && selectedContributions.includes(c.id))
=======
    .filter(c => c.id && selectedContributions.includes(c.id))
    .filter(c => c.id !== undefined && selectedContributions.includes(c.id))

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
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Thanh toán đóng góp"
          subtitle="Chọn các khoản phí cần thanh toán qua VNPay"
        />

        {/* Payment Form */}
        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Chọn phí cần thanh toán</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select All Button */}
            {unpaidContributions.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-4 py-2 text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 rounded-full transition-all"
                >
                  {selectedContributions.length === unpaidContributions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
            )}

            {/* Unpaid Contributions List */}
            {unpaidContributions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-base text-slate-600 font-medium">Không có khoản phí nào cần thanh toán</p>
                <p className="text-sm text-slate-500 mt-2">Tất cả các khoản đóng góp đã được thanh toán</p>
              </div>
            ) : (
<<<<<<< HEAD
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide w-12"></th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Loại phí</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Số tiền</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Hạn đóng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidContributions.map((contribution) => (
                      <tr key={contribution.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={contribution.id !== undefined && selectedContributions.includes(contribution.id)}
                            onChange={() => contribution.id !== undefined && handleToggleContribution(contribution.id)}
                            className="w-5 h-5 text-brand-purple rounded focus:ring-2 focus:ring-brand-purple/60 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium">{contribution.type}</td>
                        <td className="py-3 px-4 text-orange-600 font-semibold">{(contribution.amount || 0).toLocaleString('vi-VN')} đ</td>
                        <td className="py-3 px-4 text-slate-600">
                          {contribution.dueDate ? new Date(contribution.dueDate).toLocaleDateString('vi-VN') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            {selectedContributions.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Số khoản đã chọn:</span>
                    <span className="font-semibold text-slate-900">{selectedContributions.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="text-slate-700 font-semibold text-lg">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="gray"
                size="md"
                onClick={() => navigate('/household/dashboard')}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading || selectedContributions.length === 0}
                className="flex-1"
              >
                {loading ? 'Đang xử lý...' : `Thanh toán${selectedContributions.length > 0 ? ` (${selectedContributions.length})` : ''}`}
              </Button>
            </div>
          </form>
        </Card>

        {/* Payment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-slate-700">
              <p className="font-medium mb-1">Thanh toán qua VNPay</p>
              <p className="text-xs text-slate-600">
                Bạn sẽ được chuyển đến cổng thanh toán VNPay. Hỗ trợ thẻ ATM, Visa, Mastercard và ví điện tử.
              </p>
            </div>
          </div>
        </div>
      </div>
    </HouseholdLayout>
  );
};
