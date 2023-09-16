import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import AdminProfile from "./containers/AdminProfile";

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
          <Route path="/login" element={JSON.parse(localStorage.getItem("loggedInAdmin")) ? <AdminProfile /> : <Login />}/> */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
