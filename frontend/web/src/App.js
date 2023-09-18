import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import Foot from "./components/Common/Foot";
import AdminProfile from "./containers/AdminProfile";
import Faq from "./containers/Faq";
import ContactUs from "./containers/ContactUs";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login";

function App() {
  // const PrivateRoute = () => {
  //   const admin = JSON.parse(localStorage.getItem("loggedInAdmin"));
  //   return admin ? <AdminProfile/> : <Navigate to="/login" replace />;
  // }

  // const AnonymousRoute = () => {
  //   const admin = JSON.parse(localStorage.getItem("loggedInAdmin"));
  //   return admin ? <Navigate to="/admin/profile" replace /> : <Login/>;
  // }

  {
    /* <Route path="/admin/profile" element={JSON.parse(localStorage.getItem("loggedInAdmin")) ? <AdminProfile /> : <Navigate to="/login" />} />
        <Route path="/login" element={JSON.parse(localStorage.getItem("loggedInAdmin")) ? <AdminProfile /> : <Login />} /> */
  }

  return (
    <div className="App">
      {/* <SideBar></SideBar>
      <TopBar></TopBar> */}
      <ContactUs></ContactUs>
      <Foot></Foot>
    </div>
    // <BrowserRouter>
    //   <SideBar />
    //   <TopBar />
    //   <Foot />
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/admin/profile" element={<AdminProfile />} />
    //     <Route path="/admin/faq" element={<Faq />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
