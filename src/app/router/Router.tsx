// src/app/AppRouter.tsx
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
import NotFound from '@/features/home/notFound';
import Dashboard from '@/features/admin/pages/dashboard';
import UserManagement from '@/features/admin/pages/userManager';
import KitManagement from '@/features/admin/pages/kitManager';
import AdminLayout from '@/pages/admin/adminLayout';
import { BookingModal } from '@/pages/services/components/booking';


export const AppRouter = () => {
  const userRole = 'Admin'; 

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={routes.home} element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notfound" element={<NotFound />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout role={userRole} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/kits" element={<KitManagement />} />
             <Route path="/booking-modal" element={<BookingModal isOpen={true} onClose={() => {}} />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
