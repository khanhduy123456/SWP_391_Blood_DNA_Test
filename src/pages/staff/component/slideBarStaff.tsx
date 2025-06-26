// components/Sidebar.tsx
import { Button } from "@/shared/ui/button";
import {
  BadgeCheck,
    CalendarRange,
  TestTubeDiagonal,
  User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";


interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  position: "top" | "bottom";
}

interface SidebarProps {
  role: string;
}

const SidebarStaff = ({ role }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const size = 24;

  const isNavItemActive = (currentPath: string, nav: string) => {
    return currentPath.includes(nav);
  };

  const navItems: NavItem[] = (() => {
    if (role === "Staff") {
      return [
        {
          name: "Quản lí đơn xét nghiệm",
          href: "/staff/test-bookings",
          icon: <CalendarRange size={size} />,
          position: "top",
        },
        {
          name: "Quản lí kết quả xét nghiệm",
          href: "/staff/test-results",
          icon: <User size={size} />,
          position: "top",
        },
        {
          name: "Kit Test Management",
          href: "/staff/kits",
          icon: <TestTubeDiagonal size={size} />,
          position: "top",
        },
        {
          name: "Sample Method Management",
          href: "/admin/sample-methods",
          icon: <BadgeCheck size={size} />,
          position: "top",
        },
        
      ];
    }
    return [];
  })();

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="p-4 text-xl font-bold">Stff Management</div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active || isActive
                      ? "bg-[#EDEBDF] text-blue-800 font-bold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
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

      <div className="p-4">
        <Button variant="outline" className="w-full">
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};

export default SidebarStaff ;
