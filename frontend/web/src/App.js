import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
// import Login from "./containers/login";
import Sidebar from "./components/Common/Sidebar";
import Topbar from "./components/Common/Topbar";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [listOfPosts, setListOfPosts] = useState([]);

  // useEffect(() => {
  //   axios.get("http://localhost:3000/users").then((response) => {
  //     setListOfPosts(response.data);
  //   });
  // }, []);
  return (
    <div className="App">
      {/* {listOfPosts.map((value, key) => {
        return (
          <div className="user">
            <div className="title"> {value.title} </div>
            <div className="body">{value.postText}</div>
            <div className="footer">{value.username}</div>
          </div>
        );
      })} */}
      {/* <Login></Login> */}
      <Sidebar></Sidebar>
      <Topbar></Topbar>
    </div>
  );
}

export default App;
