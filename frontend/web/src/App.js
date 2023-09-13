import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Login from "../containers/login.js";

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
      <Login></Login>
    </div>
  );
}

export default App;
