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
import Dashboard from '@/features/admin/pages/dashboard';
import UserManagement from '@/features/admin/pages/userManager';
import KitManagement from '@/features/admin/pages/kitManager';
import AdminLayout from '@/pages/admin/adminLayout';
import { BookingModal } from '@/pages/services/components/booking';
import SampleMethodManagement from '@/features/admin/pages/sampleManager';
import HomeBody from '@/features/home/HomeBody';
import ADNChaCon from '@/pages/services/priceservice/khaisinh';
import NotFound from '@/features/auth/pages/notFound';
import StaffLayout from '@/pages/staff/page/staffLayout';
import ServiceManager from '@/pages/staff/component/serviceManager';
// import BlogApp from '@/features/admin/pages/blogpost/blogApp';
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
        </Route>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
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
            <Route path="/admin/booking-modal" element={<BookingModal isOpen={true} onClose={() => {}} />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<StaffLayout role="Staff" />}>
            {/* <Route path="/staff" element={<StaffDashboard />} /> */}
            <Route path="/staff/kits" element={<KitManagement />} />
            <Route path="/staff/services" element={<ServiceManager />} />
          </Route>

          {/* Manager Routes */}
          {/* <Route element={<ManagerLayout role="Manager" />}>
            <Route path="/manager/test-management" element={<TestManagement />} />
          </Route> */}

          {/* Client Routes */}
          {/* <Route element={<ClientLayout role="Client" />}>
            <Route path="/customer" element={<CustomerDashboard />} />
          </Route> */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;