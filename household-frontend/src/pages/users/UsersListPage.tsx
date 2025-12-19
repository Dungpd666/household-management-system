import { useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';

export const UsersListPage = () => {
  const { user } = useAuth();
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (user?.userRole !== 'superadmin') {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Tài khoản hệ thống"
          subtitle="Chỉ tài khoản Superadmin mới có quyền quản lý người dùng."
        />
        <Card padding className="text-sm text-red-500">Bạn không có quyền truy cập trang này.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tài khoản hệ thống"
        subtitle="Danh sách quyền truy cập và vai trò trong hệ thống."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Tổng người dùng</div>
          <div className="text-2xl font-semibold text-textc-primary">{users.length}</div>
        </Card>
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Quản trị</div>
          <div className="text-2xl font-semibold text-emerald-500">{users.filter((u: any) => u.role === 'admin').length}</div>
        </Card>
        <Card className="bg-surface-base" padding>
          <div className="text-[12px] font-medium text-textc-secondary mb-1">Cán bộ</div>
          <div className="text-2xl font-semibold text-brand-purple">{users.filter((u: any) => u.role !== 'admin').length}</div>
        </Card>
      </div>

      <Card padding={false} variant="table" className="mt-6">
        <div className="p-4">
          <DataTable<any>
            columns={([
              { key: 'fullName', header: 'Họ tên' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Vai trò' },
            ]) as Column<any>[]}
            data={users}
            emptyText="Chưa có người dùng"
            rowKey={(r) => r.id}
          />
        </div>
      </Card>
    </div>
  );
};
