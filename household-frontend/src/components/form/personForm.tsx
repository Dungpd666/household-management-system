import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Person } from '../../types/person';
import { useHousehold } from '../../hooks/useHousehold';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FieldHint } from '../ui/FieldHint';
import { PillDropdown } from '../ui/PillDropdown';

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
  const [householdQuery, setHouseholdQuery] = useState<string>(initialData?.household?.householdCode || '');
  const [householdFocused, setHouseholdFocused] = useState(false);
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

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();

  const householdSuggestions = Array.isArray(households)
    ? (() => {
        if (!householdQuery) return households.slice(0, 5);
        const q = normalize(householdQuery);
        return households
          .filter((h: any) => {
            const code = normalize(String(h.householdCode || ''));
            const address = normalize(String(h.address || ''));
            return code.includes(q) || address.includes(q);
          })
          .slice(0, 8);
      })()
    : [];

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
      <FieldHint
        label="Họ và tên"
        hint="Nhập đầy đủ họ tên theo giấy tờ tùy thân, ví dụ: Nguyễn Văn A. Không để trống."
      >
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
        />
      </FieldHint>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <FieldHint
            label="Ngày sinh"
            hint="Chọn đúng ngày, tháng, năm sinh theo định dạng lịch."
          >
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
            />
          </FieldHint>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Giới tính</label>
          <PillDropdown
            value={formData.gender}
            onChange={(val) => setFormData((prev: any) => ({ ...prev, gender: val }))}
            options={[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
              { value: 'other', label: 'Khác' },
            ]}
            placeholder="Chọn giới tính"
            buttonClassName="w-full h-10 flex items-center justify-between gap-2 border border-slate-200 rounded-full px-4 text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 cursor-pointer"
          />
        </div>
      </div>

      <FieldHint
        label="Số CMND/CCCD"
        hint="Chỉ nhập số, độ dài từ 9 đến 12 chữ số, ví dụ: 0123456789."
      >
        <div>
          <input
            type="text"
            name="identificationNumber"
            value={formData.identificationNumber}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 ${idError ? 'border-red-500' : ''}`}
            placeholder="Nhập 9-12 chữ số"
          />
          {idError && <p className="text-xs text-red-600 mt-1">{idError}</p>}
        </div>
      </FieldHint>

      <div>
        <label className="block text-sm font-medium mb-2">Quan hệ với chủ hộ</label>
        <input
          type="text"
          name="relationshipWithHead"
          value={formData.relationshipWithHead}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nghề nghiệp</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Trình độ học vấn</label>
          <input
            type="text"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-full bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tình trạng cư trú</label>
        <PillDropdown
          value={formData.migrationStatus || ''}
          onChange={(val) => setFormData((prev: any) => ({ ...prev, migrationStatus: val }))}
          options={[
            { value: 'Thường trú', label: 'Thường trú' },
            { value: 'Tạm trú', label: 'Tạm trú' },
            { value: 'Đã chuyển đi', label: 'Đã chuyển đi' },
          ]}
          placeholder="Chọn tình trạng cư trú"
          buttonClassName="w-full h-10 flex items-center justify-between gap-2 border border-slate-200 rounded-full px-4 text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tình trạng sinh tử</label>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-subtle px-4 py-3 border border-slate-200">
          <div>
            <div className="text-sm font-medium text-slate-900">Đã qua đời chưa?</div>
            <div className="text-xs text-slate-500">Nếu người này đã qua đời, hãy đánh dấu để hệ thống ghi nhận.</div>
          </div>
          <button
            type="button"
            onClick={() => setFormData((prev: any) => ({ ...prev, isDeceased: !prev.isDeceased }))}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
              formData.isDeceased
                ? 'bg-red-50 text-rose-600 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {formData.isDeceased ? 'Đã qua đời' : 'Chưa qua đời'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Hộ gia đình</label>
        <div className="relative">
          <input
            type="text"
            value={householdQuery}
            onChange={(e) => {
              const val = e.target.value;
              setHouseholdQuery(val);
              setFormData((prev: any) => ({ ...prev, householdId: '' }));
            }}
            onFocus={() => setHouseholdFocused(true)}
            onBlur={() => {
              setTimeout(() => setHouseholdFocused(false), 120);
            }}
            placeholder="Gõ mã hộ để tìm, ví dụ: HK123"
            className="w-full border border-slate-200 rounded-full px-4 py-2.5 text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50 placeholder:text-slate-400"
          />
          {householdFocused && householdSuggestions.length > 0 && (
            <div className="absolute z-30 mt-2 left-0 right-0 rounded-2xl bg-white shadow-lg shadow-slate-200 border border-slate-100 max-h-64 overflow-y-auto">
              {householdSuggestions.map((h: any) => (
                <button
                  key={h.id}
                  type="button"
                  className="w-full flex flex-col items-start px-3 py-2 text-left hover:bg-slate-50 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setHouseholdQuery(h.householdCode || String(h.id));
                    setFormData((prev: any) => ({ ...prev, householdId: String(h.id) }));
                    setHouseholdFocused(false);
                  }}
                >
                  <span className="text-[13px] font-medium text-slate-900">{h.householdCode || `Hộ ${h.id}`}</span>
                  {h.address && (
                    <span className="mt-0.5 text-[11px] text-slate-400 truncate max-w-full">{h.address}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={isLoading} variant="gray" full>
        {isLoading ? 'Đang lưu...' : 'Gửi'}
      </Button>
    </form>
    </Card>
  );
};
