import { useState } from 'react';
import { MoreVertical, Pencil, Lock, Unlock } from 'lucide-react';
import type { User } from '../types/user';

const initialUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'Nhân viên', status: 'Đã khóa' },
];

function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleUserStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động',
            }
          : user
      )
    );
    setOpenMenuId(null);
  };

  return (
    <div className="p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Quản lý người dùng</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow transition">
            + Thêm người dùng
          </button>
        </div>

        <div className="overflow-x-auto relative z-0 rounded-xl shadow-lg border border-blue-100 bg-white">
          <table className="min-w-full text-sm text-left relative z-0">
            <thead>
              <tr className="bg-blue-100 text-blue-700 uppercase text-xs tracking-wider">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Họ tên</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Vai trò</th>
                <th className="py-3 px-5">Trạng thái</th>
                <th className="py-3 px-5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-blue-50 transition relative">
                  <td className="py-3 px-5">{user.id}</td>
                  <td className="py-3 px-5 font-medium">{user.name}</td>
                  <td className="py-3 px-5">{user.email}</td>
                  <td className="py-3 px-5">{user.role}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                      ${user.status === 'Hoạt động' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center relative">
                    <button
                      className="p-2 hover:bg-blue-100 rounded-full"
                      onClick={() =>
                        setOpenMenuId(openMenuId === user.id ? null : user.id)
                      }
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openMenuId === user.id && (
                      <div className="absolute right-5 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <button
                          onClick={() => {
                            alert(`Chỉnh sửa: ${user.name}`);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          <Pencil size={16} />
                          Chỉnh sửa tài khoản
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          {user.status === 'Hoạt động' ? (
                            <>
                              <Lock size={16} />
                              Khóa tài khoản
                            </>
                          ) : (
                            <>
                              <Unlock size={16} />
                              Mở khóa tài khoản
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
