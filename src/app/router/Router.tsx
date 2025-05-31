import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { routes } from '@/shared/config/routes';
import { ProtectedRoute } from '../providers/route-guard';
import Home from '@/pages/Home';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        

        <Route element={<ProtectedRoute />}> 
        {/* dành cho các role ngoài guest */}
        
          {/* <Route path={routes.adminDashboard} element={<AdminDashboard />} /> */}

        </Route>
      </Routes>
    </Router>
  );
};