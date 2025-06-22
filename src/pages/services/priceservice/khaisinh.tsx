import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

const ADNChaCon: React.FC = () => (
  <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-red-700 text-center mb-6">XÉT NGHIỆM ADN LÀM GIẤY KHAI SINH</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hướng dẫn thủ tục nhận con</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="step-1">
              <AccordionTrigger>Trường hợp 1: Đưa con chưa có giấy khai sinh vào cơ quan chức năng</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700">
                  - Chưa có giấy khai sinh, cần mang theo giấy tờ tùy thân của cha mẹ hoặc người giám hộ (CMND/CCCD hoặc hộ chiếu) để đăng ký khai sinh.
                </p>
                <p className="text-gray-700">
                  - Chưa có giấy khai sinh, mang theo giấy tờ tùy thân của cha mẹ hoặc người giám hộ Việt Nam để đăng ký khai sinh trong nước.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step-2">
              <AccordionTrigger>Trường hợp 2: Đưa con đã có giấy khai sinh mang tên người khác</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700">
                  - Khi tiến hành xét nghiệm để sửa đổi tên cha/mẹ trên giấy khai sinh, cần chuẩn bị CMND/CCCD hoặc hộ chiếu của cha/mẹ.
                </p>
                <p className="text-gray-700">
                  - Sau 2-3 ngày làm việc sẽ có kết quả, mang kết quả đến cơ quan chức năng để thay đổi thông tin.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step-3">
              <AccordionTrigger>Trường hợp 3: Đưa con chưa có giấy khai sinh vào cơ quan chức năng</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700">
                  - Nơi nhận con mà không có giấy khai sinh, cần chuẩn bị CMND/CCCD hoặc hộ chiếu của cha/mẹ.
                </p>
                <p className="text-gray-700">
                  - Xét nghiệm ADN để làm giấy khai sinh tại Việt Nam trong nước.
                </p>
                <p className="text-gray-700">
                  - Nơi sinh con ra nước ngoài hoặc nơi sinh con ở nước ngoài, cần liên hệ để được hỗ trợ hợp pháp hóa lãnh sự.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bảng giá xét nghiệm ADN cha con, mẹ con theo thủ tục hành chính pháp lý</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Quy cách</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Chi phí (VND)</TableHead>
                <TableHead>Thêm mẫu thứ 3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Tiểu chuẩn</TableCell>
                <TableCell>02 Ngày</TableCell>
                <TableCell>3.500.000</TableCell>
                <TableCell>1.750.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Làm Nhanh</TableCell>
                <TableCell>06 - 08 Tiếng</TableCell>
                <TableCell>6.000.000</TableCell>
                <TableCell>3.000.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cân hợp pháp hóa lãnh sự</TableCell>
                <TableCell>7 Ngày</TableCell>
                <TableCell>5.000.000</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-gray-700 mt-4">
            - Đổi vòng xét nghiệm nếu cần trong vòng 24 giờ sau khi nhận mẫu.
          </p>
          <p className="text-gray-700">
            - Xét nghiệm làm giấy khai sinh tại Việt Nam trong nước.
          </p>
          <p className="text-gray-700">
            - Xét nghiệm tại nước ngoài, nếu cần hợp pháp hóa lãnh sự tại Bộ Ngoại Giao, vui lòng liên hệ để được báo giá chi tiết.
          </p>
        </CardContent>
      </Card>
  </main>
);

export default ADNChaCon;

