import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import TopBar from './TopBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-800 flex flex-col">
      <TopBar />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;