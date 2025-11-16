import type { Person } from '../../types/person';

interface PersonTableProps {
  persons: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const PersonTable = ({ persons, onEdit, onDelete, isLoading }: PersonTableProps) => {
  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Household ID</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-3">{person.name}</td>
              <td className="px-6 py-3">{person.email}</td>
              <td className="px-6 py-3">{person.phone}</td>
              <td className="px-6 py-3">{person.householdId}</td>
              <td className="px-6 py-3 space-x-2">
                <button
                  onClick={() => onEdit(person)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(person.id!)}
                  disabled={isLoading}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {persons.length === 0 && (
        <div className="p-6 text-center text-gray-500">No persons found</div>
      )}
    </div>
  );
};
