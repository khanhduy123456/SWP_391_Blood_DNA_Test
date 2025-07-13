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
import DNAKhaiSinhPage from '@/pages/services/priceservice/khaisinh';
import ServiceManager from '@/pages/staff/page/serviceManager';// import BlogApp from '@/features/admin/pages/blogpost/blogApp';
import BookingAssign from '@/pages/staff/page/bookingAssign';
// Thêm các component cho Staff, Manager, Client

export const AppRouter = () => {
  // Giả định role được lấy từ context hoặc localStorage sau khi đăng nhập
  // Bạn nên thay thế bằng logic thực tế, ví dụ: useAuthContext hoặc localStorage.getItem('userRole')
  // const userRole = localStorage.getItem('userRole') || 'Guest';

  return (
    <Router>
      <Routes>
          {/* Public Routes with Home Layout */}
        <Route element={<Home />}>
          <Route path={routes.home} element={<HomeBody />} />
          <Route path={routes.adnChaCon} element={<ADNChaCon />} />
          <Route path={routes.adnKhaiSinh} element={<DNAKhaiSinhPage />} />
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
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/kits" element={<KitManagement />} />
            {/* <Route path='/admin/blogs' element={<BlogApp/>} /> */}
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
          </Route>

          {/* Manager Routes */}
          {/* <Route element={<ManagerLayout role="Manager" />}>
            <Route path="/manager/test-management" element={<TestManagement />} />
          </Route> */}

          {/* Customer Routes */}
          <Route element={<CusLayout role="Customer" />}>
            {/* <Route path="/customer" element={<CustomerDashboard />} /> */}
            <Route path="/customer/kits" element={<KitManagement />} />
            <Route path="/customer/booking-page" element={<BookingPage />} />
            <Route path="/customer/booking-list" element={<BookingList />} />
            <Route path="/customer/profile" element={<Profile />} />
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