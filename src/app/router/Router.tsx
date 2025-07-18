import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { routes } from '@/shared/config/routes';
import { ProtectedRoute } from '../providers/route-guard';
import Home from '@/pages/Home';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import Dashboard from '@/features/admin/pages/dashboard';
import UserManagement from '@/features/admin/pages/userManager';
import KitManagement from '@/features/admin/pages/kitManager';
import AdminLayout from '@/pages/admin/adminLayout';
import { BookingModal } from '@/pages/customer/components/bookingPopup';
import SampleMethodManagement from '@/features/admin/pages/sampleManager';
import HomeBody from '@/features/home/HomeBody';
import ADNChaCon from '@/pages/services/priceservice/chacon';
import NotFound from '@/features/auth/pages/notFound';
import StaffLayout from '@/pages/staff/staffLayout';
import CusLayout from '@/pages/customer/cusLayout';
import { BookingPage } from '@/pages/customer/page/booking';
import Profile from '@/pages/customer/page/profile';
import BookingList from '@/pages/customer/page/booking-list';
import ResultCus from '@/pages/customer/page/resultCus';
import DNAKhaiSinhPage from '@/pages/services/priceservice/khaisinh';
import ServiceManager from '@/pages/staff/page/serviceManager';
import BookingAssign from '@/pages/staff/page/bookingAssign';
import KitDeliveryManagement from '@/pages/staff/page/kitDeliveryManager';
import NewsList from '@/features/home/NewsList';
import NewsDetail from '@/features/home/NewsDetail';
import BlogApp from '@/features/admin/pages/blogpost/blogApp';
import ManagerLayout from '@/pages/manager/managerLayout';
import RequestCompletedManager from '@/pages/manager/pages/requestCompletedManager';
import ExResultManager from '@/pages/manager/pages/exResultManager';
import { managerRoutes } from '@/shared/config/routes';
import ResultUploadManager from '@/pages/staff/page/resultUploadManager';

export const AppRouter = () => {
  // Giả định role được lấy từ context hoặc localStorage sau khi đăng nhập
  // Bạn nên thay thế bằng logic thực tế, ví dụ: useAuthContext hoặc localStorage.getItem('userRole')

  return (
    <Router>
      <Routes>
          {/* Public Routes with Home Layout */}
        <Route element={<Home />}>
          <Route path={routes.home} element={<HomeBody />} />
          <Route path={routes.adnChaCon} element={<ADNChaCon />} />
          <Route path={routes.adnKhaiSinh} element={<DNAKhaiSinhPage />} />
          <Route path={routes.news} element={<NewsList />} />
          <Route path={routes.newsDetail(':id')} element={<NewsDetail />} />
        </Route>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.forgotPassword} element={<ForgotPassword />} />
        <Route path={routes.resetPassword} element={<ResetPassword />} />
        <Route path={routes.notFound} element={<NotFound />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Admin Routes */}
          <Route element={<AdminLayout role="Admin" />}>
          <Route path="users" element={<UserManagement />} />
            {/* <Route index element={<Navigate to="/admin/users" replace />} /> */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/kits" element={<KitManagement />} />
            <Route path="/admin/blogs" element={<BlogApp />} />
            <Route path="/admin/sample-methods" element={<SampleMethodManagement />} />
            <Route path="/admin/booking-modal" element={<BookingModal isOpen={true} onClose={() => {}} userId={1} />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<StaffLayout role="Staff" />}>
            {/* <Route path="/staff" element={<StaffDashboard />} /> */}
            <Route path="/staff/kits" element={<KitManagement />} />
            <Route path="/staff/sample-methods" element={<SampleMethodManagement />} />
            <Route path="/staff/services" element={<ServiceManager/>} />
            <Route path="/staff/booking-assign" element={<BookingAssign/>} />
            <Route path="/staff/kit-deliveries" element={<KitDeliveryManagement/>} />
            <Route path="/staff/result-upload" element={<ResultUploadManager/>} />
          </Route>

          {/* Manager Routes */}
          <Route element={<ManagerLayout role="Manager" />}>
            <Route path={managerRoutes.requestCompleted} element={<RequestCompletedManager />} />
            <Route path={managerRoutes.exResult} element={<ExResultManager />} />
          </Route>

          {/* Customer Routes */}
          <Route element={<CusLayout role="Customer" />}>
            {/* <Route path="/customer" element={<CustomerDashboard />} /> */}
            <Route path="/customer/kits" element={<KitManagement />} />
            <Route path="/customer/booking-page" element={<BookingPage />} />
            <Route path="/customer/booking-list" element={<BookingList />} />
            <Route path="/customer/profile" element={<Profile />} />
            <Route path="/customer/results" element={<ResultCus />} />
            <Route path="/customer/booking-modal" element={<BookingModal isOpen={true} onClose={() => {}} userId={1} />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;