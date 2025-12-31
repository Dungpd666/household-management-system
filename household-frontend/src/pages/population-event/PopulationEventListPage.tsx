import { useState, useEffect } from 'react';
import { usePopulationEvent } from '../../hooks/usePopulationEvent';
import { usePerson } from '../../hooks/usePerson';
import { PopulationEvent } from '../../api/populationEventApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../hooks/useToast';

export const PopulationEventListPage = () => {
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = usePopulationEvent();
  const { persons, fetchPersons } = usePerson();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PopulationEvent | null>(null);
  const [formData, setFormData] = useState<Omit<PopulationEvent, 'id'>>({
    type: '',
    description: '',
    eventDate: new Date().toISOString().split('T')[0],
    personId: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchPersons();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error, toast]);

  const handleOpenModal = (event?: PopulationEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        type: event.type,
        description: event.description || '',
        eventDate: event.eventDate,
        personId: event.person?.id ?? event.personId ?? 0,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        type: '',
        description: '',
        eventDate: new Date().toISOString().split('T')[0],
        personId: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      type: '',
      description: '',
      eventDate: new Date().toISOString().split('T')[0],
      personId: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pid = Number(formData.personId);
      if (!Number.isFinite(pid) || pid <= 0) {
        throw new Error('Vui lòng chọn nhân khẩu');
      }

      if (editingEvent?.id) {
        await updateEvent(editingEvent.id, { ...formData, personId: pid });
        toast.success('Cập nhật sự kiện dân số thành công!');
      } else {
        await createEvent({ ...formData, personId: pid });
        toast.success('Tạo sự kiện dân số thành công!');
      }
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi lưu sự kiện');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sự kiện này không?')) {
      try {
        await deleteEvent(id);
        toast.success('Xóa sự kiện dân số thành công!');
        fetchEvents();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Lỗi khi xóa sự kiện');
      }
    }
  };

  const eventTypes = [
    { label: 'Khai sinh', value: 'birth' },
    { label: 'Khai tử', value: 'death' },
    { label: 'Chuyển hộ khẩu', value: 'change_household' },
    { label: 'Tạm vắng', value: 'absence' },
    { label: 'Trở về', value: 'return' },
  ];

  const eventTypeLabel = (value: string) => eventTypes.find((t) => t.value === value)?.label ?? value;

  const eventTypeBadgeClass = (value: string) => {
    if (value === 'death') return 'badge-red';
    if (value === 'birth' || value === 'return') return 'badge-green';
    return 'badge-yellow';
  };

  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'person',
      header: 'Nhân khẩu',
      render: (row: PopulationEvent) => row.person?.fullName || (row.personId ? `ID: ${row.personId}` : '-'),
    },
    {
      key: 'type',
      header: 'Loại',
      render: (row: PopulationEvent) => (
        <span className={eventTypeBadgeClass(row.type)}>{eventTypeLabel(row.type)}</span>
      ),
    },
    {
      key: 'description',
      header: 'Mô tả',
      render: (row: PopulationEvent) => row.description || '-',
    },
    {
      key: 'eventDate',
      header: 'Ngày',
      render: (row: PopulationEvent) => row.eventDate ? new Date(row.eventDate).toLocaleDateString() : '',
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row: PopulationEvent) => (
        <div className="flex gap-2 flex-wrap -ml-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="cursor-pointer text-brand-purple bg-brand-purpleSoft hover:bg-brand-purple/10 hover:shadow px-3 py-1 text-xs font-medium rounded-lg transition"
            title="Sửa"
          >
            Sửa
          </button>
          <button
            onClick={() => row.id && handleDelete(row.id)}
            className="cursor-pointer text-rose-600 bg-rose-50 hover:bg-rose-100 hover:shadow px-3 py-1 text-xs font-medium rounded-lg transition"
            title="Xóa"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biến động dân số"
        subtitle="Danh sách các sự kiện biến động nhân khẩu."
        actions={(
          <Button
            variant="gray"
            onClick={() => handleOpenModal()}
          >
            Thêm sự kiện
          </Button>
        )}
      />

      <Card className="mt-6" padding={false} variant="table">
        {loading ? (
          <div className="text-center py-8 text-textc-secondary">Đang tải...</div>
        ) : (
          <div className="p-4">
            <DataTable<PopulationEvent>
              data={events}
              columns={columns}
              rowKey={(r) => r.id ?? `${r.type}-${r.eventDate}`}
              emptyText="Chưa có sự kiện dân số"
            />
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Cập nhật sự kiện dân số' : 'Thêm sự kiện dân số'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textc-secondary">Loại sự kiện</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full border border-slate-200 rounded-full px-4 py-2.5 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
            >
              <option value="">Chọn loại sự kiện</option>
              {eventTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-textc-secondary">Nhân khẩu</label>
            <select
              value={String(formData.personId || '')}
              onChange={(e) => setFormData({ ...formData, personId: Number(e.target.value) })}
              required
              className="w-full border border-slate-200 rounded-full px-4 py-2.5 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
            >
              <option value="">Chọn nhân khẩu</option>
              {(Array.isArray(persons) ? persons : []).map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-textc-secondary">Ngày sự kiện</label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              required
              className="w-full border border-slate-200 rounded-full px-4 py-2.5 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textc-secondary">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="gray" size="sm" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" size="sm">
              {editingEvent ? 'Cập nhật' : 'Tạo'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
