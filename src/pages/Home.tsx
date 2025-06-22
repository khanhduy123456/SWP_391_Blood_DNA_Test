import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../features/home/HomeHeader';
import Footer from '../features/home/HomeFooter';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}