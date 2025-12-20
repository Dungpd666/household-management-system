import { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import PageHeader from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { User } from '../../types/users';

export default function RoleManagementPage() {
  const { users, loading, error, fetchUsers, updateUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('user');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole('user');
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(String(selectedUser.id), { role: newRole });
      setSuccessMessage(`Successfully updated role for ${selectedUser.fullName}`);
      handleCloseModal();
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating role: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'userName', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: User) => (
        <button
          onClick={() => handleOpenModal(row)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Change Role
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        subtitle="Assign and manage user roles and permissions"
      />

      {error && (
        <Card className="bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {successMessage && (
        <Card className="bg-green-50 border border-green-200">
          <p className="text-green-700">{successMessage}</p>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <DataTable
            data={users}
            columns={columns}
            emptyText="No users found"
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Change User Role"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">User: <strong>{selectedUser.fullName}</strong></p>
              <p className="text-sm text-gray-500">{selectedUser.userName} ({selectedUser.email})</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Admin (Administrative Access)</option>
                <option value="superadmin">Superadmin (Full System Access)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {newRole === 'superadmin' && 'Full system access and user management.'}
                {newRole === 'admin' && 'Can manage most resources and view statistics.'}
                {newRole === 'user' && 'Standard user access with limited permissions.'}
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Role
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
