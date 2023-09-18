import React from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';
import Footer from './Footer';

const AppLayout = ({ children }) => {
  return (
    <div>
      <SideBar />
      <TopBar />
      {children}
      <Footer />
    </div>
  );
};

export default AppLayout;
