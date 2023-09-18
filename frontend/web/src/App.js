import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import AdminProfile from "./containers/AdminProfile";
import Faq from "./containers/Faq";
import ContactUs from "./containers/ContactUs";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <SideBar />
      <TopBar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/faqs" element={<Faq />} />
          <Route path="/admin/contact-us" element={<ContactUs />} />
        </Route>
        <Route
          path="/login"
          element={
            !localStorage.getItem("loggedInAdmin") ? (
              <Login />
            ) : (
              <Navigate to="/admin/profile" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
