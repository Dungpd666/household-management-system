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

  useEffect(() => {
    fetchContributions();
    fetchHouseholds();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    try {
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
              <input type="text" name="type" value={formData.type} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Số tiền (VND)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Hạn nộp (tùy chọn)</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-textc-secondary">Hộ gia đình</label>
              <select name="householdId" value={formData.householdId} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl text-sm">
                <option value="" disabled>Chọn hộ gia đình</option>
                {households.map(h => (
                  <option key={h.id} value={h.id}>{h.householdCode} - {h.address}</option>
                ))}
              </select>
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
