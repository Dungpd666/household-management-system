import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';

interface PopulationStatsResponse {
  Age: { label: string; count: number }[];
  Job: { label: string; count: number }[];
  Gender: { label: string; count: number }[];
}

export const PopulationStatsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PopulationStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = user?.userRole === 'superadmin';

  useEffect(() => {
    if (!isSuperAdmin) return;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.get<PopulationStatsResponse>('/users/population');
        setStats(res.data);
      } catch (err: any) {
        setError(err?.message || 'Không tải được thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Thống kê dân số"
          subtitle="Chỉ tài khoản Superadmin mới có quyền xem thống kê tổng hợp."
        />
        <Card padding className="text-sm text-red-500">Bạn không có quyền truy cập trang này.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thống kê dân số toàn hệ thống"
        subtitle="Tổng hợp theo nhóm tuổi, nghề nghiệp và giới tính."
      />

      {loading && <div>Đang tải thống kê...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding className="bg-surface-base">
            <div className="text-[12px] font-semibold text-textc-secondary mb-2 uppercase tracking-wide">Theo nhóm tuổi</div>
            <ul className="space-y-1 text-sm">
              {stats.Age.map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span className="text-textc-secondary">{item.label}</span>
                  <span className="font-semibold text-textc-primary">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding className="bg-surface-base">
            <div className="text-[12px] font-semibold text-textc-secondary mb-2 uppercase tracking-wide">Theo nghề nghiệp</div>
            <ul className="space-y-1 text-sm">
              {stats.Job.map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span className="text-textc-secondary">{item.label}</span>
                  <span className="font-semibold text-textc-primary">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding className="bg-surface-base">
            <div className="text-[12px] font-semibold text-textc-secondary mb-2 uppercase tracking-wide">Theo giới tính</div>
            <ul className="space-y-1 text-sm">
              {stats.Gender.map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span className="text-textc-secondary">{item.label}</span>
                  <span className="font-semibold text-textc-primary">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};
