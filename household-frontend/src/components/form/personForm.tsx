import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Person } from '../../types/person';

interface PersonFormProps {
  initialData?: Person;
  onSubmit: (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export const PersonForm = ({ initialData, onSubmit, isLoading }: PersonFormProps) => {
  const [formData, setFormData] = useState<any>({
    fullName: initialData?.fullName || '',
    dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().slice(0,10) : '',
    gender: initialData?.gender || 'male',
    identificationNumber: initialData?.identificationNumber || '',
    relationshipWithHead: initialData?.relationshipWithHead || '',
    occupation: initialData?.occupation || '',
    educationLevel: initialData?.educationLevel || '',
    migrationStatus: initialData?.migrationStatus || '',
    isDeceased: initialData?.isDeceased || false,
    householdId: initialData?.household?.id || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const v = type === 'checkbox' ? checked : value;
    setFormData((prev: any) => ({
      ...prev,
      [name]: v,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // transform date string to ISO and householdId to number
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        householdId: formData.householdId ? Number(formData.householdId) : undefined,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Full name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date of birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Identification number</label>
        <input
          type="text"
          name="identificationNumber"
          value={formData.identificationNumber}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Relationship with household head</label>
        <input type="text" name="relationshipWithHead" value={formData.relationshipWithHead} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Occupation</label>
          <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Education level</label>
          <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Migration status</label>
        <input type="text" name="migrationStatus" value={formData.migrationStatus} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="isDeceased" name="isDeceased" checked={!!formData.isDeceased} onChange={handleChange} />
        <label htmlFor="isDeceased" className="text-sm">Is deceased</label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Household ID</label>
        <input
          type="number"
          name="householdId"
          value={formData.householdId}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
};
