import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import AdminProfile from "./containers/AdminProfile";
import Faq from "./containers/Faq";

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

  return (
    <BrowserRouter>
      <SideBar />
      <TopBar />
      <Routes>
        {/* <Route path="/admin/profile" element={JSON.parse(localStorage.getItem("loggedInAdmin")) ? <AdminProfile /> : <Navigate to="/login" />} />
        <Route path="/login" element={JSON.parse(localStorage.getItem("loggedInAdmin")) ? <AdminProfile /> : <Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/faq" element={<Faq/>} />
      </Routes>
      {/* <Faq/> */}
    </BrowserRouter>
    // <div className="App">
    //   {/* <Login></Login> */}
    //   <SideBar></SideBar>
    //   <TopBar></TopBar>
    //   {/* <AdminProfile></AdminProfile> */}
    //   <Faq></Faq>
    // </div>

  );
}

export default App;
