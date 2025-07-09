import { Outlet } from 'react-router-dom';
import SidebarCustomer from './slideBarCus';
import Header from '@/features/home/HomeHeader';
import Footer from '@/features/home/HomeFooter';

const StaffLayout = ({ role }: { role: string }) => {
  // Lấy userId và username từ localStorage
  const userId = localStorage.getItem("userId") || undefined;
  const username = localStorage.getItem("username") || undefined;
  const user = { id: userId, username };
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <div className="flex flex-1">
        <SidebarCustomer role={role} />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StaffLayout;
