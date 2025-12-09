import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHousehold } from '../../hooks/useHousehold';
import type { Household } from '../../types/household';
import { PageHeader } from '../../components/layout/PageHeader';

export const HouseholdDetailPage = () => {
  const { id } = useParams();
  const { fetchHouseholdById } = useHousehold();
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchHouseholdById(String(id));
        if (!data) setError('Không tìm thấy hộ gia đình');
        setHousehold(data as any);
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải chi tiết hộ gia đình');
      } finally {
        setLoading(false);
      }
    };
    if (id) run();
  }, [id, fetchHouseholdById]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!household) return <div>Không có dữ liệu</div>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Chi tiết hộ gia đình"
        subtitle={`Mã hộ: ${household.householdCode}`}
        actions={<Link to="/households" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>}
      />
      <div className="bg-white rounded shadow p-6 space-y-2">
        <div><span className="font-semibold">Mã hộ:</span> {household.householdCode}</div>
        <div><span className="font-semibold">Loại hộ:</span> {household.householdType}</div>
        <div><span className="font-semibold">Địa chỉ:</span> {household.address}</div>
        <div><span className="font-semibold">Phường/Xã:</span> {household.ward}</div>
        <div><span className="font-semibold">Quận/Huyện:</span> {household.district}</div>
        <div><span className="font-semibold">Thành phố:</span> {household.city}</div>
        <div className="text-sm text-gray-500">ID: {household.id}</div>
      </div>
    </div>
  );
};
