import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./containers/login";
import SideBar from "./components/Common/SideBar";
import TopBar from "./components/Common/TopBar";
import AdminProfile from "./containers/AdminProfile";
import Faq from "./containers/Faq";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login";
import HomeContainer from "./containers/HomeContainer";

function App() {
  // useEffect(() => {
  //   axios.get("http://localhost:3000/users").then((response) => {
  //     setListOfPosts(response.data);
  //   });
  // }, []);
  return (
    <div className="App">
      {/* <Login></Login> */}
      <SideBar></SideBar>
      <TopBar></TopBar>
      {/* <AdminProfile></AdminProfile> */}
      <Faq></Faq>
    </div>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/login" element={<HomeContainer/>}/>
    //     <Route path="/" element={<Login/>}/>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
