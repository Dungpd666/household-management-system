import { useState, useEffect } from 'react';
import { usePopulationEvent } from '../../hooks/usePopulationEvent';
import { usePerson } from '../../hooks/usePerson';
import { PopulationEvent } from '../../api/populationEventApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import PageHeader from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { useNavigate } from 'react-router-dom';

export default function PopulationEventListPage() {
  const navigate = useNavigate();
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = usePopulationEvent();
  const { persons } = usePerson();
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

  const handleOpenModal = (event?: PopulationEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        type: event.type,
        description: event.description || '',
        eventDate: event.eventDate,
        personId: 0,
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
      if (editingEvent?.id) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
      }
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      alert('Error saving event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (err) {
        alert('Error deleting event: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: string) => <span className="capitalize">{value}</span>
    },
    { key: 'description', label: 'Description' },
    { key: 'eventDate', label: 'Event Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: PopulationEvent) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => row.id && handleDelete(row.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const eventTypes = ['Birth', 'Death', 'Marriage', 'Divorce', 'Migration', 'Other'];

  return (
    <div className="space-y-6">
      <PageHeader title="Population Events" subtitle="Manage population events" />

      {error && (
        <Card className="bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + New Event
          </Button>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DataTable
            data={events.map(e => ({
              id: e.id,
              type: e.type,
              description: e.description,
              eventDate: e.eventDate,
              actions: '',
            }))}
            columns={columns}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Event' : 'New Population Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a type</option>
              {eventTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Date</label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingEvent ? 'Update' : 'Create'} Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
