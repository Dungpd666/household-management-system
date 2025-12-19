import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePerson } from '../../hooks/usePerson';
import { PersonForm } from '../../components/form/personForm';
import type { Person } from '../../types/person';

export const PersonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, fetchPersonById, updatePerson, deletePerson } = usePerson();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (id) {
      fetchPersonById(id).then(setPerson);
    }
  }, [id]);

  const handleSubmit = async (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (id) {
        await updatePerson(id, data);
        navigate('/persons');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure?')) {
      try {
        await deletePerson(id);
        navigate('/persons');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!person) return <div>Person not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{person.fullName}</h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      <PersonForm initialData={person} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};
