import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/shared/config/routes";

// Thêm interface cho props
interface HeaderProps {
  user?: { id?: string; username?: string };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hàm xử lý cuộn mượt đến footer
  const scrollToFooter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle dropdown cho Dịch vụ
  const toggleServiceDropdown = () => {
    setIsServiceDropdownOpen(!isServiceDropdownOpen);
  };

  // Hàm xử lý logout
  const handleLogout = () => {
    // Xóa tất cả thông tin đăng nhập khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    
    // Chuyển về trang chủ
    navigate("/");
    
    // Reload trang để cập nhật trạng thái
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 w-full bg-white shadow-md z-50 transition-all duration-300 ${
        isScrolled ? "bg-opacity-80" : "bg-opacity-100"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo với hiệu ứng pulse */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 animate-pulse">
  <div className="text-2xl font-bold">
    <span className="text-red-600">DNA</span>
    <span className="text-gray-800 block text-sm font-normal">TESTINGS</span>
  </div>
  <div className="text-xs text-gray-500 ml-2">RAPID TESTING SYSTEM</div>
</Link>

          </div>

          {/* Navigation với hiệu ứng slide-in */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { label: "Giới thiệu", hasDropdown: false },
              {
                label: "Dịch vụ",
                hasDropdown: true,
                dropdownItems: [
                  { label: "Xét Nghiệm Làm Giấy Khai Sinh", to: routes.adnKhaiSinh },
                  { label: "Xét Nghiệm Huyết Thống Cha/Mẹ-Con", to: routes.adnChaCon },
                ],
              },
              { label: "Bảng giá", hasDropdown: false },
              { label: "Hướng dẫn", hasDropdown: false },
              { label: "Tin tức", hasDropdown: false },
              { label: "Hỏi đáp", hasDropdown: false },
              { label: "Liên hệ", hasDropdown: false },
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={item.hasDropdown ? toggleServiceDropdown : undefined}
                onMouseLeave={item.hasDropdown ? toggleServiceDropdown : undefined}
              >
                {item.hasDropdown ? (
                  <span
                    className={`text-gray-700 hover:text-red-600 font-medium flex items-center transition-transform duration-300 hover:scale-105 animate-slideInDown animate-delay-${
                      index * 100
                    } cursor-pointer`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                        isServiceDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                ) : (
                  <a
                    href={item.label === "Liên hệ" ? "#footer" : "#"}
                    onClick={item.label === "Liên hệ" ? scrollToFooter : undefined}
                    className={`text-gray-700 hover:text-red-600 font-medium flex items-center transition-transform duration-300 hover:scale-105 animate-slideInDown animate-delay-${
                      index * 100
                    }`}
                  >
                    {item.label}
                  </a>
                )}
                {item.hasDropdown && isServiceDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-48 z-50">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.label}
                        to={dropdownItem.to}
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user && user.username ? (
              <div className="flex items-center space-x-2">
                <span className="text-red-600 font-semibold">
                  Xin chào {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-300"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;