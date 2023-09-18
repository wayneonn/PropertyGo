import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Common/AppLayout";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import AdminProfile from "./containers/AdminProfile";
import Faq from "./containers/Faq";
import ContactUs from "./containers/ContactUs";
import NotFound from "./components/Common/NotFound";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/faqs" element={<Faq />} />
          <Route path="/admin/contact-us" element={<ContactUs />} />
          <Route path="/admin" element={<NotFound />} />
        </Route>
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
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>

        {/* Route without the layout */}
        <Route
          path="/"
          element={
            !localStorage.getItem("loggedInAdmin") ? (
              <Login />
            ) : (
              <Navigate to="/profile" />
            )
          }
        />

        {/* Not Found route without the layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
