
import { useEffect, useState } from 'react';
import { useHousehold } from '../../hooks/useHousehold';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { PillDropdown } from '../../components/ui/PillDropdown';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FieldHint } from '../../components/ui/FieldHint';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const totalHouseholds = households.length;
  const approvedHouseholds = Math.max(0, Math.floor(totalHouseholds / 2));
  const pendingHouseholds = totalHouseholds - approvedHouseholds;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredHouseholds = !normalizedSearch
    ? households
    : households.filter((h: any) => {
        const values = [
          h.householdCode,
          h.householdType,
          h.address,
          h.ward,
          h.district,
          h.city,
        ]
          .filter(Boolean)
          .map((v: string) => v.toLowerCase());
        return values.some((v: string) => v.includes(normalizedSearch));
      });

  const scheduleItems = [
    {
      id: 'approve-new',
      title: 'Duyệt hồ sơ mới',
      time: '08:00 - 10:00',
      meta: 'Khung xử lý hồ sơ đăng ký mới',
      badge: 'Đang diễn ra',
      tone: 'green' as const,
    },
    {
      id: 'temp-review',
      title: 'Đối soát tạm trú',
      time: '10:30 - 11:30',
      meta: 'Rà soát tạm trú theo báo cáo ngày',
      badge: 'Sắp tới',
      tone: 'yellow' as const,
    },
    {
      id: 'daily-report',
      title: 'Báo cáo ngày',
      time: 'Cuối ngày',
      meta: 'Tổng hợp số liệu hộ khẩu, nhân khẩu',
      badge: 'Chưa làm',
      tone: 'red' as const,
    },
    {
      id: 'data-cleanup',
      title: 'Rà soát dữ liệu bất thường',
      time: 'Trong ngày',
      meta: 'Kiểm tra trường thiếu, mã trùng lặp',
      badge: 'Đang theo dõi',
      tone: 'yellow' as const,
    },
    {
      id: 'archive',
      title: 'Lưu trữ hồ sơ đã hoàn tất',
      time: 'Cuối tuần',
      meta: 'Chuyển hồ sơ cũ sang kho lưu trữ',
      badge: 'Định kỳ',
      tone: 'green' as const,
    },
  ];

  const taskItems = [
    {
      id: 'backlog',
      title: 'Hoàn tất 5 hồ sơ tồn',
      deadline: 'Hạn: hôm nay',
      badge: 'Đang làm',
      tone: 'yellow' as const,
    },
    {
      id: 'duplicate-check',
      title: 'Rà soát dữ liệu hộ trùng',
      deadline: 'Hạn: tuần này',
      badge: 'Ổn định',
      tone: 'green' as const,
    },
    {
      id: 'temp-expire',
      title: 'Kiểm tra các tạm trú sắp hết hạn',
      deadline: 'Hạn: 3 ngày tới',
      badge: 'Ưu tiên',
      tone: 'yellow' as const,
    },
    {
      id: 'moved-update',
      title: 'Cập nhật nhân khẩu đã chuyển đi',
      deadline: 'Làm dần trong tuần',
      badge: 'Theo kế hoạch',
      tone: 'green' as const,
    },
    {
      id: 'contact-check',
      title: 'Bổ sung thông tin liên hệ còn thiếu',
      deadline: 'Hạn: cuối tháng',
      badge: 'Chưa gấp',
      tone: 'green' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chào mừng trở lại, Cán bộ"
        subtitle="Tổng quan danh sách hộ gia đình và trạng thái xử lý."
        actions={(
          <>
            <Button variant="gray" size="md" onClick={() => { setShowForm(true); setEditingHousehold(null); }}>
              Thêm hộ gia đình
            </Button>
          </>
        )}
      />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{formError}</div>}
      {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMsg}</div>}

      <Modal
        isOpen={showForm || !!editingHousehold}
        onClose={() => { setShowForm(false); setEditingHousehold(null); }}
        title={editingHousehold ? 'Cập nhật hộ gia đình' : 'Thêm hộ gia đình'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldHint
            label="Mã hộ khẩu"
            hint="Mã định danh hộ khẩu, ví dụ: HK123. Mỗi hộ một mã."
          >
            <input
              className="w-full border border-border rounded px-3 py-2 text-sm"
              name="householdCode"
              value={editingHousehold ? editingHousehold.householdCode : formData.householdCode}
              onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, householdCode: e.target.value }) : handleChange(e)}
              required
            />
          </FieldHint>
          <FieldHint
            label="Loại hộ"
            hint="Chọn loại hộ: Thường trú, Tạm trú, Tập thể..."
          >
            <PillDropdown
              value={editingHousehold ? editingHousehold.householdType : formData.householdType}
              onChange={(val) => {
                if (editingHousehold) {
                  setEditingHousehold({ ...editingHousehold, householdType: val });
                } else {
                  setFormData((prev) => ({ ...prev, householdType: val }));
                }
              }}
              options={[
                { value: 'Thường trú', label: 'Thường trú' },
                { value: 'Tạm trú', label: 'Tạm trú' },
                { value: 'Tạm vắng', label: 'Tạm vắng' },
                { value: 'Tập thể', label: 'Tập thể' },
                { value: 'Khác', label: 'Khác' },
              ]}
              placeholder="Chọn loại hộ"
              buttonClassName="w-full flex items-center justify-between gap-2 border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </FieldHint>
          <div className="md:col-span-2">
            <FieldHint
              label="Địa chỉ chi tiết"
              hint="Số nhà, đường, ngõ... ví dụ: Số 10, Ngõ 5 Trần Phú."
            >
              <input
                className="w-full border border-border rounded px-3 py-2 text-sm"
                name="address"
                value={editingHousehold ? editingHousehold.address : formData.address}
                onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, address: e.target.value }) : handleChange(e)}
                required
              />
            </FieldHint>
          </div>
          <FieldHint
            label="Phường/Xã"
            hint="Tên phường hoặc xã, ví dụ: Phường 1, Xã Tân Lập."
          >
            <input
              className="w-full border border-border rounded px-3 py-2 text-sm"
              name="ward"
              value={editingHousehold ? editingHousehold.ward : formData.ward}
              onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, ward: e.target.value }) : handleChange(e)}
              required
            />
          </FieldHint>
          <FieldHint
            label="Quận/Huyện"
            hint="Tên quận hoặc huyện, ví dụ: Quận Ba Đình, Huyện Đông Anh."
          >
            <input
              className="w-full border border-border rounded px-3 py-2 text-sm"
              name="district"
              value={editingHousehold ? editingHousehold.district : formData.district}
              onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, district: e.target.value }) : handleChange(e)}
              required
            />
          </FieldHint>
          <FieldHint
            label="Thành phố"
            hint="Tên tỉnh/thành phố, ví dụ: Hà Nội, TP. Hồ Chí Minh."
          >
            <input
              className="w-full border border-border rounded px-3 py-2 text-sm"
              name="city"
              value={editingHousehold ? editingHousehold.city : formData.city}
              onChange={(e) => editingHousehold ? setEditingHousehold({ ...editingHousehold, city: e.target.value }) : handleChange(e)}
              required
            />
          </FieldHint>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {editingHousehold ? (
            <Button variant="green" size="md" onClick={submitEdit}>Cập nhật</Button>
          ) : (
            <Button variant="green" size="md" onClick={submitCreate}>Lưu hộ gia đình</Button>
          )}
        </div>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Tổng hộ gia đình</div>
              <div className="text-2xl font-semibold text-textc-primary">
                <AnimatedNumber value={totalHouseholds} />
              </div>
            </Card>
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Đã duyệt</div>
              <div className="text-2xl font-semibold text-textc-primary">
                <AnimatedNumber value={approvedHouseholds} />
              </div>
              <div className="mt-1 text-[11px] text-textc-faint">Tỷ lệ xử lý ~50%</div>
            </Card>
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Chờ duyệt</div>
              <div className="text-2xl font-semibold text-amber-500">
                <AnimatedNumber value={pendingHouseholds} />
              </div>
              <div className="mt-1 text-[11px] text-textc-faint">Ưu tiên xử lý trong tuần</div>
            </Card>
          </div>

          <Card variant="table" padding={false} className="mt-2">
            <div className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã hộ khẩu, số điện thoại..."
                className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <PillDropdown
                value="all"
                onChange={() => { /* TODO: implement filter logic */ }}
                options={[
                  { value: 'all', label: 'Tất cả trạng thái', hint: 'tat ca · all status' },
                  { value: 'approved', label: 'Đã duyệt', hint: 'da duyet · approved' },
                  { value: 'pending', label: 'Chờ duyệt', hint: 'cho duyet · pending' },
                  { value: 'rejected', label: 'Từ chối', hint: 'tu choi · rejected' },
                ]}
              />
            </div>
          </Card>

          {/* Bảng dữ liệu chính - đặt ngay dưới thanh tìm kiếm */}
          <Card className="mt-2" padding={false} variant="table">
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
                data={filteredHouseholds}
                rowKey={(r) => String(r.id)}
              />
            </div>
          </Card>
        </div>

        {/* Daily schedule / assignments side column */}
        <div className="space-y-4">
          <Card header={<span>Lịch xử lý hôm nay</span>} headerGradient>
            <ul className="space-y-3 text-[13px] max-h-64 overflow-y-auto pr-1">
              {scheduleItems.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md hover:border hover:border-slate-200"
                >
                  <div>
                    <div className="font-medium text-textc-primary">{item.title}</div>
                    <div className="text-textc-faint text-[11px]">{item.time} {item.meta}</div>
                  </div>
                  <span
                    className={
                      item.tone === 'green'
                        ? 'badge-green'
                        : item.tone === 'yellow'
                        ? 'badge-yellow'
                        : 'badge-red'
                    }
                  >
                    {item.badge}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card header={<span>Nhiệm vụ nổi bật</span>} headerGradient>
            <div className="space-y-3 text-[13px] max-h-64 overflow-y-auto pr-1">
              {taskItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md hover:border hover:border-slate-200"
                >
                  <div>
                    <div className="font-medium text-textc-primary">{item.title}</div>
                    <div className="text-textc-faint text-[11px]">{item.deadline}</div>
                  </div>
                  <span
                    className={
                      item.tone === 'green'
                        ? 'badge-green'
                        : item.tone === 'yellow'
                        ? 'badge-yellow'
                        : 'badge-red'
                    }
                  >
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
