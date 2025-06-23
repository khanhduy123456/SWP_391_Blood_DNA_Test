import React from 'react';
import { Phone, Clock, FileText, Users, Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const DNAKhaiSinhPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Xét Nghiệm ADN Làm Giấy Khai Sinh
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Thủ tục xin xét nghiệm ADN để làm giấy khai sinh được nhiều cặp vợ chồng, gia đình quan tâm 
            để có thể làm giấy tờ khai sinh cho con của mình với đầy đủ tên của người cha và người mẹ đẻ ra 
            khi chưa đăng ký kết hôn hoặc đăng ký kết hôn sau khi sinh ra con chung.
          </p>
        </div>

        {/* Service Overview */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-blue-600">
            <CardTitle className="flex items-center gap-4">
              <FileText className="h-5 w-5" />
              DỊCH VỤ XÉT NGHIỆM ADN LÀM GIẤY KHAI SINH
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Công dân Việt Nam</p>
                    <p className="text-gray-600 text-sm">
                      Cha và mẹ đều là công dân Việt Nam thì đến phòng hộ tịch phường hoặc xã 
                      nơi bạn đăng ký hộ khẩu thường trú bên cha hoặc mẹ.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Công dân nước ngoài</p>
                    <p className="text-gray-600 text-sm">
                      Cha hoặc mẹ là công dân nước ngoài sinh sống với người Việt Nam thì đến 
                      phòng tư pháp quận hoặc huyện nơi bạn đăng ký hộ khẩu thường trú.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin quan trọng:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Việc các cặp vợ chồng sống chung mà chưa đăng ký kết hôn, đến lúc sinh con rồi mà vẫn chưa 
                  đăng ký hoặc đăng ký khi đã sinh đứa con chung. Khi tiến hành làm giấy khai sinh cho con 
                  thì việc xét nghiệm cha con là bắt buộc để làm cơ sở bổ sung tên cha vào giấy khai sinh của con.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Father Recognition Procedures */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-orange-600">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              THỦ TỤC CHA NHẬN CON
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                {
                  title: "Trường hợp 1: Đứa con chưa có giấy khai sinh và có giấy chứng sinh của bệnh viện",
                  content: "Khi tiến hành xét nghiệm cần có giấy tờ tùy thân của người cha là chứng minh nhân dân (CMND) hoặc hộ chiếu (passport) và giấy chứng sinh của đứa con. Sau 2 – 3 ngày làm việc sẽ có kết quả.",
                  badge: "Có giấy chứng sinh"
                },
                {
                  title: "Trường hợp 2: Đứa con đã có giấy khai sinh mang tên người mẹ",
                  content: "Khi tiến hành xét nghiệm cần có giấy tờ tùy thân của người cha là chứng minh nhân dân (CMND) hoặc hộ chiếu (passport) và giấy khai sinh của đứa con. Sau 2 – 3 ngày làm việc sẽ có kết quả.",
                  badge: "Có giấy khai sinh"
                },
                {
                  title: "Trường hợp 3: Đứa con chưa có giấy khai sinh và không có giấy chứng sinh",
                  content: "Người mẹ sinh con mà không có giấy chứng sinh của bệnh viện hoặc làm mất giấy chứng sinh. Cần phải xét nghiệm ADN của cha, mẹ và con để làm cơ sở là thủ tục nhận cha mẹ cho con.",
                  badge: "Không có giấy tờ"
                },
                {
                  title: "Trường hợp 4: Đứa con đã có giấy khai sinh đầy đủ tên cha và mẹ",
                  content: "Giấy khai sinh của con đã có tên mẹ và tên cha, nhưng người cha này không phải cha đẻ của đứa con, việc xét nghiệm cha con với người cha đẻ là cần thiết để làm cơ sở xin thay tên người cha.",
                  badge: "Thay đổi thông tin"
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-orange-400 pl-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Badge variant="secondary" className="mt-1">
                      {item.badge}
                    </Badge>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mother Recognition Procedures */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-pink-600">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              THỦ TỤC MẸ NHẬN CON
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="border-l-4 border-pink-400 pl-4">
                <div className="flex items-start gap-3 mb-2">
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                    Không cần xét nghiệm
                  </Badge>
                  <h4 className="font-semibold text-gray-900">
                    Trường hợp 1: Đứa con chưa có giấy khai sinh và có giấy chứng sinh của bệnh viện
                  </h4>
                </div>
                <p className="text-gray-700 text-sm">
                  Thì không cần xét nghiệm ADN mẹ con. Các bạn có thể làm thủ tục bổ sung tên người mẹ 
                  vào giấy khai sinh của con, đồng thời đặt tên cho con theo họ của người mẹ.
                </p>
              </div>
              
              <div className="border-l-4 border-pink-400 pl-4">
                <div className="flex items-start gap-3 mb-2">
                  <Badge variant="secondary" className="mt-1 bg-red-100 text-red-800">
                    Cần xét nghiệm
                  </Badge>
                  <h4 className="font-semibold text-gray-900">
                    Trường hợp 2: Đứa con đã có giấy khai sinh và mang tên người mẹ khác
                  </h4>
                </div>
                <p className="text-gray-700 text-sm">
                  Giấy khai sinh của đứa con đã có tên mẹ trên giấy khai sinh nhưng không phải mẹ đẻ 
                  thì việc xét nghiệm mẹ con là bắt buộc và cần thiết để làm thủ tục nhận con.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Table */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-green-600">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              BẢNG GIÁ XÉT NGHIỆM ADN CHA CON, MẸ CON THỦ TỤC HÀNH CHÍNH PHÁP LÝ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quy cách
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chi phí (VNĐ)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thêm mẫu thứ 3
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">Tiêu chuẩn</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">02 Ngày</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      3.500.000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.750.000</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-yellow-500">Làm Nhanh</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">06 – 08 Tiếng</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      6.000.000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3.000.000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Hợp pháp hóa lãnh sự</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7 Ngày</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      5.000.000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">Lưu ý quan trọng:</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Đối với xét nghiệm thủ tục hành chính chỉ sử dụng mẫu máu hoặc mẫu niêm mạc miệng.</li>
                <li>• Xét nghiệm làm khai sinh tại Việt Nam không cần hợp pháp hóa lãnh sự.</li>
                <li>• Xét nghiệm cần hợp pháp hóa lãnh sự tại Bộ Ngoại Giao, người có quốc tịch nước ngoài gồm 1 bản kết quả tiếng việt và 1 bản kết quả tiếng nước ngoài.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-red-600">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              3 LƯU Ý KHI TIẾN HÀNH XÉT NGHIỆM ADN THỦ TỤC HÀNH CHÍNH PHÁP LÝ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  CÁC TRƯỜNG HỢP CẦN ĐI LÀM XÉT NGHIỆM ADN:
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sinh con trước khi có giấy đăng ký kết hôn, cần làm xét nghiệm chứng minh nguồn gốc của đứa con.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Mẹ đã chết hoặc bỏ đi, người cha phải tự làm thủ tục giấy khai sinh cho con.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Thất lạc nay tìm thấy nhau, khi muốn nhận cha hoặc mẹ cho con cần làm thủ tục giấy nhận cha hoặc mẹ tại UBND.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Làm xét nghiệm ADN theo yêu cầu pháp lý của UBND, lãnh sự quán và theo yêu cầu của tòa án.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  4 BƯỚC KHI TIẾN HÀNH XÉT NGHIỆM ADN:
                </h4>
                <div className="space-y-4">
                  {[
                    "Trung tâm chụp ảnh chân dung 3 x 4 cm cho những người cần xét nghiệm (lưu ý: không lấy hình tự chụp).",
                    "Trung tâm lấy dấu vân tay để làm cơ sở pháp lý.",
                    "Phải có người giám hộ đi cùng là cha hoặc mẹ hoặc người đang nuôi dưỡng bé. Khi đi cần mang theo giấy tờ bản gốc.",
                    "Việc thu mẫu sẽ do nhân viên trung tâm trực tiếp thu. Có thể thu tại trung tâm hoặc tại nhà của các bạn."
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Package */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-purple-600">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              BỘ KẾT QUẢ XÉT NGHIỆM ADN THỦ TỤC HÀNH CHÍNH PHÁP LÝ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    01
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Giấy kết quả xét nghiệm ADN</p>
                    <p className="text-sm text-gray-600">Có các thông tin cá nhân, hình ảnh dựa vào giấy tờ tùy thân</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    02
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bản đồ ADN cá nhân</p>
                    <p className="text-sm text-gray-600">Bảng PEAK được xuất ra từ máy giải trình tự gen của từng người</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Dịch vụ hỗ trợ thêm:</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Ngoài ra nếu bạn không có thời gian làm thủ tục khai sinh, xin VISA và quốc tịch cho con, 
                  các bạn vui lòng liên hệ trung tâm để được hướng dẫn cụ thể.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-gray-700">
                    <strong>Cam kết:</strong> Uy tín, hồ sơ được kiểm duyệt ngay từ đầu, 
                    cam kết thành công 100%, chi phí hợp lý, thông tin bảo mật cho khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
       <Card className="shadow-lg border-2 border-green-200">
  <CardContent className="p-8 text-center">
    <div className="mb-6">
      <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Thu Mẫu Miễn Phí Tại Nhà
      </h3>
      <p className="text-gray-600">
        Các bạn có nhu cầu thu mẫu miễn phí tại nhà vui lòng liên hệ hotline hoặc điền form để đặt lịch hẹn
      </p>
    </div>

    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
      {/* Nút đặt lịch to lên */}
      <a
        href="/dat-lich"
        className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg w-full sm:w-auto min-h-[84px]" // 84px để bằng chiều cao hotline
      >
        Đặt lịch ngay
      </a>

      {/* Khối hotline */}
      <div className="inline-flex items-center gap-4 bg-green-100 px-6 py-4 rounded-lg">
        <Phone className="h-6 w-6 text-green-600" />
        <div className="text-left">
          <p className="text-sm text-green-700 font-medium">Hotline 24/7</p>
          <a
            href="tel:0938631300"
            className="text-2xl font-bold text-green-800 hover:text-green-900 transition-colors"
          >
            0123 456 789
          </a>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default DNAKhaiSinhPage;