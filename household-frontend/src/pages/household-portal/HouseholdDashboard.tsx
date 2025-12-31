import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { householdApi } from '../../api/householdApi';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/layout/PageHeader';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { Button } from '../../components/ui/Button';
import { HouseholdLayout } from '../../components/layout/HouseholdLayout';
import type { Household } from '../../types/household';
import type { Person } from '../../types/person';
import type { Contribution } from '../../types/contribution';

export const HouseholdDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<Person[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);

  // Check for payment result in URL params
  useEffect(() => {
    const paymentStatus = searchParams.get('paymentStatus');
    const message = searchParams.get('message');

    if (paymentStatus) {
      if (paymentStatus === 'success') {
        toast.success(message || 'Thanh toán thành công!');
      } else {
        toast.error(message || 'Thanh toán thất bại hoặc đã bị hủy');
      }

      // Clean up URL params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, toast]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [householdRes, membersRes, contributionsRes] = await Promise.all([
          householdApi.getMyHousehold(),
          householdApi.getMyMembers(),
          householdApi.getMyContributions(),
        ]);

        setHousehold(householdRes.data);
        setMembers(membersRes.data || []);
        setContributions(contributionsRes.data || []);
      } catch (err: any) {
        toast.error(err?.message || 'Không thể tải thông tin hộ gia đình');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <HouseholdLayout>
        <div className="text-center py-12">
          <div className="text-xl text-slate-500">Đang tải thông tin...</div>
        </div>
      </HouseholdLayout>
    );
  }

  if (!household) {
    return (
      <HouseholdLayout>
        <div className="text-center py-12">
          <div className="text-xl text-red-600">Không tìm thấy thông tin hộ gia đình</div>
        </div>
      </HouseholdLayout>
    );
  }

  const totalContributions = contributions.reduce(
    (sum, c) => sum + (c.amount || 0),
    0
  );

  const paidContributions = contributions.filter((c) => c.paid);
  const unpaidContributions = contributions.filter((c) => !c.paid);
  const totalUnpaid = unpaidContributions.reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <HouseholdLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Tổng quan hộ gia đình"
          subtitle={`Thông tin chi tiết về hộ khẩu ${household.householdCode}`}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding className="bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">Thành viên</div>
                <div className="text-3xl font-bold text-slate-900">
                  <AnimatedNumber value={members.length} />
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card padding className="bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">Tổng đóng góp</div>
                <div className="text-xl font-bold text-slate-900">
                  {totalContributions.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card padding className="bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">Chưa thanh toán</div>
                <div className="text-3xl font-bold text-slate-900">
                  <AnimatedNumber value={unpaidContributions.length} />
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Household Information */}
        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Thông tin hộ khẩu</h3>
          </div>
          
          <div className="space-y-3 text-base">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>Mã hộ khẩu</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{household.householdCode}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Loại hộ</span>
              </div>
              <span className="font-semibold text-slate-900">{household.householdType}</span>
            </div>
            <div className="py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Địa chỉ</span>
              </div>
              <div className="font-medium text-slate-900 ml-6">{household.address}</div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Phường/Xã</span>
              </div>
              <span className="font-medium text-slate-900">{household.ward}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Quận/Huyện</span>
              </div>
              <span className="font-medium text-slate-900">{household.district}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tỉnh/Thành phố</span>
              </div>
              <span className="font-medium text-slate-900">{household.city}</span>
            </div>
          </div>
        </Card>

        {/* Members List */}
        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Thành viên hộ khẩu ({members.length})</h3>
          </div>
          
          {members.length === 0 ? (
            <div className="text-center py-8 text-base text-slate-500">Chưa có thành viên</div>
          ) : (
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 border-b border-slate-100 last:border-0 transition-all">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg text-white shadow-sm ${
                    index % 5 === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    index % 5 === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    index % 5 === 2 ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                    index % 5 === 3 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                    'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}>
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base text-slate-900">{member.fullName}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {member.relationshipWithHead || 'Thành viên'}
                      </span>
                      <span>•</span>
                      <span className={member.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}>
                        {member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : 'Khác'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {member.dateOfBirth
                      ? new Date(member.dateOfBirth).toLocaleDateString('vi-VN')
                      : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Unpaid Contributions */}
        {unpaidContributions.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Các khoản chưa thanh toán ({unpaidContributions.length})</h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/household/payment')}
              >
                Thanh toán ngay
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Loại phí</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Số tiền</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Hạn đóng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidContributions.map((contribution) => (
                    <tr key={contribution.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{contribution.type}</td>
                      <td className="py-3 px-4 text-orange-600 font-semibold">{(contribution.amount || 0).toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 px-4 text-slate-600">
                        {contribution.dueDate ? new Date(contribution.dueDate).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Chưa đóng
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Contributions History */}
        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Lịch sử đóng góp ({paidContributions.length})</h3>
          </div>
          
          {paidContributions.length === 0 ? (
            <div className="text-center py-8 text-base text-slate-500">Chưa có lịch sử đóng góp</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Loại phí</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Số tiền</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Ngày đóng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {paidContributions.map((contribution) => (
                    <tr key={contribution.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{contribution.type}</td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">{(contribution.amount || 0).toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 px-4 text-slate-600">
                        {contribution.paidAt ? new Date(contribution.paidAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã đóng
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </HouseholdLayout>
  );
};
