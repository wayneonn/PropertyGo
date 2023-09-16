import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import AdminProfile from "./containers/AdminProfile";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login";

function App() {
  return (
    <BrowserRouter>
      <SideBar />
      <TopBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
