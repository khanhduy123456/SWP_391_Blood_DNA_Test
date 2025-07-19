// components/Sidebar.tsx
import { Button } from "@/shared/ui/button";
import {
  CalendarRange,
  User,
  FileText,
  ListChecks,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  position: "top" | "bottom";
}

interface SidebarProps {
  role: string;
}

const SidebarManager = ({ role }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const size = 20;

  const isNavItemActive = (currentPath: string, nav: string) => {
    return currentPath.includes(nav);
  };

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  const navItems: NavItem[] = (() => {
    if (role === "Manager") {
      return [
        {
          name: "ĐƠN XÉT NGHIỆM",
          href: "/manager/lab-orders",
          icon: <CalendarRange size={size} />, 
          position: "top",
        },
        {
          name: "Quản lí request hoàn thành",
          href: "/manager/request-completed",
          icon: <ListChecks size={size} />, 
          position: "top",
        },
        {
          name: "Quản lí kết quả xét nghiệm",
          href: "/manager/ex-result",
          icon: <FileText size={size} />, 
          position: "top",
        },
      ];
    }
    return [];
  })();

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-50 to-white shadow-xl flex flex-col justify-between border-r border-blue-100">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Quản lý Manager</h1>
              <p className="text-xs text-gray-500">Quản lý nghiệp vụ hệ thống</p>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active || isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
      {/* Logout Button */}
      <div className="p-4 border-t border-blue-100">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
        >
          <LogOut size={16} className="mr-2" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};

export default SidebarManager;
