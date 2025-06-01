import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="text-2xl font-bold">
                <span className="text-red-600">DNA</span>
                <span className="text-gray-800 block text-sm font-normal">TESTINGS</span>
              </div>
              <div className="text-xs text-gray-500 ml-2">RAPID TESTING SYSTEM</div>
            </div>
          </div>

          {/* Navigation với hiệu ứng slide-in */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { label: "Giới thiệu", hasDropdown: true },
              { label: "Dịch vụ", hasDropdown: true },
              { label: "Bảng giá", hasDropdown: true },
              { label: "Hướng dẫn", hasDropdown: true },
              { label: "Tin tức", hasDropdown: false },
              { label: "Hỏi đáp", hasDropdown: false },
              { label: "Liên hệ", hasDropdown: false, href: "#footer" },
            ].map((item, index) => (
              <a
                key={item.label}
                href="#"
                className={`text-gray-700 hover:text-red-600 font-medium flex items-center transition-transform duration-300 hover:scale-105 animate-slideInDown animate-delay-${index * 100}`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />}
              </a>
            ))}
          </nav>

          {/* Right side buttons với hiệu ứng rotate cho Search */}
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 hover:bg-gray-100 rounded-full group transition-colors duration-300">
              <Search className="w-5 h-5 text-gray-600 transition-transform duration-300 group-hover:rotate-90" />
            </button> */}
            <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-300"
            >
                 Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;