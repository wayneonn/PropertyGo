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
import UsersList from "./containers/UsersList";
import UserDetail from "./containers/UserDetail";
import PropertyListing from "./containers/PropertyListing";
import Property from "./containers/Property";
import PartnerApplication from "./containers/PartnerApplication";
import Notification from "./containers/Notification";
import LawyersList from "./containers/LawyersList";
import LawyerDetail from "./containers/LawyerDetail";
import ContractorsList from "./containers/ContractorsList";
import ContractorDetail from "./containers/ContractorDetail";
import AllProperties from "./containers/AllProperties";
import AllProperty from "./containers/AllProperty";
import Otp from "./containers/Otp";
import Payment from "./containers/Payment";

import "bootstrap/dist/css/bootstrap.min.css";

import PrivateRoute from "./PrivateRoute";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51O28syIn7f8SMRLwcw29qbwrE1K3EwJUAC1uXgqnWO8sYsri8EdL4WI8prHJ5y6kzvre0yFDgVdja2hPlOr32kRz00gMpVYlqW"
);

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
          <Route path="/partner-application" element={<PartnerApplication />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/lawyers" element={<LawyersList />} />
          <Route path="/lawyers/details/:lawyerId" element={<LawyerDetail />} />
          <Route path="/contractors" element={<ContractorsList />} />
          <Route
            path="/contractors/details/:contractorId"
            element={<ContractorDetail />}
          />
          <Route path="/properties" element={<AllProperties />} />
          <Route path="/property/:propertyId" element={<AllProperty />} />
          <Route path="/otp" element={<Otp />} />
          {/* <Route
            path="/otp"
            element={
              <Elements stripe={stripePromise}>
                <Payment />{" "}
              </Elements>
            }
          /> */}
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
