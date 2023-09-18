import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Common/AppLayout'; // Import the layout component

import AdminProfile from './containers/AdminProfile';
import Faq from './containers/Faq';
import NotFound from './containers/NotFound'; // Import the Not Found component

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './containers/Login';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Use the layout for routes that need it */}
        <Route
          element={
            <AppLayout>
              <PrivateRoute />
            </AppLayout>
          }
        >
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/faqs" element={<Faq />} />
        </Route>

        {/* Route without the layout */}
        <Route path="/" element={!localStorage.getItem('loggedInAdmin') ? <Login /> : <Navigate to="/admin/profile" />} />

        {/* Not Found route without the layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
