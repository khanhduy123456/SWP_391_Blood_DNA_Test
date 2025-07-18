
import { Outlet } from 'react-router-dom';
import SidebarManager from './slideBarManager';

const ManagerLayout = ({ role }: { role: string }) => {
  return (
    <div className="flex">
      <SidebarManager role={role} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
