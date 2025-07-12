import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Mail,
  Star,
  Zap,
  TestTube,
  Banknote,
  UserCheck,
  ClipboardList,
  HeartHandshake
} from "lucide-react";

export default function ChaCon() {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate('/customer/booking-page');
    } else {
      navigate('/login');
    }
  };

  const civilServices = [
    {
      id: 1,
      name: "Xét nghiệm ADN Tiêu chuẩn",
      price: "2.500.000",
      time: "02 ngày",
      description: "Xét nghiệm ADN huyết thống cha con cho nhu cầu dân sự",
      features: [
        "Độ chính xác 99.9999%",
        "Kết quả trong 2 ngày",
        "Mẫu niêm mạc miệng và máu",
        "Thêm mẫu thứ 3: 1.250.000đ"
      ],
      popular: true
    },
    {
      id: 2,
      name: "Xét nghiệm ADN Nhanh",
      price: "5.000.000",
      time: "06-08 tiếng",
      description: "Xét nghiệm nhanh với kết quả trong 6-8 tiếng",
      features: [
        "Kết quả trong 6-8 tiếng",
        "Độ chính xác 99.9999%",
        "Ưu tiên xử lý",
        "Thêm mẫu thứ 3: 2.500.000đ"
      ],
      popular: false
    }
  ];

  const legalServices = [
    {
      id: 1,
      name: "Xét nghiệm ADN Hành chính",
      price: "3.500.000",
      time: "02 ngày",
      description: "Xét nghiệm cho thủ tục hành chính khai sinh",
      features: [
        "Chỉ sử dụng mẫu máu hoặc niêm mạc miệng",
        "Kết quả trong 2 ngày",
        "Thêm mẫu thứ 3: 1.750.000đ",
        "Hợp lệ cho khai sinh tại Việt Nam"
      ],
      popular: true
    },
    {
      id: 2,
      name: "Xét nghiệm ADN Nhanh (Hành chính)",
      price: "6.000.000",
      time: "06-08 tiếng",
      description: "Xét nghiệm nhanh cho thủ tục hành chính",
      features: [
        "Kết quả trong 6-8 tiếng",
        "Chỉ sử dụng mẫu máu hoặc niêm mạc miệng",
        "Thêm mẫu thứ 3: 3.000.000đ",
        "Ưu tiên xử lý"
      ],
      popular: false
    },
    {
      id: 3,
      name: "Hợp pháp hóa lãnh sự",
      price: "5.000.000",
      time: "07 ngày",
      description: "Xét nghiệm cần hợp pháp hóa lãnh sự tại Bộ Ngoại Giao",
      features: [
        "Bao gồm 1 bản tiếng Việt",
        "Bao gồm 1 bản tiếng nước ngoài",
        "Tùy thuộc vào quốc tịch",
        "Thời gian xử lý 7 ngày"
      ],
      popular: false
    }
  ];

  const additionalCosts = [
    {
      type: "Mẫu tóc, móng tay, chân, cuống rốn",
      cost: "+500.000đ/trường hợp"
    },
    {
      type: "Mẫu đặc biệt (dao cạo râu, đầu lọc thuốc lá, bã kẹo cao su, bàn chải đánh răng, mẫu tinh trùng)",
      cost: "+2.000.000đ/trường hợp"
    },
    {
      type: "Nếu 2 mẫu đều là mẫu đặc biệt",
      cost: "+500.000đ"
    }
  ];

  const advantages = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Độ chính xác 99.9999%",
      description: "Cam kết kết quả chính xác 100% theo tiêu chuẩn quốc tế"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Kết quả nhanh chóng",
      description: "Từ 6-8 tiếng đến 2 ngày tùy gói dịch vụ"
    },
    {
      icon: <Banknote className="w-8 h-8 text-purple-600" />,
      title: "Giá cả minh bạch",
      description: "Bảng giá niêm yết công khai, không phát sinh thêm chi phí"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-red-600" />,
      title: "Tư vấn 24/7",
      description: "Nhân viên nhiều kinh nghiệm, tổng đài hỗ trợ 24/7"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Liên hệ trung tâm",
      description: "Gọi hotline 0938.631.300 hoặc đến trực tiếp văn phòng"
    },
    {
      step: "02",
      title: "Thu mẫu xét nghiệm",
      description: "Thu mẫu tại trung tâm hoặc tự thu theo hướng dẫn"
    },
    {
      step: "03",
      title: "Tiến hành xét nghiệm",
      description: "Phân tích ADN với công nghệ hiện đại"
    },
    {
      step: "04",
      title: "Nhận kết quả",
      description: "Nhận kết quả qua điện thoại, email, Zalo hoặc thư bảo đảm"
    }
  ];



  const guarantees = [
    "Cam kết kết quả chính xác 100%",
    "Cam kết bù cho khách hàng theo chính sách",
    "Cam kết bảo mật thông tin khách hàng"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <TestTube className="w-4 h-4 mr-2" />
              Trung tâm DNA TESTINGS
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Xét nghiệm ADN Huyết thống Cha - Con
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Xác định mối quan hệ huyết thống với độ chính xác 99.9999% 
              và kết quả nhanh chóng từ 6-8 tiếng đến 2 ngày
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={handleBookingClick}
              >
                <Phone className="w-5 h-5 mr-2" />
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold">
            <Zap className="w-5 h-5 inline mr-2" />
            Liên hệ Hotline nhận mã khuyến mãi áp dụng đến hết ngày 31/07/2025
          </p>
        </div>
      </section>

      {/* Civil Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Xét nghiệm ADN Dân sự
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dịch vụ xét nghiệm ADN cho nhu cầu cá nhân
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {civilServices.map((service) => (
              <Card key={service.id} className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${service.popular ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}`}>
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Phổ biến nhất
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-gray-900">{service.name}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-blue-600">{service.price}₫</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.time}
                    </Badge>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleBookingClick}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Đăng ký ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Xét nghiệm ADN Hành chính Pháp lý
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dịch vụ xét nghiệm ADN cho thủ tục hành chính và khai sinh
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {legalServices.map((service) => (
              <Card key={service.id} className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${service.popular ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-green-300'}`}>
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                    <ClipboardList className="w-4 h-4 mr-1" />
                    Thủ tục chính thức
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-gray-900">{service.name}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-green-600">{service.price}₫</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.time}
                    </Badge>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleBookingClick}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Đăng ký ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Costs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Chi phí bổ sung
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các loại mẫu đặc biệt có thể phát sinh chi phí bổ sung
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalCosts.map((cost, index) => (
              <Card key={index} className="p-6">
                <div className="text-center">
                  <div className="bg-orange-100 p-3 rounded-lg inline-block mb-4">
                    <Banknote className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cost.type}</h3>
                  <p className="text-2xl font-bold text-orange-600">{cost.cost}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              4 bước thực hiện xét nghiệm ADN
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quy trình đơn giản, nhanh chóng và chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đảm bảo quyền lợi khách hàng
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 p-4 rounded-lg inline-block mb-4">
                  <HeartHandshake className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{guarantee}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng xác định mối quan hệ huyết thống?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận mã khuyến mãi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleBookingClick}
            >
              <Phone className="w-5 h-5 mr-2" />
              Đăng ký ngay
            </Button>
            <Button size="lg" variant="outline" className="border-white text-blue-500 hover:bg-white/10">
              <Mail className="w-5 h-5 mr-2" />
              Gửi email: blooddnatestswp@gmail.com
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}