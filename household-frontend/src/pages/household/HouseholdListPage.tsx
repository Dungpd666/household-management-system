
import { useEffect, useState } from 'react';
import { useHousehold } from '../../hooks/useHousehold';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';

interface HouseholdFormData {
  householdCode: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  householdType: string;
}

export const HouseholdListPage = () => {
  const { households, loading, error, fetchHouseholds, createHousehold, updateHousehold, deleteHousehold } = useHousehold();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<HouseholdFormData>({
    householdCode: '', address: '', ward: '', district: '', city: '', householdType: ''
  });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingHousehold, setEditingHousehold] = useState<any | null>(null);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitCreate = async () => {
    setFormError('');
    setSuccessMsg('');
    try {
      await createHousehold(formData);
      setSuccessMsg('Tạo hộ gia đình thành công!');
      setShowForm(false);
      setFormData({ householdCode: '', address: '', ward: '', district: '', city: '', householdType: '' });
      fetchHouseholds();
    } catch (err: any) {
      setFormError(err?.message || 'Lỗi khi tạo hộ gia đình');
    }
  };

  const startEdit = (hh: any) => {
    setEditingHousehold(hh);
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingHousehold(null);
  };

  const submitEdit = async () => {
    if (!editingHousehold) return;
    setFormError('');
    setSuccessMsg('');
    try {
      await updateHousehold(String(editingHousehold.id), editingHousehold);
      setSuccessMsg('Cập nhật hộ gia đình thành công!');
      setEditingHousehold(null);
      fetchHouseholds();
    } catch (err: any) {
      setFormError(err?.message || 'Lỗi khi cập nhật hộ gia đình');
    }
  };

  const removeHousehold = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa hộ gia đình này?')) return;
    setFormError('');
    setSuccessMsg('');
    try {
      await deleteHousehold(String(id));
      setSuccessMsg('Xóa hộ gia đình thành công!');
      fetchHouseholds();
    } catch (err: any) {
      setFormError(err?.message || 'Lỗi khi xóa hộ gia đình');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chào mừng trở lại, Cán bộ"
        subtitle="Tổng quan danh sách hộ gia đình và trạng thái xử lý."
        actions={(
          <>
            <Button variant="gray" size="md" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Đóng form' : 'Thêm hộ gia đình'}
            </Button>
          </>
        )}
      />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{formError}</div>}
      {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMsg}</div>}

      {(showForm || editingHousehold) && (
        <Card header={<>{editingHousehold ? 'Cập nhật hộ gia đình' : 'Thêm hộ gia đình'}</>} headerGradient variant="table">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Mã hộ khẩu</label>
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="householdCode"
                value={editingHousehold ? editingHousehold.householdCode : formData.householdCode}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, householdCode: e.target.value }) : handleChange(e)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Loại hộ</label>
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="householdType"
                value={editingHousehold ? editingHousehold.householdType : formData.householdType}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, householdType: e.target.value }) : handleChange(e)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-textc-secondary">Địa chỉ chi tiết</label>
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="address"
                value={editingHousehold ? editingHousehold.address : formData.address}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, address: e.target.value }) : handleChange(e)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Phường/Xã</label>
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="ward"
                value={editingHousehold ? editingHousehold.ward : formData.ward}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, ward: e.target.value }) : handleChange(e)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Quận/Huyện</label>
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="district"
                value={editingHousehold ? editingHousehold.district : formData.district}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, district: e.target.value }) : handleChange(e)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-textc-secondary">Thành phố</label>
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="city"
                value={editingHousehold ? editingHousehold.city : formData.city}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, city: e.target.value }) : handleChange(e)}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            {editingHousehold ? (
              <>
                <Button variant="gray" size="md" onClick={submitEdit}>Lưu hộ gia đình</Button>
                <Button variant="gray" size="md" onClick={cancelEdit}>Hủy</Button>
              </>
            ) : (
              <Button variant="gray" size="md" onClick={submitCreate}>Tạo hộ gia đình</Button>
            )}
          </div>
        </Card>
      )}

      {/* Top summary + filter giống khu New Courses + Hours Activity + Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-2">
        {/* New households & stats */}
        <div className="space-y-4 xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Tổng số hộ khẩu</div>
              <div className="text-2xl font-semibold text-textc-primary">{households.length}</div>
              <div className="mt-1 text-[11px] text-emerald-500">+3% so với tuần trước</div>
            </Card>
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Đã duyệt</div>
              <div className="text-2xl font-semibold text-textc-primary">{Math.max(0, Math.floor(households.length / 2))}</div>
              <div className="mt-1 text-[11px] text-textc-faint">Tỷ lệ xử lý ~50%</div>
            </Card>
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Chờ duyệt</div>
              <div className="text-2xl font-semibold text-amber-500">{households.length - Math.max(0, Math.floor(households.length / 2))}</div>
              <div className="mt-1 text-[11px] text-textc-faint">Ưu tiên xử lý trong tuần</div>
            </Card>
          </div>

          <Card variant="table" padding={false} className="mt-2">
            <div className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã hộ khẩu, số điện thoại..."
                className="flex-1 border border-border rounded-full px-4 py-2.5 text-[13px] bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                onChange={() => { /* TODO: implement search */ }}
              />
              <select
                className="border border-border rounded-full px-4 py-2.5 text-[13px] bg-white"
                defaultValue="Tất cả"
                onChange={() => { /* TODO: implement filter */ }}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Từ chối">Từ chối</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Daily schedule / assignments side column */}
        <div className="space-y-4">
          <Card header={<span>Lịch xử lý hôm nay</span>} headerGradient>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-textc-primary">Duyệt hồ sơ mới</div>
                  <div className="text-textc-faint text-[11px]">08:00 - 10:00 • 12 hồ sơ</div>
                </div>
                <span className="badge-green">Đang diễn ra</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-textc-primary">Đối soát tạm trú</div>
                  <div className="text-textc-faint text-[11px]">10:30 - 11:30</div>
                </div>
                <span className="badge-yellow">Sắp tới</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-textc-primary">Báo cáo ngày</div>
                  <div className="text-textc-faint text-[11px]">Cuối ngày</div>
                </div>
                <span className="badge-red">Chưa làm</span>
              </li>
            </ul>
          </Card>

          <Card header={<span>Nhiệm vụ nổi bật</span>} headerGradient>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-textc-primary">Hoàn tất 5 hồ sơ tồn</div>
                  <div className="text-textc-faint text-[11px]">Hạn: hôm nay</div>
                </div>
                <span className="badge-yellow">Đang làm</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-textc-primary">Rà soát dữ liệu hộ trùng</div>
                  <div className="text-textc-faint text-[11px]">Hạn: tuần này</div>
                </div>
                <span className="badge-green">Ổn định</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      <Card className="mt-6" padding={false} variant="table">
        <div className="p-4">
          <DataTable<any>
            columns={([
              { key: 'householdCode', header: 'Mã hộ', render: (r) => <span className="font-medium">{r.householdCode}</span> },
              { key: 'householdType', header: 'Loại hộ' },
              { key: 'address', header: 'Địa chỉ', width: '25%' },
              { key: 'ward', header: 'Phường/Xã' },
              { key: 'district', header: 'Quận/Huyện' },
              { key: 'city', header: 'Thành phố' },
              { key: 'actions', header: 'Thao tác', render: (r) => (
                <div className="flex gap-2 flex-wrap -ml-2">
                  <button
                    onClick={() => startEdit(r)}
                    className="cursor-pointer text-brand-purple bg-brand-purpleSoft hover:bg-brand-purple/10 hover:shadow px-3 py-1 text-xs font-medium rounded-lg transition"
                    title="Sửa"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => removeHousehold(r.id!)}
                    className="cursor-pointer text-rose-600 bg-rose-50 hover:bg-rose-100 hover:shadow px-3 py-1 text-xs font-medium rounded-lg transition"
                    title="Xóa"
                  >
                    Xóa
                  </button>
                </div>
              )},
            ]) as Column<any>[]}
            data={households}
            rowKey={(r) => String(r.id)}
          />
        </div>
      </Card>
    </div>
  );
};
