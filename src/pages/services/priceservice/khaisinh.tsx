import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Users, 
  Phone, 
  Mail,
  Star,
  Zap,
  TestTube,
  UserCheck,
  FileText,
  Award,
  Calendar,
  AlertTriangle
} from "lucide-react";

const DNAKhaiSinhPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate('/customer/booking-page');
    } else {
      navigate('/login');
    }
  };

  const services = [
    {
      id: 1,
      name: "Xét nghiệm ADN Khai sinh Tiêu chuẩn",
      price: "5.000.0000đ",
      time: "02 ngày",
      description: "Xét nghiệm ADN cho thủ tục khai sinh hành chính",
      features: [
        "Độ chính xác 99.9999%",
        "Kết quả trong 2 ngày",
        "Chỉ sử dụng mẫu máu hoặc niêm mạc miệng",
        "Thêm mẫu thứ 3: 1.750.000đ"
      ],
      popular: true
    },
    {
      id: 2,
      name: "Xét nghiệm ADN Khai sinh Nhanh",
      price: "5.000.000",
      time: "06-08 tiếng",
      description: "Xét nghiệm nhanh cho thủ tục khai sinh gấp",
      features: [
        "Kết quả trong 6-8 tiếng",
        "Độ chính xác 99.9999%",
        "Ưu tiên xử lý",
        "Thêm mẫu thứ 3: 3.000.000đ"
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

  const procedures = [
    {
      title: "Trường hợp 1: Con chưa có giấy khai sinh và có giấy chứng sinh",
      content: "Cần CMND/passport của cha và giấy chứng sinh của con. Kết quả sau 2-3 ngày.",
      badge: "Có giấy chứng sinh",
      color: "blue"
    },
    {
      title: "Trường hợp 2: Con đã có giấy khai sinh mang tên mẹ",
      content: "Cần CMND/passport của cha và giấy khai sinh của con. Kết quả sau 2-3 ngày.",
      badge: "Có giấy khai sinh",
      color: "green"
    },
    {
      title: "Trường hợp 3: Con chưa có giấy khai sinh và không có giấy chứng sinh",
      content: "Cần xét nghiệm ADN của cha, mẹ và con để làm thủ tục nhận cha mẹ cho con.",
      badge: "Không có giấy tờ",
      color: "orange"
    },
    {
      title: "Trường hợp 4: Con đã có giấy khai sinh đầy đủ tên cha và mẹ",
      content: "Xét nghiệm cha con với người cha đẻ để làm cơ sở xin thay tên người cha.",
      badge: "Thay đổi thông tin",
      color: "red"
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
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Thủ tục pháp lý",
      description: "Được công nhận bởi các cơ quan hành chính nhà nước"
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
      description: "Gọi hotline hoặc đến trực tiếp văn phòng để được tư vấn"
    },
    {
      step: "02",
      title: "Chuẩn bị giấy tờ",
      description: "Mang theo CMND/passport và giấy tờ liên quan"
    },
    {
      step: "03",
      title: "Thu mẫu xét nghiệm",
      description: "Thu mẫu tại trung tâm với nhân viên chuyên nghiệp"
    },
    {
      step: "04",
      title: "Nhận kết quả",
      description: "Nhận kết quả qua điện thoại, email hoặc trực tiếp"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <TestTube className="w-4 h-4 mr-2" />
              Trung tâm DNA TESTINGS
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Xét nghiệm ADN Làm Giấy Khai Sinh
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Thủ tục xét nghiệm ADN để làm giấy khai sinh cho con với đầy đủ tên cha mẹ, 
              được công nhận bởi các cơ quan hành chính nhà nước
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-green-50"
                onClick={handleBookingClick}
              >
                <Phone className="w-5 h-5 mr-2" />
                Đăng ký ngay
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <FileText className="w-5 h-5 mr-2" />
                Tư vấn miễn phí
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

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bảng giá dịch vụ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${service.popular ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-green-300'}`}>
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
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

      {/* Procedures Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thủ tục cha nhận con
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các trường hợp cần xét nghiệm ADN để làm giấy khai sinh
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {procedures.map((procedure, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`bg-${procedure.color}-100 p-3 rounded-lg`}>
                    <Users className={`w-6 h-6 text-${procedure.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className={`bg-${procedure.color}-100 text-${procedure.color}-800`}>
                        {procedure.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{procedure.title}</h3>
                    <p className="text-gray-600 text-sm">{procedure.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-blue-50">
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
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lưu ý quan trọng
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những điều cần biết khi làm xét nghiệm ADN khai sinh
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Các trường hợp cần xét nghiệm</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sinh con trước khi có giấy đăng ký kết hôn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mẹ đã chết hoặc bỏ đi, cha phải tự làm thủ tục</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Thất lạc nay tìm thấy nhau, muốn nhận cha mẹ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Theo yêu cầu pháp lý của UBND, lãnh sự quán</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Quy trình thực hiện</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</div>
                  <span>Chụp ảnh chân dung 3x4 cm cho người xét nghiệm</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">2</div>
                  <span>Lấy dấu vân tay để làm cơ sở pháp lý</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">3</div>
                  <span>Có người giám hộ đi cùng với giấy tờ bản gốc</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">4</div>
                  <span>Nhân viên trung tâm trực tiếp thu mẫu</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng làm giấy khai sinh cho con?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Liên hệ ngay với chúng tôi để được tư vấn miễn phí và đặt lịch xét nghiệm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50"
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
};

export default DNAKhaiSinhPage;