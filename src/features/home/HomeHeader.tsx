import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/shared/config/routes";

// Thêm interface cho props
interface HeaderProps {
  user?: { id?: string; username?: string };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { label: "Giới thiệu", hasDropdown: false, to: "#" },
    {
      label: "Dịch vụ",
      hasDropdown: true,
      dropdownItems: [
        { label: "Xét Nghiệm Làm Giấy Khai Sinh", to: routes.adnKhaiSinh },
        { label: "Xét Nghiệm Huyết Thống Cha/Mẹ-Con", to: routes.adnChaCon },
      ],
    },
    // { label: "Bảng giá", hasDropdown: false, to: "#" },
    { label: "Hướng dẫn", hasDropdown: false, to: "#" },
    { label: "Tin tức", hasDropdown: false, to: "/news" },
    // { label: "Hỏi đáp", hasDropdown: false, to: "#" },
    { label: "Liên hệ", hasDropdown: false, to: "#footer" },
  ];

  return (
    <>
      {/* Top bar với thông tin liên hệ */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-1 hidden lg:block">
        <div className="container mx-auto ">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Hotline: 1900 xxxx</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>blooddnatestswp@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Giờ làm việc: 8:00 - 18:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg" 
            : "bg-white shadow-sm"
        } ${isMobileMenuOpen ? "bg-white" : ""}`}
        style={{ top: isScrolled ? "0" : "0" }}
      >
        <div className="container mx-auto px-4 py-3">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={item.hasDropdown ? toggleServiceDropdown : undefined}
                  onMouseLeave={item.hasDropdown ? toggleServiceDropdown : undefined}
                >
                  {item.hasDropdown ? (
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-red-50 hover:text-red-600 group-hover:scale-105 ${
                        isServiceDropdownOpen ? "bg-red-50 text-red-600" : "text-gray-700"
                      }`}
                    >
                      <span className="flex items-center">
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                            isServiceDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>
                  ) : (
                    <a
                      href={item.to}
                      onClick={item.label === "Liên hệ" ? scrollToFooter : undefined}
                      className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-105"
                    >
                      {item.label}
                    </a>
                  )}
                  
                                     {/* Dropdown menu với animation */}
                   {item.hasDropdown && isServiceDropdownOpen && (
                     <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl py-2 w-48 z-50 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                       {item.dropdownItems?.map((dropdownItem) => (
                         <Link
                           key={dropdownItem.label}
                           to={dropdownItem.to}
                           className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:translate-x-1"
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
            <div className="flex items-center space-x-3">
              {user && user.username ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-semibold text-sm">
                      Xin chào {user.username}
                    </span>
                  </div>
                  {/* Hiện icon nếu là Customer */}
                  {localStorage.getItem("userRole") === "Customer" && (
                    <button
                      onClick={() => navigate("/customer/booking-list")}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                      title="Quản lý đặt lịch"
                    >
                      {/* Sử dụng icon Lucide List */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={toggleServiceDropdown}
                          className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center justify-between"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isServiceDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isServiceDropdownOpen && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.label}
                                to={dropdownItem.to}
                                className="block px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={item.to}
                        onClick={(e) => {
                          if (item.label === "Liên hệ") {
                            scrollToFooter(e);
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                ))}
              </nav>
              
              {/* Mobile contact info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>Hotline: 1900 xxxx</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>blooddnatestswp@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;