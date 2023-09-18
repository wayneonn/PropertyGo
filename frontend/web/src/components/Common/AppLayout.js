import React from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';

const AppLayout = ({ children }) => {
  return (
    <div>
      <SideBar />
      <TopBar />
      {children}
    </div>
  );
};

export default AppLayout;
