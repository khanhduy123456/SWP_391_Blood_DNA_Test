'use client';

import { useEffect, useState } from "react";
import { MoreVertical, Pencil, Lock, Unlock } from "lucide-react";
import type { User } from "../types/user";
import { getAllUsers, toggleUserStatus } from "../api/user.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/shared/ui/dialog";

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [confirmDialog, setConfirmDialog] = useState<{
    userId: number | null;
    action: "lock" | "unlock" | null;
  }>({ userId: null, action: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        const mappedUsers: User[] = data.map((user) => ({
          userId: user.userId,
          name: user.email.split("@")[0],
          email: user.email,
          role: convertRoleToVietnamese(user.role),
          status: user.status ? "Hoạt động" : "Đã khóa",
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => a.userId - b.userId);
    } else {
      result.sort((a, b) => b.userId - a.userId);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, roleFilter, sortOrder]);

  const convertRoleToVietnamese = (role: string): string => {
    switch (role) {
      case "System Admin":
        return "Admin";
      case "User":
        return "Người dùng";
      case "Staff":
        return "Nhân viên";
      case "Unknown":
        return "Không xác định";
      default:
        return role;
    }
  };

  const handleToggleUserStatus = async () => {
    if (!confirmDialog.userId) return;
    setLoading(true);
    try {
      await toggleUserStatus(confirmDialog.userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === confirmDialog.userId
            ? {
                ...user,
                status:
                  user.status === "Hoạt động" ? "Đã khóa" : "Hoạt động",
              }
            : user
        )
      );
    } catch {
      alert("Có lỗi xảy ra khi cập nhật trạng thái tài khoản!");
    } finally {
      setLoading(false);
      setConfirmDialog({ userId: null, action: null });
      setOpenMenuId(null);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Quản lý người dùng</h2>
          <div className="flex gap-2 items-center">
            {/* Sort order filter */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="px-3 py-2 border rounded-xl text-sm text-gray-700 bg-white shadow"
            >
              <option value="desc">Mới nhất lên trên</option>
              <option value="asc">Cũ nhất lên trên</option>
            </select>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl text-sm text-gray-700 bg-white shadow"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="Admin">Admin</option>
              <option value="Nhân viên">Nhân viên</option>
              <option value="Người dùng">Người dùng</option>
              <option value="Không xác định">Không xác định</option>
            </select>

            {/* Add user */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow transition">
              + Thêm người dùng
            </button>
          </div>
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
              {paginatedUsers.map((user) => (
                <tr key={user.userId} className="border-b hover:bg-blue-50 transition relative">
                  <td className="py-3 px-5">{user.userId}</td>
                  <td className="py-3 px-5 font-medium">{user.name}</td>
                  <td className="py-3 px-5">{user.email}</td>
                  <td className="py-3 px-5">{user.role}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${user.status === "Hoạt động"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center relative">
                    <button
                      className="p-2 hover:bg-blue-100 rounded-full"
                      onClick={() =>
                        setOpenMenuId(openMenuId === user.userId ? null : user.userId)
                      }
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openMenuId === user.userId && (
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
                          onClick={() =>
                            setConfirmDialog({
                              userId: user.userId,
                              action: user.status === "Hoạt động" ? "lock" : "unlock",
                            })
                          }
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          {user.status === "Hoạt động" ? (
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
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredUsers.length > 0 && (
            <div className="flex justify-between items-center mt-4 px-5 py-3">
              <p className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages} (Tổng: {filteredUsers.length} người dùng)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    currentPage > 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Trang trước
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    currentPage < totalPages
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup xác nhận khóa/mở khóa tài khoản */}
      {confirmDialog.userId && (
        <Dialog open={!!confirmDialog.userId} onOpenChange={(open) => {
          if (!open) setConfirmDialog({ userId: null, action: null });
        }}>
          <DialogContent className="p-6 w-80 border border-blue-200">
            <DialogHeader>
              <DialogTitle className="text-blue-700">
                {confirmDialog.action === "lock"
                  ? "Bạn có chắc muốn khóa tài khoản này không?"
                  : "Bạn có chắc muốn mở khóa tài khoản này không?"}
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  disabled={loading}
                >
                  Không
                </button>
              </DialogClose>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleToggleUserStatus}
                disabled={loading}
              >
                Có
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default UserManagement;
