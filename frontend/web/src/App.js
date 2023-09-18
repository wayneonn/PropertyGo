import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Common/AppLayout'; 

import AdminProfile from './containers/AdminProfile';
import Faq from './containers/Faq';
import NotFound from './containers/NotFound';  
import ContactUs from './containers/ContactUs';

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login";
import PrivateRoute from "./PrivateRoute";

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
          <Route path="/contact-us" element={<ContactUs/>} />
        </Route>

        {/* Route without the layout */}
        <Route path="/" element={!localStorage.getItem('loggedInAdmin') ? <Login /> : <Navigate to="/profile" />} />

        {/* Not Found route without the layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
