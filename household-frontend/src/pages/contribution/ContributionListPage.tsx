import { useEffect, useState } from 'react';
import { useContribution } from '../../hooks/useContribution';
import { useHousehold } from '../../hooks/useHousehold';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';

export const ContributionListPage = () => {
  const { contributions, loading, error, fetchContributions, createContribution, markPaid } = useContribution();
  const { households, fetchHouseholds } = useHousehold();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    amount: 0,
    dueDate: '',
    householdId: '' as string | number,
  });
  const [householdQuery, setHouseholdQuery] = useState('');
  const [householdFocused, setHouseholdFocused] = useState(false);

  useEffect(() => {
    fetchContributions();
    fetchHouseholds();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    try {
      if (!formData.householdId) {
        throw new Error('Vui lòng chọn hộ gia đình từ gợi ý');
      }
      const dto = {
        type: formData.type,
        amount: Number(formData.amount),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        householdIds: [Number(formData.householdId)],
      };
      await createContribution(dto);
      setSuccessMsg('Tạo khoản đóng góp thành công!');
      setShowForm(false);
      setFormData({ type: '', amount: 0, dueDate: '', householdId: '' });
      setHouseholdQuery('');
      fetchContributions();
    } catch (err: any) {
      setFormError(err?.message || 'Lỗi khi tạo khoản đóng góp');
    }
  };

  const handleMarkPaid = async (id: number) => {
    setFormError('');
    setSuccessMsg('');
    try {
      await markPaid(String(id), { paidAt: new Date().toISOString() });
      setSuccessMsg('Đã đánh dấu đã thanh toán');
      fetchContributions();
    } catch (err: any) {
      setFormError(err?.message || 'Lỗi khi cập nhật thanh toán');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý đóng góp cộng đồng"
        subtitle="Theo dõi các khoản thu theo từng hộ gia đình."
        actions={(
          <Button variant="gray" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng form' : 'Tạo khoản đóng góp'}
          </Button>
        )}
      />

      {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{formError}</div>}
      {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMsg}</div>}

      {showForm && (
        <Card className="max-w-xl mx-auto" padding={false} header={<>Tạo khoản đóng góp</>} headerGradient>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Loại đóng góp</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Số tiền (VND)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Hạn nộp (tùy chọn)</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Hộ gia đình</label>
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
                {householdFocused && householdSuggestions.length > 0 && (
                  <div className="absolute z-30 mt-2 left-0 right-0 rounded-2xl bg-white shadow-lg shadow-slate-200 border border-slate-100 max-h-64 overflow-y-auto">
                    {householdSuggestions.map((h: any) => (
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
            </div>
          </div>
          <Button type="submit" variant="primary" full>Tạo</Button>
        </form>
        </Card>
      )}

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
            data={contributions}
            emptyText="Chưa có khoản đóng góp nào"
            rowKey={(r) => r.id}
          />
        </div>
      </Card>
    </div>
  );
};
