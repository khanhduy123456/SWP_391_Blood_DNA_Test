import { Outlet } from 'react-router-dom';
import Sidebar from './components/navBar';

const AdminLayout = ({ role }: { role: string }) => {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
