import type React from "react";
import { useState } from "react";
import ImageSlider from "./imageslide";
import TestimonialsCarousel from "./TestimonialsCarousel";
import { useNavigate } from "react-router-dom";
import { BookingModal } from "@/pages/customer/components/bookingPopup";

const Body: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  const handleBookingClick = () => {
    if (!userId) {
      navigate("/login");
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <>
      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} userId={userId ? Number(userId) : 1} />
      {/* Image Slider */}
      <div className="w-screen">
        <div className="mx-auto">
          <ImageSlider />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center bg-blue-300 bg-opacity-30 rounded-lg p-6">
          {/* Nội dung bên trái */}
          <div className="md:w-1/2">
            {/* Service Badge */}
            <div className="mb-6">
              <span className="text-red-600 font-semibold text-sm tracking-wide uppercase">DỊCH VỤ TỐT NHẤT CHO BẠN</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-8">
              Chúng tôi luôn lắng nghe
              <br />
              và chia sẻ, nhằm giải tỏa
              <br />
              thắc mắc của khách hàng
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-12 max-w-2xl">
              <strong>CÔNG TY TNHH MTV TM VÀ DV DNA TESTINGS</strong> tự tin là một trong những đơn vị hàng đầu về xét
              nghiệm ADN tại Việt Nam.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                onClick={handleBookingClick}
              >
                 Đặt lịch ngay
              </button>
              <button className="border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Xem dịch vụ
              </button>
            </div>
          </div>

          {/* Hình ảnh bên phải */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <img
              src="/assets/images/body-thumb.png"
              alt="Body Thumbnail"
              className="w-full h-130 object-contain"
            />
          </div>
        </div>
      </main>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Điểm đến tin cậy của bạn</h2>
            <p className="text-lg text-gray-600 font-bold max-w-2xl mx-auto">
              Chúng tôi cam kết mang lại dịch vụ xét nghiệm ADN chất lượng cao với độ chính xác tuyệt đối
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Phòng Thí Nghiệm Hiện Đại",
                description: "Đạt tiêu chuẩn ISO, CE – IVD… Áp dụng các công nghệ phân tích di truyền tiên tiến hàng đầu trên thế giới của Mỹ, Châu Âu…",
                icon: "/assets/images/ban1.png",
              },
              {
                title: "Kết Quả Nhanh Chóng",
                description: "Chỉ từ 1 – 2 ngày làm việc. Có giá trị về mặt pháp lý với các cơ quan nhà nước",
                icon: "/assets/images/ban2.png",
              },
              {
                title: "Đội Ngũ Chuyên Gia",
                description: "Quy tụ các chuyên gia nhiều năm kinh nghiệm, cùng đội ngũ kỹ thuật viên, tư vấn chuyên nghiệp, nhiệt tình, chu đáo.ội ngũ chuyên gia luôn sẵn sàng tư vấn và hỗ trợ khách hàng 24/7.",
                icon: "/assets/images/ban3.png",
              },
            ].map((reason, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <img src={reason.icon} alt={reason.title} className="w-20 h-20 mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DNA Testing Center Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Text Content */}
            <div className="lg:w-1/2">
              <p className="text-red-600 font-semibold text-sm tracking-wide uppercase mb-2">Về chúng tôi</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Trung Tâm Xét Nghiệm ADN - DNA TESTINGS
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Trung tâm DNA TESTINGS tự hào là một trong những đơn vị hàng đầu về xét nghiệm ADN tại Việt Nam. Với đội ngũ
                chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến dịch vụ xét nghiệm ADN chính xác, nhanh chóng và đáng
                tin cậy. Chúng tôi không chỉ cung cấp các giải pháp xét nghiệm tiên tiến mà còn hỗ trợ khách hàng trong việc
                hiểu rõ kết quả và giải đáp mọi thắc mắc. Hãy đến với chúng tôi để trải nghiệm dịch vụ chất lượng cao!
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                Liên Hệ Tư Vấn
              </button>
            </div>

            {/* Image Content with Overlapping Images */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-0 pb-[56.25%]"> {/* Aspect ratio 16:9 */}
                <img
                  src="/assets/images/about1.webp"
                  alt="Lab Team 1"
                  className="absolute top-0 left-0 w-140 h-full object-cover rounded-lg shadow-md"
                />
                <img
                  src="/assets/images/about2.webp"
                  alt="Lab Team 2"
                  className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover rounded-lg shadow-lg border-2 border-white"
                  style={{ transform: "translate(-10%, 10%)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Dịch vụ xét nghiệm ADN</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp các dịch vụ xét nghiệm ADN chính xác, nhanh chóng với công nghệ hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Xét nghiệm ADN cha con",
                description: "Xác định mối quan hệ huyết thống giữa cha và con với độ chính xác 99.99%",
                icon: "👨‍👧‍👦",
              },
              {
                title: "Xét nghiệm ADN anh em",
                description: "Kiểm tra mối quan hệ huyết thống giữa các anh chị em ruột",
                icon: "👫",
              },
              {
                title: "Xét nghiệm ADN ông bà cháu",
                description: "Xác định mối quan hệ huyết thống qua nhiều thế hệ",
                icon: "👴👵",
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="text-red-600 font-semibold hover:text-red-700">Tìm hiểu thêm →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel />
        </div>
      </section>
    </>
  );
};

export default Body;