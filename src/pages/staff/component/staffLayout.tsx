
import { Outlet } from 'react-router-dom';
import SidebarStaff from './slideBarStaff';

const StaffLayout = ({ role }: { role: string }) => {
  return (
    <div className="flex">
      <SidebarStaff role={role} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
