import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./containers/login";
import Sidebar from "./components/Common/Sidebar";
import Topbar from "./components/Common/Topbar";

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
    // <div className="App">
    //   {/* {listOfPosts.map((value, key) => {
    //     return (
    //       <div className="user">
    //         <div className="title"> {value.title} </div>
    //         <div className="body">{value.postText}</div>
    //         <div className="footer">{value.username}</div>
    //       </div>
    //     );
    //   })} */}
    //   {/* <Login></Login> */}
    //   <Sidebar></Sidebar>
    //   <Topbar></Topbar>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<HomeContainer/>}/>
        <Route path="/" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
