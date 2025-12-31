import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
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
import { ProfilePage } from '../pages/profile/ProfilePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { HouseholdLoginPage } from '../pages/auth/HouseholdLoginPage';
import { HouseholdDashboard } from '../pages/household-portal/HouseholdDashboard';
import { HouseholdPayment } from '../pages/household-portal/HouseholdPayment';
import { PaymentResult } from '../pages/household-portal/PaymentResult';
import { HouseholdChangePasswordPage } from '../pages/household-portal/HouseholdChangePasswordPage';
import { ProtectedRoute } from './ProtectedRoute';
import { HouseholdProtectedRoute } from './HouseholdProtectedRoute';
import { PopulationEventListPage } from '../pages/population-event/PopulationEventListPage';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { useToast } from '../hooks/useToast';
import type { AuthUser } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { FieldHint } from '../components/ui/FieldHint';
import type { User } from '../types/users';
import { personApi } from '../api/personApi';
import { householdApi } from '../api/householdApi';
import { populationEventApi } from '../api/populationEventApi';
import type { Person } from '../types/person';
import type { Household } from '../types/household';
import type { PopulationEvent } from '../api/populationEventApi';
import {
  buildAgeStructure,
  buildHouseholdSizeDistribution,
  buildPopulationMovement,
  buildPopulationOverview,
  type DashboardStats,
} from '../utils/dashboardStats';
import { PopulationOverviewCard } from '../components/dashboard/charts/PopulationOverviewCard';
import { AgeStructureCard } from '../components/dashboard/charts/AgeStructureCard';
// Movement Flow chart intentionally not shown on Overview
import { HouseholdSizeDistributionCard } from '../components/dashboard/charts/HouseholdSizeDistributionCard';
import { ChatWidget } from '../components/chat/ChatWidget';

const StatIcon = ({ name }: { name: 'person' | 'household' | 'donate' | 'population' }) => {
  const base = 'w-5 h-5';
  switch (name) {
    case 'household':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M4 10l8-6 8 6v8a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2v-8z"/></svg>
      );
    case 'donate':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.49 4.49 0 0 1 6.5 4 4.93 4.93 0 0 1 12 6.09 4.93 4.93 0 0 1 17.5 4 4.49 4.49 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
      );
    case 'population':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-3.33 0-6 1.67-6 5v2h8v-2c0-2.21.9-3.67 2.33-4.58A10.44 10.44 0 0 0 8 13zm8 1c-3.87 0-6 2.13-6 5v2h12v-2c0-2.87-2.13-5-6-5z"/></svg>
      );
    case 'person':
    default:
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5.33 0-8 2.67-8 6v2h16v-2c0-3.33-2.67-6-8-6z"/></svg>
      );
  }
};

