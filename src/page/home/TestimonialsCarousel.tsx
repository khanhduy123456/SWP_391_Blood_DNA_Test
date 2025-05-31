import type React from "react";
import { useState, useEffect } from "react"
const TestimonialsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      id: 1,
      content:
        "DNA Testing là địa chỉ đáng tin cậy cho các dự án nghiên cứu và ứng dụng công nghệ di truyền. Đội ngũ nghiên cứu của họ rất chuyên nghiệp và kinh nghiệm, giúp tôi áp dụng các phương pháp mới nhất vào dự án của mình. Kết quả của dự án cũng rất tốt.",
      name: "Kiều Linh",
      location: "Quận 10 - TP. HCM",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      content:
        "Dịch vụ xét nghiệm ADN tại đây rất chuyên nghiệp và chính xác. Tôi đã sử dụng dịch vụ xét nghiệm cha con và nhận được kết quả nhanh chóng, rõ ràng. Nhân viên tư vấn rất nhiệt tình và giải đáp mọi thắc mắc của tôi.",
      name: "Minh Tuấn",
      location: "Quận 1 - TP. HCM",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      content:
        "Tôi rất hài lòng với chất lượng dịch vụ và sự chuyên nghiệp của DNA Testing. Quy trình lấy mẫu đơn giản, kết quả chính xác và được giải thích rất dễ hiểu. Đây thực sự là đơn vị đáng tin cậy cho các xét nghiệm ADN.",
      name: "Thu Hương",
      location: "Quận 3 - TP. HCM",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left side - Customer avatars with decorative layout */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[200px] font-bold text-gray-100 select-none">“</span>
        </div>

        {/* Customer avatars positioned around */}
        <div className="relative z-10">
          <div className="absolute top-0 left-16">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="Customer"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="absolute top-20 right-0">
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="Customer"
              className="w-25 h-25 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="absolute top-40 left-0">
            <img
              src="/placeholder.svg?height=90&width=90"
              alt="Customer"
              className="w-22 h-22 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="absolute bottom-20 left-32">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="Customer"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="absolute bottom-0 right-16">
            <img
              src="/placeholder.svg?height=85&width=85"
              alt="Customer"
              className="w-21 h-21 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Right side - Testimonial content */}
      <div className="space-y-6">
        <div>
          <p className="text-red-600 font-semibold text-sm tracking-wide uppercase mb-2">Cảm nhận khách hàng</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Khách hàng nói gì</h2>
        </div>

        {/* Testimonial content with smooth transition */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">{testimonial.content}</p>

                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-red-600 text-lg">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex space-x-2 justify-end">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-pink-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialsCarousel