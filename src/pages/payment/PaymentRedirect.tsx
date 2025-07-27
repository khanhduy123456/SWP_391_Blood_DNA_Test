import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setLoading(true);
        
        // Lấy query string từ URL
        const queryString = window.location.search;
        
        console.log('Current domain:', window.location.href);
        console.log('Query string:', queryString);
        console.log('Redirect attempts:', redirectAttempts);
        
        // Giới hạn số lần thử redirect để tránh vòng lặp vô hạn
        if (redirectAttempts > 3) {
          setError('Quá nhiều lần thử chuyển hướng. Vui lòng thử lại.');
          return;
        }
        
        // Kiểm tra nếu đang ở BE domain
        if (window.location.hostname === 'cdel-production.up.railway.app') {
          console.log('Detected BE domain, redirecting to frontend...');
          
          // Redirect về frontend domain
          const frontendUrl = `https://swp-391-blood-dna-test.vercel.app/payment-return${queryString}`;
          
          console.log('Redirecting from BE to frontend:', frontendUrl);
          
          // Tăng số lần thử
          setRedirectAttempts(prev => prev + 1);
          
          // Redirect về frontend
          window.location.href = frontendUrl;
          return;
        }
        
        // Nếu đang ở frontend domain nhưng có API path (proxy route)
        if (window.location.pathname.includes('/api/Payment/payment-return')) {
          console.log('Detected API path on frontend, redirecting to payment-return...');
          
          const frontendUrl = `/payment-return${queryString}`;
          console.log('Redirecting to frontend URL:', frontendUrl);
          
          // Tăng số lần thử
          setRedirectAttempts(prev => prev + 1);
          
          // Redirect đến PaymentReturn component
          window.location.href = frontendUrl;
          return;
        }
        
        // Nếu đã ở đúng URL payment-return, không cần redirect nữa
        if (window.location.pathname === '/payment-return') {
          console.log('Already on correct payment-return page');
          setLoading(false);
          return;
        }
        
        // Fallback: redirect đến payment-return
        console.log('Fallback redirect to payment-return');
        const frontendUrl = `/payment-return${queryString}`;
        window.location.href = frontendUrl;
        
      } catch (error) {
        console.error('Error during redirect:', error);
        setError('Có lỗi xảy ra khi chuyển hướng: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [searchParams, redirectAttempts]);

  const handleRetry = () => {
    setError(null);
    setRedirectAttempts(0);
    setLoading(true);
    // Reload page để thử lại
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Lỗi chuyển hướng</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Thử lại
            </button>
            <button 
              onClick={() => window.location.href = '/customer/booking-list'}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Về trang đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Đang chuyển hướng...</h2>
        <p className="text-gray-600 mb-2">Vui lòng chờ trong giây lát</p>
        {loading && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Tự động chuyển hướng về trang kết quả thanh toán</p>
            {redirectAttempts > 0 && (
              <p className="text-xs text-gray-400 mt-1">Lần thử: {redirectAttempts}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRedirect; 