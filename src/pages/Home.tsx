import { Outlet } from 'react-router-dom';
import Header from '../features/home/HomeHeader';
import Footer from '../features/home/HomeFooter';

export default function Home() {
  // Lấy userId và username từ localStorage
  const userId = localStorage.getItem("userId") || undefined;
  const username = localStorage.getItem("username") || undefined;
  const user = { id: userId, username };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <div className="flex-grow pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}