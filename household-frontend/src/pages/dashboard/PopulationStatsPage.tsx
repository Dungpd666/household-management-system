import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { AuthUser } from '../../api/authApi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { personApi } from '../../api/personApi';
import { householdApi } from '../../api/householdApi';
import { populationEventApi } from '../../api/populationEventApi';
import type { Person } from '../../types/person';
import type { Household } from '../../types/household';
import type { PopulationEvent } from '../../api/populationEventApi';
import {
  buildAgeStructure,
  buildHouseholdSizeDistribution,
  buildPopulationMovement,
  buildPopulationOverview,
  type DashboardStats,
} from '../../utils/dashboardStats';
import { PopulationOverviewCard } from '../../components/dashboard/charts/PopulationOverviewCard';
import { AgeStructureCard } from '../../components/dashboard/charts/AgeStructureCard';
// Movement Flow chart intentionally removed
import { HouseholdSizeDistributionCard } from '../../components/dashboard/charts/HouseholdSizeDistributionCard';

export const PopulationStatsPage = () => {
  const { user, isAdminUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminUser = isAdminUser() ? (user as AuthUser) : null;
  const isSuperAdmin = adminUser?.userRole === 'superadmin';

  useEffect(() => {
    if (!isSuperAdmin) return;

    let cancelled = false;

    const fetchAllPersons = async () => {
      const all: Person[] = [];
      const limit = 2000;
      let skip = 0;
      // Fetch in batches until the backend returns < limit.
      // This keeps everything data-driven without requiring new backend endpoints.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const params: Record<string, any> = { limit };
        if (skip > 0) params.skip = skip;
        const res = await personApi.getAll(params);
        const batch = (res.data ?? []) as Person[];
        all.push(...batch);
        if (batch.length < limit) break;
        skip += limit;
      }
      return all;
    };

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [persons, householdsRes, events] = await Promise.all([
          fetchAllPersons(),
          householdApi.getAll(),
          populationEventApi.getAll(),
        ]);

        const households = (householdsRes.data ?? []) as Household[];
        const populationEvents = (events ?? []) as PopulationEvent[];

        const populationOverview = buildPopulationOverview(persons);
        const ageStructure = buildAgeStructure(persons);
        const movement = buildPopulationMovement(populationEvents);
        const householdSize = buildHouseholdSizeDistribution(households);

        if (!cancelled) {
          setStats({ populationOverview, ageStructure, movement, householdSize });
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Không tải được thống kê');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();

    return () => {
      cancelled = true;
    };
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
        title="Dashboard thống kê"
        subtitle="Tổng quan dân số, biến động và quy mô hộ gia đình (dữ liệu realtime từ backend)."
      />

      {loading && <div>Đang tải thống kê...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PopulationOverviewCard data={stats.populationOverview} />
          <AgeStructureCard data={stats.ageStructure} />
          <HouseholdSizeDistributionCard data={stats.householdSize} />
        </div>
      )}

      {!loading && !error && !stats && (
        <Card padding className="text-sm text-textc-secondary">
          Chưa có dữ liệu để hiển thị.
        </Card>
      )}
    </div>
  );
};
