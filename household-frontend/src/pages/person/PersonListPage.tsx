import { useEffect, useState, useRef } from 'react';
import { usePerson } from '../../hooks/usePerson';
import { useToast } from '../../hooks/useToast';
import { PersonForm } from '../../components/form/personForm';
import type { Person } from '../../types/person';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Avatar, Column } from '../../components/ui/DataTable';
import { PillDropdown } from '../../components/ui/PillDropdown';
import { Button } from '../../components/ui/Button';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { Modal } from '../../components/ui/Modal';

export const PersonListPage = () => {
  const { persons, loading, error, fetchPersons, createPerson, updatePerson, deletePerson, importFromCsv } = usePerson();
  const toast = useToast();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'permanent' | 'temporary' | 'moved'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
  fetchPersons();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error, toast]);

  const handleSubmit = async (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    // errors handled via toast
    try {
      if (editingPerson) {
        await updatePerson(String(editingPerson.id!), data);
        toast.success('Cập nhật thành viên thành công!');
      } else {
        await createPerson(data);
        toast.success('Thêm thành viên mới thành công!');
      }
      setShowForm(false);
      setEditingPerson(null);
      fetchPersons();
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi khi lưu thành viên');
    }
  };

  const handleEdit = (person: Person) => {
  setEditingPerson(person);
  setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này không?')) {
      // errors handled via toast
      try {
        await deletePerson(id);
        fetchPersons();
      } catch (err: any) {
        toast.error(err?.message || 'Có lỗi khi xóa thành viên');
      }
    }
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // errors handled via toast
    try {
      await importFromCsv(file);
      toast.success('Import dữ liệu CSV thành công!');
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi khi import dữ liệu từ CSV');
    } finally {
      // reset input để có thể chọn lại cùng một file nếu cần
      e.target.value = '';
    }
  };

  const handleExportCsv = () => {
    const rows = persons;
    if (!rows.length) {
      toast.error('Không có dữ liệu để xuất CSV');
      return;
    }

    // Cột phải khớp với backend importFromCsv:
    // 0: Họ tên
    // 1: Ngày sinh
    // 2: Giới tính
    // 3: Số định danh
    // 4: Quan hệ với chủ hộ
    // 5: Nghề nghiệp
    // 6: Trình độ học vấn
    // 7: Tình trạng cư trú
    // 8: Đã qua đời (true/false)
    // 9: ID Hộ (số id)
    const headers = [
      'Họ tên',
      'Ngày sinh',
      'Giới tính',
      'Số định danh',
      'Quan hệ với chủ hộ',
      'Nghề nghiệp',
      'Trình độ học vấn',
      'Tình trạng cư trú',
      'Đã qua đời',
      'ID Hộ',
    ];

    const escape = (value: unknown) => {
      let s = value == null ? '' : String(value);
      if (s.includes('"')) s = s.replace(/"/g, '""');
      if (/[",\n]/.test(s)) s = `"${s}"`;
      return s;
    };

    const dataLines = rows.map((p) => {
      const dob = p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '';
      const gender = p.gender === 'male' ? 'Nam' : p.gender === 'female' ? 'Nữ' : 'Khác';
      const line = [
        p.fullName,
        dob,
        gender,
        p.identificationNumber,
        p.relationshipWithHead,
        p.occupation,
        p.educationLevel,
        p.migrationStatus,
        p.isDeceased ? 'true' : 'false',
        p.household?.id ?? '',
      ];
      return line.map(escape).join(',');
    });

    const csvContent = [headers.join(','), ...dataLines].join('\n');
    // Thêm BOM UTF-8 để Excel trên Windows hiển thị tiếng Việt đúng font
    const bom = '\uFEFF';
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nhan_khau.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Chuẩn hóa tình trạng cư trú về 3 nhóm: permanent / temporary / moved
  const normalizeStatusKey = (raw?: string | null): 'permanent' | 'temporary' | 'moved' | '' => {
    if (!raw) return '';
    const v = raw.toLowerCase().trim();

    if (['permanent', 'thường trú', 'thuong tru'].includes(v)) return 'permanent';
    if (['temporary', 'tạm trú', 'tam tru'].includes(v)) return 'temporary';
    if (['moved', 'đã chuyển đi', 'da chuyen di'].includes(v)) return 'moved';

    return '';
  };

  const totalPersons = persons.length;
  const permanentCount = persons.filter(p => normalizeStatusKey(p.migrationStatus) === 'permanent').length;
  const temporaryCount = persons.filter(p => normalizeStatusKey(p.migrationStatus) === 'temporary').length;
  const movedCount = persons.filter(p => normalizeStatusKey(p.migrationStatus) === 'moved').length;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const afterSearch = !normalizedSearch
    ? persons
    : persons.filter((p) => {
        const rawValues: Array<string | undefined> = [
          p.fullName,
          p.identificationNumber,
          p.household?.householdCode,
          p.occupation,
          p.educationLevel,
        ];
        const values = rawValues
          .filter((v): v is string => typeof v === 'string' && v.length > 0)
          .map((v) => v.toLowerCase());
        return values.some((v) => v.includes(normalizedSearch));
      });

  const filteredPersons = afterSearch.filter((p) => {
    if (statusFilter === 'all') return true;
    const key = normalizeStatusKey(p.migrationStatus);
    return key === statusFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhân khẩu trong khu vực"
        subtitle="Danh sách và tình trạng di biến động của cư dân."
        actions={(
          <Button
            variant="gray"
            onClick={() => {
              setEditingPerson(null);
              setShowForm(true);
            }}
          >
            Thêm thành viên
          </Button>
        )}
      />


      <Modal
        isOpen={showForm || !!editingPerson}
        onClose={() => {
          setShowForm(false);
          setEditingPerson(null);
        }}
        title={editingPerson ? 'Cập nhật nhân khẩu' : 'Thêm thành viên'}
      >
        {(showForm || !!editingPerson) && (
          <PersonForm
            initialData={editingPerson || undefined}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        )}
      </Modal>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 flex items-start justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg bg-blue-50">
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-blue-700">Tổng nhân khẩu</div>
            <div className="text-3xl font-bold mt-1 text-blue-700">
              <AnimatedNumber value={totalPersons} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-100 text-blue-700 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5.33 0-8 2.67-8 6v2h16v-2c0-3.33-2.67-6-8-6z"/></svg>
          </div>
        </div>

        <div className="rounded-2xl p-5 flex items-start justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg bg-emerald-50">
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-emerald-700">Thường trú</div>
            <div className="text-3xl font-bold mt-1 text-emerald-700">
              <AnimatedNumber value={permanentCount} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10l8-6 8 6v8a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2v-8z"/></svg>
          </div>
        </div>

        <div className="rounded-2xl p-5 flex items-start justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg bg-amber-50">
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-amber-700">Tạm trú</div>
            <div className="text-3xl font-bold mt-1 text-amber-700">
              <AnimatedNumber value={temporaryCount} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-100 text-amber-700 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a10 10 0 1 1 10-10 10.01 10.01 0 0 1-10 10zm1-10.59V7h-2v6l5.25 3.15 1-1.65z"/></svg>
          </div>
        </div>

        <div className="rounded-2xl p-5 flex items-start justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg bg-rose-50">
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-rose-700">Đã chuyển đi</div>
            <div className="text-3xl font-bold mt-1 text-rose-700">
              <AnimatedNumber value={movedCount} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-100 text-rose-700 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4h4v-6zM14 19h2V5h-2z"/></svg>
          </div>
        </div>
      </div>

      <Card className="mt-6" padding={false} variant="table">
        <div className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã nhân khẩu, mã hộ khẩu..."
            className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PillDropdown
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as 'all' | 'permanent' | 'temporary' | 'moved')}
            options={[
              { value: 'all', label: 'Tất cả tình trạng', hint: 'tat ca · all status' },
              { value: 'permanent', label: 'Thường trú', hint: 'thuong tru · permanent' },
              { value: 'temporary', label: 'Tạm trú', hint: 'tam tru · temporary' },
              { value: 'moved', label: 'Đã chuyển đi', hint: 'da chuyen di · moved' },
            ]}
          />
          <div className="flex gap-2">
            <Button variant="gray" size="sm" onClick={handleExportCsv}>
              Xuất CSV
            </Button>
            <Button
              variant="gray"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Nhập CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportFileChange}
            />
          </div>
        </div>
      </Card>

      <Card className="mt-6" padding={false} variant="table">
        <div className="p-4">
          <DataTable<Person>
            columns={([
              { key: 'fullName', header: 'Họ tên', render: (r) => (
                <div className="flex items-center gap-3">
                  <Avatar name={r.fullName} />
                  <div className="font-medium">{r.fullName}</div>
                </div>
              )},
              { key: 'identificationNumber', header: 'CMND/CCCD', render: (r) => r.identificationNumber },
              { key: 'dateOfBirth', header: 'Ngày sinh', render: (r) => r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString() : '' },
              { key: 'gender', header: 'Giới tính', render: (r) => r.gender === 'male' ? 'Nam' : r.gender === 'female' ? 'Nữ' : 'Khác' },
              { key: 'migrationStatus', header: 'Tình trạng', render: (r) => {
                const key = normalizeStatusKey(r.migrationStatus);
                if (key === 'moved') return <span className="badge-red">Đã chuyển đi</span>;
                if (key === 'temporary') return <span className="badge-yellow">Tạm trú</span>;
                if (key === 'permanent') return <span className="badge-green">Thường trú</span>;
                return <span className="badge-yellow">{r.migrationStatus || '-'}</span>;
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
            data={filteredPersons}
            rowKey={(r) => String(r.id)}
          />
        </div>
      </Card>
    </div>
  );
};
