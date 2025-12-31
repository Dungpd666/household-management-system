import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { householdApi } from '../../api/householdApi';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { HouseholdLayout } from '../../components/layout/HouseholdLayout';
import type { Household } from '../../types/household';
import type { Person } from '../../types/person';
import type { Contribution } from '../../types/contribution';

export const HouseholdDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<Person[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);

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
          <div className="text-xl text-slate-300">Đang tải thông tin...</div>
        </div>
      </HouseholdLayout>
    );
  }

  if (!household) {
    return (
      <HouseholdLayout>
        <div className="text-center py-12">
          <div className="text-xl text-red-400">Không tìm thấy thông tin hộ gia đình</div>
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
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card padding className="bg-slate-800/60 border border-slate-700/50 shadow-lg hover:shadow-xl hover:bg-slate-800/80 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-400 mb-2">Thành viên</div>
                <div className="text-4xl font-bold text-emerald-400">{members.length}</div>
              </div>
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card padding className="bg-slate-800/60 border border-slate-700/50 shadow-lg hover:shadow-xl hover:bg-slate-800/80 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-400 mb-2">Tổng đóng góp</div>
                <div className="text-2xl font-bold text-blue-400">
                  {totalContributions.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card padding className="bg-slate-800/60 border border-slate-700/50 shadow-lg hover:shadow-xl hover:bg-slate-800/80 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-400 mb-2">Chưa thanh toán</div>
                <div className="text-4xl font-bold text-red-400">
                  {unpaidContributions.length}
                </div>
              </div>
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Household Information */}
        <Card padding className="bg-slate-800/60 border border-slate-700/50 shadow-lg hover:shadow-xl hover:bg-slate-800/80 transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Thông tin hộ khẩu</h2>
          </div>
          <div className="space-y-3 text-base">
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>Mã hộ khẩu</span>
              </div>
              <span className="font-mono font-medium text-white">{household.householdCode}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Loại hộ</span>
              </div>
              <span className="font-medium text-white">{household.householdType}</span>
            </div>
            <div className="py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Địa chỉ</span>
              </div>
              <div className="font-medium text-white ml-6">{household.address}</div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Phường/Xã</span>
              </div>
              <span className="font-medium text-white">{household.ward}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Quận/Huyện</span>
              </div>
              <span className="font-medium text-white">{household.district}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tỉnh/Thành phố</span>
              </div>
              <span className="font-medium text-white">{household.city}</span>
            </div>
          </div>
        </Card>

        {/* Members List */}
        <Card padding className="bg-slate-800/60 border border-slate-700/50 shadow-lg hover:shadow-xl hover:bg-slate-800/80 transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Thành viên ({members.length})</h2>
          </div>
          {members.length === 0 ? (
            <div className="text-center py-8 text-base text-slate-400">Chưa có thành viên</div>
          ) : (
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 py-4 px-4 rounded-lg hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0 transition">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg text-white ${
                    index % 5 === 0 ? 'bg-blue-500' :
                    index % 5 === 1 ? 'bg-purple-500' :
                    index % 5 === 2 ? 'bg-pink-500' :
                    index % 5 === 3 ? 'bg-green-500' :
                    'bg-orange-500'
                  }`}>
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base text-white">{member.fullName}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {member.relationshipWithHead || 'Thành viên'}
                      </span>
                      <span>•</span>
                      <span className={member.gender === 'Nam' ? 'text-blue-400' : 'text-pink-400'}>
                        {member.gender}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <Card padding className="bg-amber-50 border-2 border-amber-300 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Phí cần đóng ({unpaidContributions.length})</h2>
                  <p className="text-sm text-amber-700 font-medium">Tổng: {totalUnpaid.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/household/payment')}
                className="px-5 py-2.5 bg-amber-600 text-white text-base font-semibold rounded-lg hover:bg-amber-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thanh toán
              </button>
            </div>
            <div className="space-y-2">
              {unpaidContributions.map((contribution) => {
                const getContributionIcon = (type: string) => {
                  if (type.includes('Điện')) return '⚡';
                  if (type.includes('Nước')) return '💧';
                  if (type.includes('Vệ sinh')) return '🧹';
                  if (type.includes('Bảo vệ')) return '🛡️';
                  if (type.includes('từ thiện')) return '❤️';
                  return '💰';
                };

                return (
                  <div
                    key={contribution.id}
                    className="flex items-center gap-4 py-4 px-4 rounded-lg bg-white hover:bg-amber-50 border border-amber-200 transition"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-amber-100">
                      {getContributionIcon(contribution.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-slate-900">{contribution.type}</span>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Chưa đóng
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Hạn đóng: {contribution.dueDate ? new Date(contribution.dueDate).toLocaleDateString('vi-VN') : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-amber-700">
                        {(contribution.amount || 0).toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Contributions History */}
        <Card padding className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử đóng góp ({paidContributions.length})</h2>
            </div>
          </div>
          {paidContributions.length === 0 ? (
            <div className="text-center py-8 text-base text-slate-500">Chưa có lịch sử đóng góp</div>
          ) : (
            <div className="space-y-2">
              {paidContributions.map((contribution) => {
                const getContributionIcon = (type: string) => {
                  if (type.includes('Điện')) return '⚡';
                  if (type.includes('Nước')) return '💧';
                  if (type.includes('Vệ sinh')) return '🧹';
                  if (type.includes('Bảo vệ')) return '🛡️';
                  if (type.includes('từ thiện')) return '❤️';
                  return '💰';
                };

                return (
                  <div
                    key={contribution.id}
                    className="flex items-center gap-4 py-4 px-4 rounded-lg hover:bg-gray-50 border-b border-gray-100 last:border-0 transition"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-green-100">
                      {getContributionIcon(contribution.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-slate-900">{contribution.type}</span>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Đã đóng
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Đã đóng: {contribution.paidAt ? new Date(contribution.paidAt).toLocaleDateString('vi-VN') : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-green-600">
                        {(contribution.amount || 0).toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </HouseholdLayout>
  );
};
