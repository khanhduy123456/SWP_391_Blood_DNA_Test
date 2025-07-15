
import { Outlet } from 'react-router-dom';
import SidebarManager from './slideBarManager';

const StaffLayout = ({ role }: { role: string }) => {
  return (
    <div className="flex">
      <SidebarManager role={role} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
