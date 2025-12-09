
import { useEffect, useState } from 'react';
import { usePerson } from '../../hooks/usePerson';
import { PersonForm } from '../../components/form/personForm';
import type { Person } from '../../types/person';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Avatar, StatusBadge, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';

export const PersonListPage = () => {
  const { persons, loading, error, fetchPersons, createPerson, updatePerson, deletePerson } = usePerson();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
  fetchPersons();
  }, []);

  const handleSubmit = async (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    setFormError('');
    setSuccessMsg('');
    try {
      if (editingPerson) {
        await updatePerson(String(editingPerson.id!), data);
        setSuccessMsg('Cập nhật thành viên thành công!');
      } else {
        await createPerson(data);
        setSuccessMsg('Thêm thành viên mới thành công!');
      }
      setShowForm(false);
      setEditingPerson(null);
      fetchPersons();
    } catch (err: any) {
      setFormError(err?.message || 'Có lỗi khi lưu thành viên');
    }
  };

  const handleEdit = (person: Person) => {
  setEditingPerson(person);
  setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này không?')) {
      setFormError('');
      setSuccessMsg('');
      try {
        await deletePerson(id);
        setSuccessMsg('Xóa thành viên thành công!');
        fetchPersons();
      } catch (err: any) {
        setFormError(err?.message || 'Có lỗi khi xóa thành viên');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhân khẩu trong khu vực"
        subtitle="Danh sách và tình trạng di biến động của cư dân."
        actions={(
          <Button
            variant="gray"
            onClick={() => {
              setShowForm(!showForm);
              setEditingPerson(null);
            }}
          >
            {showForm ? 'Đóng form' : 'Thêm thành viên'}
          </Button>
        )}
      />
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{formError}</div>}
      {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMsg}</div>}

      {showForm && (
        <PersonForm
          initialData={editingPerson || undefined}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Tổng nhân khẩu</div>
          <div className="text-2xl font-semibold text-textc-primary">{persons.length}</div>
        </Card>
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Thường trú</div>
          <div className="text-2xl font-semibold text-emerald-500">{persons.filter(p => p.migrationStatus === 'permanent').length}</div>
        </Card>
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Tạm trú</div>
          <div className="text-2xl font-semibold text-amber-500">{persons.filter(p => p.migrationStatus === 'temporary').length}</div>
        </Card>
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Đã chuyển đi</div>
          <div className="text-2xl font-semibold text-rose-500">{persons.filter(p => p.migrationStatus === 'moved').length}</div>
        </Card>
      </div>

      <Card className="mt-6" padding={false} variant="table">
        <div className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã nhân khẩu, mã hộ khẩu..."
            className="flex-1 border border-border rounded-full px-4 py-2.5 text-[13px] bg-surface-subtle"
            onChange={() => { /* TODO search */ }}
          />
          <select
            className="border border-border rounded-full px-4 py-2.5 text-[13px] bg-white"
            defaultValue="Tất cả tình trạng"
            onChange={() => { /* TODO filter */ }}
          >
            <option value="Tất cả tình trạng">Tất cả tình trạng</option>
            <option value="permanent">Thường trú</option>
            <option value="temporary">Tạm trú</option>
            <option value="moved">Đã chuyển đi</option>
          </select>
        </div>
      </Card>

      <Card className="mt-6" padding={false} variant="table">
        <div className="p-4">
          <DataTable<Person>
            columns={([
              { key: 'fullName', header: 'Họ tên', render: (r) => (
                <div className="flex items-center gap-3">
                  <Avatar name={r.fullName} />
                  <div>
                    <div className="font-medium">{r.fullName}</div>
                    <div className="text-[11px] text-textc-faint">{r.identificationNumber}</div>
                  </div>
                </div>
              )},
              { key: 'dateOfBirth', header: 'Ngày sinh', render: (r) => r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString() : '' },
              { key: 'gender', header: 'Giới tính', render: (r) => r.gender === 'male' ? 'Nam' : r.gender === 'female' ? 'Nữ' : 'Khác' },
              { key: 'migrationStatus', header: 'Tình trạng', render: (r) => {
                const map: Record<string, { label: string; tone: 'green'|'yellow'|'red'|'gray' }> = {
                  permanent: { label: 'Thường trú', tone: 'green' },
                  temporary: { label: 'Tạm trú', tone: 'yellow' },
                  moved: { label: 'Đã chuyển đi', tone: 'red' },
                };
                const key = r.migrationStatus || '';
                const info: { label: string; tone: 'green'|'yellow'|'red'|'gray' } = key && map[key] ? map[key] : { label: r.migrationStatus || '-', tone: 'gray' };
                return <StatusBadge label={info.label} tone={info.tone} />;
              } },
              { key: 'occupation', header: 'Nghề nghiệp' },
              { key: 'educationLevel', header: 'Học vấn' },
              { key: 'relationshipWithHead', header: 'Quan hệ', render: (r) => r.relationshipWithHead },
              { key: 'isDeceased', header: 'Qua đời', render: (r) => r.isDeceased ? 'Có' : 'Không' },
              { key: 'household', header: 'Hộ gia đình', render: (r) => r.household?.householdCode || '' },
              { key: 'actions', header: 'Thao tác', render: (r) => (
                <div className="flex gap-2 flex-wrap -ml-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="cursor-pointer text-brand-purple bg-brand-purpleSoft hover:bg-brand-purple/10 hover:shadow px-3 py-1 text-xs font-medium rounded-lg transition"
                    title="Sửa"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(String(r.id!))}
                    className="cursor-pointer text-rose-600 bg-rose-50 hover:bg-rose-100 hover:shadow px-3 py-1 text-xs font-medium rounded-lg transition"
                    title="Xóa"
                  >
                    Xóa
                  </button>
                </div>
              )},
            ]) as Column<Person>[]}
            data={persons}
            rowKey={(r) => String(r.id)}
          />
        </div>
      </Card>
    </div>
  );
};
