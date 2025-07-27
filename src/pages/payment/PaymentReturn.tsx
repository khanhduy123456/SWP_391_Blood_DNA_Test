import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handlePaymentReturn } from './api/payment.api';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Home,
  CreditCard,
  FileText
} from 'lucide-react';

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<{ message: string; transactionId: string } | null>(null);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy tất cả query parameters từ URL
        const queryString = window.location.search;
        console.log('Payment return URL:', window.location.href);
        console.log('Query string:', queryString);

        // Kiểm tra nếu đang ở BE domain, redirect về frontend
        if (window.location.hostname === 'cdel-production.up.railway.app') {
          const frontendUrl = `https://swp-391-blood-dna-test.vercel.app/payment-return${queryString}`;
          console.log('Redirecting from BE to frontend:', frontendUrl);
          window.location.href = frontendUrl;
          return;
        }

        // Kiểm tra nếu đang ở frontend URL nhưng có API path (proxy route)
        if (window.location.pathname.includes('/api/Payment/payment-return')) {
          const frontendUrl = `/payment-return${queryString}`;
          console.log('Redirecting to frontend URL:', frontendUrl);
          window.history.replaceState({}, '', frontendUrl);
          
          // Thêm delay nhỏ để đảm bảo URL đã được cập nhật
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Kiểm tra payment status từ URL params
        const responseCode = searchParams.get('vnp_ResponseCode');
        const transactionStatus = searchParams.get('vnp_TransactionStatus');
        
        console.log('Payment status from URL:', { responseCode, transactionStatus });

        // Gọi API để xác nhận và lưu payment vào database
        let apiSuccess = false;
        try {
          console.log('Calling BE API to confirm payment...');
          const result = await handlePaymentReturn();
          console.log('Payment confirmation result:', result);
          setPaymentResult(result);
          apiSuccess = true;
          
          // Hiển thị toast thành công từ BE
          if (result && result.message) {
            toast.success(`✅ ${result.message}`);
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          // Vẫn tiếp tục xử lý với URL params nếu API fail
          toast.error('⚠️ Không thể xác nhận với server, nhưng vẫn hiển thị kết quả từ VNPay');
        }

        // Chỉ hiển thị toast từ VNPay nếu API call thất bại
        if (!apiSuccess) {
          if (responseCode === '00' && transactionStatus === '00') {
            toast.success('✅ Thanh toán thành công!');
          } else if (responseCode && responseCode !== '00') {
            toast.error('❌ Thanh toán thất bại!');
          }
        }
      } catch (error) {
        console.error('Error processing payment return:', error);
        setError('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
      } finally {
        setLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams]);

  const getPaymentStatus = () => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    
    if (responseCode === '00' && transactionStatus === '00') {
      return 'success';
    } else if (responseCode === '24') {
      return 'cancelled';
    } else {
      return 'failed';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Success':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          title: 'Thanh toán thành công!',
          description: 'Đơn hàng của bạn đã được thanh toán thành công.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'cancelled':
        return {
          icon: <Clock className="h-12 w-12 text-yellow-600" />,
          title: 'Thanh toán bị hủy',
          description: 'Bạn đã hủy quá trình thanh toán.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'failed':
        return {
          icon: <XCircle className="h-12 w-12 text-red-600" />,
          title: 'Thanh toán thất bại',
          description: 'Có lỗi xảy ra trong quá trình thanh toán.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <AlertCircle className="h-12 w-12 text-gray-600" />,
          title: 'Trạng thái không xác định',
          description: 'Không thể xác định trạng thái thanh toán.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const formatAmount = (amount: string) => {
    // VNPay trả về amount * 100, nên chia cho 100
    const numAmount = parseInt(amount) / 100;
    return numAmount.toLocaleString() + ' VNĐ';
  };

  const formatDate = (dateString: string) => {
    // Format: 20250727011639 -> 27/07/2025 01:16:39
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const status = getPaymentStatus();
  const statusInfo = getStatusInfo(status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                KẾT QUẢ THANH TOÁN
              </h1>
              <p className="text-gray-600 text-sm">Xem kết quả giao dịch thanh toán VNPay</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                <p className="text-blue-600 font-medium text-lg">Đang xử lý kết quả thanh toán...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="shadow-sm border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Result */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={`shadow-sm border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  {statusInfo.icon}
                  <div>
                    <h2 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>
                      {statusInfo.title}
                    </h2>
                    <p className="text-gray-600">{statusInfo.description}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${status === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 
                               status === 'cancelled' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                               'bg-red-100 text-red-800 border-red-200'}`}
                  >
                    {status === 'success' ? 'Thành công' : 
                     status === 'cancelled' ? 'Đã hủy' : 'Thất bại'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payment Result from API */}
            {paymentResult && (
              <Card className="shadow-sm border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{paymentResult.message}</p>
                      <p className="text-sm text-green-600">Transaction ID: {paymentResult.transactionId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Chi tiết giao dịch
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã giao dịch</p>
                    <p className="font-medium">{searchParams.get('vnp_TransactionNo') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-medium">{searchParams.get('vnp_TxnRef') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số tiền</p>
                    <p className="font-medium text-green-600">
                      {searchParams.get('vnp_Amount') ? formatAmount(searchParams.get('vnp_Amount')!) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngân hàng</p>
                    <p className="font-medium">{searchParams.get('vnp_BankCode') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-medium">
                      {searchParams.get('vnp_PayDate') ? formatDate(searchParams.get('vnp_PayDate')!) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã phản hồi</p>
                    <p className="font-medium">{searchParams.get('vnp_ResponseCode') || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Thông tin đơn hàng</p>
                  <p className="font-medium text-sm">
                    {decodeURIComponent(searchParams.get('vnp_OrderInfo') || 'N/A')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/customer/booking-list')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Xem đơn hàng
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Toast Container */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
};

export default PaymentReturn; 