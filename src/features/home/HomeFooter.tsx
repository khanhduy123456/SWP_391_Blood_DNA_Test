import type React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gradient-to-br from-slate-800 via-blue-800 to-slate-800 text-white">

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="text-2xl font-bold mb-2">
                <span className="text-red-400">DNA</span>
                <span className="text-white block text-sm font-normal">TESTINGS</span>
              </div>
              <div className="text-xs text-gray-400">RAPID TESTING SYSTEM</div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Đơn vị hàng đầu về xét nghiệm ADN tại Việt Nam với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors cursor-pointer">
                <span className="text-red-400 font-bold text-sm">F</span>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors cursor-pointer">
                <span className="text-blue-400 font-bold text-sm">T</span>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-colors cursor-pointer">
                <span className="text-green-400 font-bold text-sm">I</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-red-500/30 pb-2">Dịch vụ chính</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-red-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Xét nghiệm ADN huyết thống
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Xét nghiệm làm giấy khai sinh
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Xét nghiệm ADN pháp y
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Xét nghiệm sàng lọc di truyền
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-blue-500/30 pb-2">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Hướng dẫn lấy mẫu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Quy trình xét nghiệm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Tư vấn miễn phí
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-green-500/30 pb-2">Liên hệ</h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Trụ sở chính</p>
                  <p className="text-sm">123 Đường ABC, Quận 1, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Hotline</p>
                  <p className="text-sm">1900 xxxx</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-sm">blooddnatestswp@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Giờ làm việc</p>
                  <p className="text-sm">8:00 - 18:00 (T2-T7)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 DNA Testings. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;