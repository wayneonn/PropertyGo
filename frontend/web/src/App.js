import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/Common/AppLayout";

// common components
import NotFound from "./components/Common/NotFound";

// containers
import AdminProfile from "./containers/AdminProfile";
import Forum from "./containers/Forum";
import Faq from "./containers/Faq";
import ContactUs from "./containers/ContactUs";
import Login from "./containers/Login";
import PartnerApplication from "./containers/PartnerApplication";

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
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/details/:userId" element={<UserDetail />} />
          <Route
            path="/users/details/:userId/property-listing"
            element={<PropertyListing />}
          />
          <Route path="/users/property/:propertyId" element={<Property />} />
          <Route path="/partnerapp" element={<PartnerApplication />} />
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
