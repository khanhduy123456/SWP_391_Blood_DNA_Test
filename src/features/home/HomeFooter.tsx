import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <div className="text-2xl font-bold">
                <span className="text-red-600">DNA</span>
                <span className="text-white block text-sm font-normal">TESTINGS</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Đơn vị hàng đầu về xét nghiệm ADN tại Việt Nam với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh
              nghiệm.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Giới thiệu DNA TESTINGS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Quy trình làm việc
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Bản tin DNA TESTINGS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Xét nghiệm ADN pháp y
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Hướng dẫn lấy mẫu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Quy trình xét nghiệm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-2 text-gray-400">
              <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
              <p>📞 Hotline: 1900 xxxx</p>
              <p>✉️ info@dnatestings.vn</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 DNA Testings. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;