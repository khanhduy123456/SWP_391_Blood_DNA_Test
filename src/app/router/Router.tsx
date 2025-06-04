import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { routes } from '@/shared/config/routes';
import { ProtectedRoute } from '../providers/route-guard';
import Home from '@/pages/Home';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/register';


export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* router auth */}
        <Route path={routes.home} element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        <Route element={<ProtectedRoute />}> 
        {/* dành cho các role ngoài guest */}
        
          {/* <Route path={routes.adminDashboard} element={<AdminDashboard />} /> */}

        </Route>
      </Routes>
    </Router>
  );
};