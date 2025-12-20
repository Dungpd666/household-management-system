import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PersonProvider } from '../context/PersonContext';
import { HouseholdProvider } from '../context/HouseholdContext';
import { ContributionProvider } from '../context/ContributionContext';
import { UsersProvider } from '../context/UsersContext';
import { PopulationEventProvider } from '../context/PopulationEventContext';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';
import { PersonListPage } from '../pages/person/PersonListPage';
import { PersonDetailPage } from '../pages/person/PersonDetailPage';
import { PersonCreatePage } from '../pages/person/PersonCreatePage';
import { HouseholdListPage } from '../pages/household/HouseholdListPage';
import { HouseholdDetailPage } from '../pages/household/HouseholdDetailPage';
import { HouseholdCreatePage } from '../pages/household/HouseholdCreatePage';
import { ContributionListPage } from '../pages/contribution/ContributionListPage';
import { UsersListPage } from '../pages/users/UsersListPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PopulationEventListPage } from '../pages/population-event/PopulationEventListPage';
import { RoleManagementPage } from '../pages/roles/RoleManagementPage';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/ui/Button';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { FieldHint } from '../components/ui/FieldHint';
import type { User } from '../types/users';

// Pages - Placeholder
const StatCard = ({ label, value, href, color }: { label: string; value: string; href: string; color: string }) => (
  <a href={href} className="rounded-xl bg-white shadow-md shadow-slate-200/60 hover:shadow-lg transition block">
    <div className="p-5">
      <div className="text-textc-secondary text-sm">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
    <div className={`px-5 py-2 text-xs tracking-wide uppercase ${color} text-white font-medium`}>Xem chi tiết →</div>
  </a>
);

const Dashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.userRole === 'superadmin';

  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState({
    fullName: '',
    userName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin, fetchUsers]);

  const resetForm = () => {
    setEditingId(null);
    setFormValues({
      fullName: '',
      userName: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
    });
    setFormError(null);
    setFormSuccess(null);
    setShowUserForm(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id ?? null);
    setFormValues({
      fullName: u.fullName,
      userName: u.userName,
      email: u.email,
      phone: u.phone,
      password: '',
      role: u.role === 'superadmin' ? 'superadmin' : u.role,
    });
    setFormError(null);
    setFormSuccess(null);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (u: User) => {
    const confirm = window.confirm(`Bạn có chắc muốn xóa người dùng "${u.fullName}"?`);
    if (!confirm) return;

    setFormError(null);
    setFormSuccess(null);
    try {
      await deleteUser(String(u.id));
      setFormSuccess('Xóa người dùng thành công');
    } catch (err: any) {
      setFormError(err?.message || 'Có lỗi khi xóa người dùng');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!isSuperAdmin) return;

    const { fullName, userName, email, phone, password, role } = formValues;

    if (!fullName || !userName || !email || !phone) {
      setFormError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (editingId) {
        const payload: Partial<User> = {
          fullName,
          userName,
          email,
          phone,
          role,
        };
        if (password) {
          payload.passWordHash = password;
        }
        await updateUser(String(editingId), payload);
        setFormSuccess('Cập nhật người dùng thành công');
      } else {
        const payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
          fullName,
          userName,
          email,
          phone,
          passWordHash: password || '123456',
          role,
        };
        await createUser(payload);
        setFormSuccess('Tạo người dùng mới thành công');
      }
      setFormValues((prev) => ({ ...prev, password: '' }));
    } catch (err: any) {
      setFormError(err?.message || 'Có lỗi xảy ra khi lưu người dùng');
    }
  };

  const columns: Column<User>[] = [
    { key: 'fullName', header: 'Họ tên' },
    { key: 'userName', header: 'Tên đăng nhập' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'SĐT' },
    {
      key: 'role',
      header: 'Vai trò',
      render: (u) => (
        <select
          className="border border-border rounded-full px-3 py-1 text-xs bg-white cursor-pointer"
          value={u.role}
          onChange={async (e) => {
            const newRole = e.target.value;
            if (newRole === u.role) return;
            setFormError(null);
            setFormSuccess(null);
            try {
              await updateUser(String(u.id), { role: newRole });
              setFormSuccess('Cập nhật vai trò thành công');
            } catch (err: any) {
              setFormError(err?.message || 'Có lỗi khi cập nhật vai trò');
            }
          }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (u) => (
        <div className="flex gap-2">
          <Button
            variant="gray"
            size="sm"
            onClick={() => handleEdit(u)}
          >
            Sửa
          </Button>
          <Button
            variant="gray"
            size="sm"
            onClick={() => handleDeleteUser(u)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Nhân khẩu" value="—" href="/persons" color="bg-blue-600" />
        <StatCard label="Hộ gia đình" value="—" href="/households" color="bg-green-600" />
        <StatCard label="Đóng góp" value="—" href="/contributions" color="bg-purple-600" />
        <StatCard label="Người dùng" value="—" href="/users" color="bg-orange-600" />
      </div>

      {isSuperAdmin && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-textc-primary">Quản trị người dùng</h2>
            <Button
              variant="gray"
              size="sm"
              onClick={() => {
                resetForm();
                setShowUserForm(true);
              }}
            >
              Thêm người dùng
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Tổng người dùng</div>
              <div className="text-2xl font-semibold text-textc-primary">{users.length}</div>
            </Card>
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Superadmin</div>
              <div className="text-2xl font-semibold text-emerald-500">{users.filter((u) => u.role === 'superadmin').length}</div>
            </Card>
            <Card className="bg-surface-base" padding>
              <div className="text-[12px] font-medium text-textc-secondary mb-1">Admin & User</div>
              <div className="text-2xl font-semibold text-brand-purple">{users.filter((u) => u.role !== 'superadmin').length}</div>
            </Card>
          </div>

          <Modal
            isOpen={showUserForm}
            onClose={resetForm}
            title={editingId ? 'Chỉnh sửa người dùng' : 'Thêm mới người dùng'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
                {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">{formError}</div>}
                {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">{formSuccess}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldHint
                    label="Họ và tên"
                    hint="Nhập đầy đủ họ và tên, ví dụ: Nguyễn Văn A. Không để trống."
                  >
                    <input
                      type="text"
                      name="fullName"
                      value={formValues.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                      required
                    />
                  </FieldHint>
                  <FieldHint
                    label="Tên đăng nhập"
                    hint="Chuỗi không có dấu cách, không dấu, ví dụ: admin01. Phải là duy nhất."
                  >
                    <input
                      type="text"
                      name="userName"
                      value={formValues.userName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                      required
                    />
                  </FieldHint>
                  <FieldHint
                    label="Email"
                    hint="Email hợp lệ, ví dụ: tennguoidung@tenmien.com. Mỗi email chỉ dùng cho một tài khoản."
                  >
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                      required
                    />
                  </FieldHint>
                  <FieldHint
                    label="Số điện thoại"
                    hint="Số di động Việt Nam 10 chữ số, bắt đầu bằng 0, ví dụ: 0912345678. Mỗi số chỉ dùng cho một tài khoản."
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                      required
                    />
                  </FieldHint>
                  <FieldHint
                    label={editingId ? 'Mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
                    hint="Tối thiểu 6 ký tự, nên dùng cả chữ và số. Ví dụ: Quanly123."
                  >
                    <input
                      type="password"
                      name="password"
                      value={formValues.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/60 focus:border-brand-primary/50"
                    />
                  </FieldHint>
                  <FieldHint
                    label="Vai trò"
                    hint="Chọn đúng quyền của tài khoản: User (cán bộ thường), Admin (quản trị), Superadmin (toàn quyền hệ thống)."
                  >
                    <select
                      name="role"
                      value={formValues.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-full text-sm cursor-pointer bg-white/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/40"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </FieldHint>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {editingId && (
                    <Button type="button" variant="gray" onClick={resetForm}>
                      Hủy chỉnh sửa
                    </Button>
                  )}
                  <Button type="submit" variant="primary">
                    {editingId ? 'Lưu thay đổi' : 'Thêm người dùng'}
                  </Button>
                </div>
              </form>
          </Modal>

          <Card padding={false} className="mt-4" variant="table">
            <div className="p-4">
              {loading && <div className="text-sm">Đang tải danh sách người dùng...</div>}
              {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
              <DataTable<User>
                columns={columns}
                data={users}
                emptyText="Chưa có người dùng"
                rowKey={(r) => r.id as number}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PersonProvider>
          <HouseholdProvider>
            <ContributionProvider>
              <PopulationEventProvider>
                <UsersProvider>
                <div className="min-h-screen app-shell flex">
                  {/* Sidebar full height, kéo theo toàn bộ chiều cao nội dung */}
                  <div className="hidden md:block w-60 xl:w-64 bg-slate-950 text-white">
                    <Sidebar />
                  </div>

                  {/* Cột phải: header + nội dung */}
                  <div className="flex-1 flex flex-col p-4 gap-4">
                    {/* Header cố định vị trí, dịch lên gần đỉnh hơn một chút */}
                    <div className="mt-0.5">
                      <Card padding={true}>
                        <Header />
                      </Card>
                    </div>

                    {/* Content bên dưới */}
                    <Card className="flex-1" padding={false}>
                      <main className="p-6">
                      <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      
                      {/* Dashboard (protected) */}
                      <Route
                        path="/"
                        element={(
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Person Routes (protected) */}
                      <Route
                        path="/persons"
                        element={(
                          <ProtectedRoute>
                            <PersonListPage />
                          </ProtectedRoute>
                        )}
                      />
                      <Route
                        path="/persons/new"
                        element={(
                          <ProtectedRoute>
                            <PersonCreatePage />
                          </ProtectedRoute>
                        )}
                      />
                      <Route
                        path="/persons/:id"
                        element={(
                          <ProtectedRoute>
                            <PersonDetailPage />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Household Routes (protected) */}
                      <Route
                        path="/households"
                        element={(
                          <ProtectedRoute>
                            <HouseholdListPage />
                          </ProtectedRoute>
                        )}
                      />
                      <Route
                        path="/households/new"
                        element={(
                          <ProtectedRoute>
                            <HouseholdCreatePage />
                          </ProtectedRoute>
                        )}
                      />
                      <Route
                        path="/households/:id"
                        element={(
                          <ProtectedRoute>
                            <HouseholdDetailPage />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Contribution Routes (protected) */}
                      <Route
                        path="/contributions"
                        element={(
                          <ProtectedRoute>
                            <ContributionListPage />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Population Events Routes (protected) */}
                      <Route
                        path="/population-events"
                        element={(
                          <ProtectedRoute>
                            <PopulationEventListPage />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Role Management Routes (admin only) */}
                      <Route
                        path="/roles"
                        element={(
                          <ProtectedRoute requiredRole="admin">
                            <RoleManagementPage />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Users Routes (protected) - vẫn giữ cho xem danh sách chi tiết nếu cần */}
                      <Route
                        path="/users"
                        element={(
                          <ProtectedRoute>
                            <UsersListPage />
                          </ProtectedRoute>
                        )}
                      />

                      {/* Profile (protected) */}
                      <Route
                        path="/me"
                        element={(
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        )}
                      />
                      
                      {/* Catch all */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                      </main>
                      <div className="px-6 pb-6"><Footer /></div>
                    </Card>
                  </div>
                </div>
              </UsersProvider>
              </PopulationEventProvider>
            </ContributionProvider>
          </HouseholdProvider>
        </PersonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
