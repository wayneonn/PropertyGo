import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Common/AppLayout";

// common components
import NotFound from "./components/Common/NotFound";

// containers
import AdminProfile from "./containers/AdminProfile";
import Forum from "./containers/Forum";
import Faq from "./containers/Faq";
import ContactUs from "./containers/ContactUs";
import Login from "./containers/Login";

import "bootstrap/dist/css/bootstrap.min.css";

import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="/forum" element={<Forum />} />
        </Route>

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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
