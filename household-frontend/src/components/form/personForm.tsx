import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Person } from '../../types/person';
import { useHousehold } from '../../hooks/useHousehold';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PersonFormProps {
  initialData?: Person;
  onSubmit: (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export const PersonForm = ({ initialData, onSubmit, isLoading }: PersonFormProps) => {
  // Load households for dropdown selection
  const { households, fetchHouseholds } = useHousehold?.() || { households: [], fetchHouseholds: undefined } as any;
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
  const [idError, setIdError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const v = type === 'checkbox' ? checked : value;
    setFormData((prev: any) => ({
      ...prev,
      [name]: v,
    }));
    if (name === 'identificationNumber') {
      const val = String(v);
      if (!/^\d*$/.test(val)) {
        setIdError('Chỉ nhập ký tự số');
      } else if (val.length > 0 && (val.length < 9 || val.length > 12)) {
        setIdError('Độ dài phải từ 9 đến 12 chữ số');
      } else {
        setIdError('');
      }
    }
  };

  useEffect(() => {
    if (fetchHouseholds) {
      fetchHouseholds().catch(() => void 0);
    }
  }, [fetchHouseholds]);

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
      if (idError) {
        throw new Error('Vui lòng sửa số CMND/CCCD trước khi gửi');
      }
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Card padding={false} variant="table">
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Họ và tên</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ngày sinh</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Giới tính</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded">
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Số CMND/CCCD</label>
        <input
          type="text"
          name="identificationNumber"
          value={formData.identificationNumber}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 border border-gray-300 rounded ${idError ? 'border-red-500' : ''}`}
          placeholder="Nhập 9-12 chữ số"
        />
        {idError && <p className="text-xs text-red-600 mt-1">{idError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Quan hệ với chủ hộ</label>
        <input type="text" name="relationshipWithHead" value={formData.relationshipWithHead} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nghề nghiệp</label>
          <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Trình độ học vấn</label>
          <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Tình trạng cư trú</label>
        <input type="text" name="migrationStatus" value={formData.migrationStatus} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="isDeceased" name="isDeceased" checked={!!formData.isDeceased} onChange={handleChange} />
        <label htmlFor="isDeceased" className="text-sm">Đã qua đời</label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Hộ gia đình</label>
        <select
          name="householdId"
          value={formData.householdId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">-- Không chọn --</option>
          {Array.isArray(households) && households.map((h: any) => (
            <option key={h.id} value={h.id}>{h.householdCode || h.id}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={isLoading} variant="gray" full>
        {isLoading ? 'Đang lưu...' : 'Gửi'}
      </Button>
    </form>
    </Card>
  );
};
