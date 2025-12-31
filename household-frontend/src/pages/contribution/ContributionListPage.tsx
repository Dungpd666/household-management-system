import { useEffect, useState } from 'react';
import { useContribution } from '../../hooks/useContribution';
import { useHousehold } from '../../hooks/useHousehold';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FieldHint } from '../../components/ui/FieldHint';

export const ContributionListPage = () => {
  const { contributions, loading, error, fetchContributions, createContribution, markPaid } = useContribution();
  const { households, fetchHouseholds } = useHousehold();
  const toast = useToast();
  const ALL_HOUSEHOLDS = '__all__';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    dueDate: '',
    householdId: '' as string | number,
  });
  const [householdQuery, setHouseholdQuery] = useState('');
  const [householdFocused, setHouseholdFocused] = useState(false);

  const closeForm = () => {
    setShowForm(false);
    setFormData({ type: '', amount: '', dueDate: '', householdId: '' });
    setHouseholdQuery('');
    setHouseholdFocused(false);
  };

  useEffect(() => {
    fetchContributions();
    fetchHouseholds();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();

  const householdSuggestions = Array.isArray(households)
    ? (() => {
        if (!householdQuery) return households.slice(0, 5);
        const q = normalize(householdQuery);
        return households
          .filter((h: any) => {
            const code = normalize(String(h.householdCode || ''));
            const address = normalize(String(h.address || ''));
            return code.includes(q) || address.includes(q);
          })
          .slice(0, 8);
      })()
    : [];

  const householdSuggestionsWithAll = householdSuggestions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // errors handled via toast
    try {
      if (!formData.householdId) {
        throw new Error('Vui lòng chọn hộ gia đình từ gợi ý');
      }

      const amountInThousands = Number(formData.amount);
      if (!Number.isFinite(amountInThousands) || amountInThousands <= 0) {
        throw new Error('Vui lòng nhập số tiền hợp lệ (theo nghìn), ví dụ: 35');
      }

      const householdIds =
        formData.householdId === ALL_HOUSEHOLDS
          ? (Array.isArray(households)
              ? households
                  .map((h: any) => Number(h?.id))
                  .filter((id: number) => Number.isFinite(id) && id > 0)
              : [])
          : [Number(formData.householdId)].filter((id) => Number.isFinite(id) && id > 0);

      if (householdIds.length === 0) {
        throw new Error('Không có hộ gia đình để áp dụng (All)');
      }

      const base = {
        type: formData.type,
        // UI nhập theo nghìn: 35 => 35.000 VND
        amount: Math.round(amountInThousands * 1000),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      await createContribution({ ...base, householdIds });
      toast.success('Tạo khoản đóng góp thành công!');
      setShowForm(false);
      setFormData({ type: '', amount: '', dueDate: '', householdId: '' });
      setHouseholdQuery('');
      fetchContributions();
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi tạo khoản đóng góp');
    }
  };

  const handleMarkPaid = async (id: number) => {
    // errors handled via toast
    try {
      await markPaid(String(id), { paidAt: new Date().toISOString() });
      toast.success('Đã đánh dấu đã thanh toán');
      fetchContributions();
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi cập nhật thanh toán');
    }
  };

  const sortedContributions = (Array.isArray(contributions) ? [...contributions] : []).sort((a: any, b: any) => {
    const ta = a?.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b?.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý đóng góp cộng đồng"
        subtitle="Theo dõi các khoản thu theo từng hộ gia đình."
        actions={(
          <Button variant="gray" onClick={() => setShowForm(true)}>
            Tạo khoản đóng góp
          </Button>
        )}
      />

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title="Tạo khoản đóng góp"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldHint
              label="Loại đóng góp"
              hint="Ví dụ: Quỹ vệ sinh, Quỹ an ninh, Đóng góp cộng đồng..."
            >
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </FieldHint>

            <FieldHint
              label="Số tiền (VND)"
              hint="Nhập theo nghìn. Ví dụ: 35 => 35.000 VND"
            >
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min={1}
                step={1}
                className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </FieldHint>

            <FieldHint
              label="Hạn nộp (tùy chọn)"
              hint="Nếu có hạn nộp, chọn ngày để nhắc thu."
            >
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </FieldHint>

            <FieldHint
              label="Hộ gia đình"
              hint="Gõ mã hộ để tìm và chọn từ gợi ý."
            >
              <div className="relative">
                <input
                  type="text"
                  value={householdQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHouseholdQuery(val);
                    setFormData((prev) => ({ ...prev, householdId: '' }));
                  }}
                  onFocus={() => setHouseholdFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setHouseholdFocused(false), 120);
                  }}
                  placeholder="Gõ mã hộ để tìm, ví dụ: HK123"
                  className="w-full border border-slate-200 rounded-full px-4 py-2.5 text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 placeholder:text-slate-400"
                  required
                />
                {householdFocused && (
                  <div className="absolute z-30 mt-2 left-0 right-0 rounded-2xl bg-white shadow-lg shadow-slate-200 border border-slate-100 max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      className="w-full flex flex-col items-start px-3 py-2 text-left hover:bg-slate-50 cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setHouseholdQuery('Tất cả (All)');
                        setFormData((prev) => ({ ...prev, householdId: ALL_HOUSEHOLDS }));
                        setHouseholdFocused(false);
                      }}
                    >
                      <span className="text-[13px] font-medium text-slate-900">Tất cả (All)</span>
                      <span className="mt-0.5 text-[11px] text-slate-400 truncate max-w-full">Áp dụng cho tất cả hộ gia đình</span>
                    </button>

                    {householdSuggestionsWithAll.map((h: any) => (
                      <button
                        key={h.id}
                        type="button"
                        className="w-full flex flex-col items-start px-3 py-2 text-left hover:bg-slate-50 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setHouseholdQuery(h.householdCode || String(h.id));
                          setFormData((prev) => ({ ...prev, householdId: h.id }));
                          setHouseholdFocused(false);
                        }}
                      >
                        <span className="text-[13px] font-medium text-slate-900">{h.householdCode || `Hộ ${h.id}`}</span>
                        {h.address && (
                          <span className="mt-0.5 text-[11px] text-slate-400 truncate max-w-full">{h.address}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FieldHint>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="gray" onClick={closeForm}>Hủy</Button>
            <Button type="submit" variant="green">Tạo</Button>
          </div>
        </form>
      </Modal>

      <Card padding={false} className="mt-6" variant="table">
        <div className="p-4">
          <DataTable<any>
            columns={([
              { key: 'type', header: 'Loại' },
              { key: 'amount', header: 'Số tiền', render: (r) => `${r.amount.toLocaleString('vi-VN')} đ` },
              { key: 'householdId', header: 'Hộ gia đình' },
              { key: 'dueDate', header: 'Hạn nộp', render: (r) => r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-' },
              { key: 'paid', header: 'Trạng thái', render: (r) => r.paid ? <span className="badge-green">Đã thanh toán</span> : <span className="badge-yellow">Chưa thanh toán</span> },
              { key: 'paidAt', header: 'Thanh toán lúc', render: (r) => r.paidAt ? new Date(r.paidAt).toLocaleString() : '-' },
              { key: 'createdAt', header: 'Tạo lúc', render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : '-' },
              { key: 'actions', header: 'Thao tác', render: (r) => !r.paid && r.id ? <Button variant="green" size="sm" onClick={() => handleMarkPaid(r.id)}>Đánh dấu đã thanh toán</Button> : null },
            ]) as Column<any>[]}
            data={sortedContributions}
            emptyText="Chưa có khoản đóng góp nào"
            rowKey={(r) => r.id}
          />
        </div>
      </Card>
    </div>
  );
};