const StatCard = ({
  label,
  value,
  href,
  hint,
  tone,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  hint?: string;
  tone: { bg: string; text: string; iconBg: string; iconText: string };
  icon: React.ReactNode;
}) => (
  <NavLink
    to={href}
    className={`group rounded-2xl p-5 flex items-start justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg ${tone.bg}`}
  >
    <div className="min-w-0">
      <div className={`text-[12px] font-medium ${tone.text}`}>{label}</div>
      <div className={`text-3xl font-bold mt-1 ${tone.text}`}>{value}</div>
      {hint && <div className={`text-[11px] mt-1 ${tone.text} opacity-70`}>{hint}</div>}
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone.iconBg} ${tone.iconText} shrink-0`}>
      {icon}
    </div>
  </NavLink>
);

const Dashboard = () => {
  const { user, isAdminUser } = useAuth();
  const adminUser = isAdminUser() ? (user as AuthUser) : null;
  const isSuperAdmin = adminUser?.userRole === 'superadmin';

  const toast = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

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
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAllPersons = async () => {
      const all: Person[] = [];
      const limit = 2000;
      let skip = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const params: Record<string, any> = { limit };
        if (skip > 0) params.skip = skip;
        const res = await personApi.getAll(params);
        const batch = (res.data ?? []) as Person[];
        all.push(...batch);
        if (batch.length < limit) break;
        skip += limit;
      }
      return all;
    };

    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const [persons, householdsRes, events] = await Promise.all([
          fetchAllPersons(),
          householdApi.getAll(),
          populationEventApi.getAll(),
        ]);

        const households = (householdsRes.data ?? []) as Household[];
        const populationEvents = (events ?? []) as PopulationEvent[];

        const populationOverview = buildPopulationOverview(persons);
        const ageStructure = buildAgeStructure(persons);
        const movement = buildPopulationMovement(populationEvents);
        const householdSize = buildHouseholdSizeDistribution(households);

        if (!cancelled) {
          setStats({ populationOverview, ageStructure, movement, householdSize });
        }
      } catch (err: any) {
        if (!cancelled) setStatsError(err?.message || 'Không tải được thống kê');
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

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
    setShowUserForm(true);
  };

  const handleDeleteUser = async (u: User) => {
    const confirm = window.confirm(`Bạn có chắc muốn xóa người dùng "${u.fullName}"?`);
    if (!confirm) return;

    try {
      await deleteUser(String(u.id));
      toast.success('Xóa người dùng thành công');
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi khi xóa người dùng');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isSuperAdmin) return;

    const { fullName, userName, email, phone, password, role } = formValues;

    if (!fullName || !userName || !email || !phone) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
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
        toast.success('Cập nhật người dùng thành công');
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
        toast.success('Tạo người dùng mới thành công');
      }
      setFormValues((prev) => ({ ...prev, password: '' }));
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi xảy ra khi lưu người dùng');
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
            try {
              await updateUser(String(u.id), { role: newRole });
              toast.success('Cập nhật vai trò thành công');
            } catch (err: any) {
              toast.error(err?.message || 'Có lỗi khi cập nhật vai trò');
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
        <StatCard
          label="Nhân khẩu"
          value={stats ? String(stats.populationOverview.totalPersons) : '—'}
          hint="Tổng số nhân khẩu"
          href="/persons"
          tone={{ bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100', iconText: 'text-blue-700' }}
          icon={<StatIcon name="person" />}
        />
        <StatCard
          label="Hộ gia đình"
          value={
            stats
              ? String(stats.householdSize.distribution.reduce((sum, d) => sum + d.value, 0))
              : '—'
          }
          hint="Tổng số hộ gia đình"
          href="/households"
          tone={{ bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconText: 'text-emerald-700' }}
          icon={<StatIcon name="household" />}
        />
        <StatCard
          label="Đóng góp"
          value="—"
          hint="Tổng khoản đóng góp"
          href="/contributions"
          tone={{ bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100', iconText: 'text-purple-700' }}
          icon={<StatIcon name="donate" />}
        />
        <StatCard
          label="Sự kiện dân số"
          value={
            stats
              ? String(
                  stats.movement.inflow.birth
                    + stats.movement.inflow.moveIn
                    + stats.movement.outflow.death
                    + stats.movement.outflow.moveOut,
                )
              : '—'
          }
          hint="Xem danh sách sự kiện"
          href="/population-events"
          tone={{ bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100', iconText: 'text-amber-700' }}
          icon={<StatIcon name="population" />}
        />
      </div>

      {statsLoading && <div className="text-sm text-textc-secondary">Đang tải thống kê...</div>}
      {statsError && <div className="text-sm text-red-500">{statsError}</div>}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PopulationOverviewCard data={stats.populationOverview} />
          <AgeStructureCard data={stats.ageStructure} />
          <HouseholdSizeDistributionCard data={stats.householdSize} />
        </div>
      )}

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
      <ToastProvider>
      <AuthProvider>
        <PersonProvider>
          <HouseholdProvider>
            <ContributionProvider>
              <PopulationEventProvider>
                <UsersProvider>
                  <Routes>
                    {/* Public Routes - No Layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/household-login" element={<HouseholdLoginPage />} />

                    {/* Household Portal Routes - With HouseholdLayout */}
                    <Route
                      path="/household/dashboard"
                      element={(
                        <HouseholdProtectedRoute>
                          <HouseholdDashboard />
                        </HouseholdProtectedRoute>
                      )}
                    />
                    <Route
                      path="/household/payment"
                      element={(
                        <HouseholdProtectedRoute>
                          <HouseholdPayment />
                        </HouseholdProtectedRoute>
                      )}
                    />
                    <Route
                      path="/household/payment-result"
                      element={(
                        <HouseholdProtectedRoute>
                          <PaymentResult />
                        </HouseholdProtectedRoute>
                      )}
                    />
                    <Route
                      path="/household/change-password"
                      element={(
                        <HouseholdProtectedRoute>
                          <HouseholdChangePasswordPage />
                        </HouseholdProtectedRoute>
                      )}
                    />

                    {/* Admin Routes - With Admin Layout */}
                    <Route
                      path="/*"
                      element={(
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
                            </Card>

                            {/* Footer: card riêng giống Header */}
                            <div className="mb-0.5">
                              <Card padding={true}>
                                <Footer />
                              </Card>
                            </div>
                          </div>

                          <ChatWidget />
                        </div>
                      )}
                    />
                  </Routes>
              </UsersProvider>
              </PopulationEventProvider>
            </ContributionProvider>
          </HouseholdProvider>
        </PersonProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};
