import { useEffect, useState } from 'react';
import { usePerson } from '../../hooks/usePerson';
import { PersonForm } from '../../components/form/personForm';
import { PersonTable } from '../../components/table/personTable';
import type { Person } from '../../types/person';

export const PersonListPage = () => {
  const { persons, loading, error, fetchPersons, createPerson, updatePerson, deletePerson } = usePerson();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleSubmit = async (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id!, data);
      } else {
        await createPerson(data);
      }
      setShowForm(false);
      setEditingPerson(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deletePerson(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Persons</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPerson(null);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showForm ? 'Close Form' : 'Add Person'}
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {showForm && (
        <PersonForm
          initialData={editingPerson || undefined}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}

      <PersonTable
        persons={persons}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
};
