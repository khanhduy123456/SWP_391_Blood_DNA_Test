import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  TestTube, 
  Dna,
  Heart,
  Loader2,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getExResultsByUser, type ExResult, type PagedExResultResponse } from '../api/exResult.api';
import { getExRequestsByAccountId } from '../api/exRequest.api';
import type { ExRequestResponse } from '../types/exRequestPaged';
import { getAllService } from '@/pages/staff/api/service.api';
import { getAllSampleMethods } from '@/features/admin/api/sample.api';
import type { Service } from '@/pages/staff/type/service';
import type { SampleMethod } from '@/features/admin/types/method';
import toast from 'react-hot-toast';

// Hàm parseJwt để lấy userId từ accessToken
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Mapping trạng thái request
const REQUEST_STATUS_MAP: Record<string, string> = {
  '1': 'Not Accepted',
  '2': 'Accepted',
  '3': 'Sample Collected',
  '4': 'Processing',
  '5': 'Completed'
};

const ResultCus: React.FC = () => {
  const [results, setResults] = useState<ExResult[]>([]);
  const [requests, setRequests] = useState<ExRequestResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sampleMethods, setSampleMethods] = useState<SampleMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy userId từ access token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('Không tìm thấy access token');
          return;
        }

        const payload = parseJwt(token);
        const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (!userId) {
          toast.error('Không thể lấy userId từ token');
          return;
        }

        // Lấy kết quả xét nghiệm
        const resultsData: PagedExResultResponse = await getExResultsByUser(Number(userId), currentPage, pageSize);
        setResults(resultsData.items || []);
        setTotalPages(resultsData.totalPages || 1);

        // Lấy danh sách request để hiển thị thông tin chi tiết
        const requestsData = await getExRequestsByAccountId(Number(userId), 1, 1000); // Lấy tất cả request
        setRequests(requestsData.items || []);

        // Lấy danh sách services và sample methods
        const [servicesData, sampleMethodsData] = await Promise.all([
          getAllService(),
          getAllSampleMethods()
        ]);
        setServices(servicesData);
        setSampleMethods(sampleMethodsData);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error('Không thể tải dữ liệu kết quả xét nghiệm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  // Tìm thông tin request theo requestId
  const getRequestInfo = (requestId: number) => {
    return requests.find(req => req.id === requestId);
  };

  // Tìm tên service
  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Không xác định';
  };

  // Tìm tên sample method
  const getSampleMethodName = (sampleMethodId: number) => {
    const method = sampleMethods.find(m => m.id === sampleMethodId);
    return method?.name || 'Không xác định';
  };

  // Format datetime
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Xem file kết quả
  const viewResult = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  // Tải file kết quả
  const downloadResult = (fileUrl: string, requestId: number) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `ket-qua-xet-nghiem-${requestId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg">Đang tải kết quả xét nghiệm...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Dna className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kết Quả Xét Nghiệm ADN</h1>
            <p className="text-gray-600 mt-1">Xem và tải xuống kết quả xét nghiệm huyết thống của bạn</p>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có kết quả xét nghiệm</h3>
            <p className="text-gray-600 text-center max-w-md">
              Hiện tại bạn chưa có kết quả xét nghiệm nào. Kết quả sẽ xuất hiện ở đây sau khi xét nghiệm hoàn thành.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {results.map((result) => {
            const requestInfo = getRequestInfo(result.requestId);
            
            return (
              <Card key={result.id} className="border-2 border-blue-100 hover:border-blue-200 transition-all duration-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          Kết quả xét nghiệm #{result.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Yêu cầu xét nghiệm #{result.requestId}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thông tin yêu cầu xét nghiệm */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                        Thông tin yêu cầu
                      </h3>
                      
                      {requestInfo ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Dịch vụ:</span>
                            <span className="font-medium text-gray-900">
                              {getServiceName(requestInfo.serviceId)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <TestTube className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Phương thức:</span>
                            <span className="font-medium text-gray-900">
                              {getSampleMethodName(requestInfo.sampleMethodId)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Lịch hẹn:</span>
                            <span className="font-medium text-gray-900">
                              {formatDateTime(requestInfo.appointmentTime)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Trạng thái:</span>
                            <Badge 
                              variant={requestInfo.statusId === '4' ? 'default' : 'secondary'}
                              className={requestInfo.statusId === '4' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {REQUEST_STATUS_MAP[requestInfo.statusId] || 'Không xác định'}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Không tìm thấy thông tin yêu cầu</span>
                        </div>
                      )}
                    </div>

                    {/* Thông tin kết quả */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-green-600" />
                        Thông tin kết quả
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Ngày có kết quả:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(result.resultDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Ngày tạo:</span>
                          <span className="font-medium text-gray-900">
                            {formatDateTime(result.createAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                          <span className="font-medium text-gray-900">
                            {formatDateTime(result.updateAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => viewResult(result.fileUrl)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Xem kết quả</span>
                      </Button>
                      
                      <Button
                        onClick={() => downloadResult(result.fileUrl, result.requestId)}
                        variant="outline"
                        className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4" />
                        <span>Tải xuống PDF</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Trước
            </Button>
            
            <div className="flex items-center px-4 py-2 text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
            
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCus;
