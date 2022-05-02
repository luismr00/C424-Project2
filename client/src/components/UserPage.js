import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";



function UserPage() {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();

  const logout = async () => {
    const res = await fetch("http://localhost:4000/logout", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json();
    if(data.success) {
      console.log("logout successful");
      setAuthenticated(false);
      setUser(null);
    } else {
      console.log("logout failed");
    }
  }

  useEffect(() => {
    const fetchcookie = async () => {
      const res = await fetch("http://localhost:4000/", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

      })
      const data = await res.json();
      if(data.user != null){
        setAuthenticated(true);
        setUser(data.user);
        console.log(data.user)
      } else {
        console.log("user is not logged in");
        setAuthenticated(false);
        history.push("/");
      }
    }
    if(!authenticated){
      fetchcookie();
    }
  }, [authenticated]);

  return (
    <div className="App default">
      { authenticated ?
        <div>
          <h1>Welcome, {user?.firstName} </h1>
          <button onClick={logout}>Logout</button>
          <button><a href={require("../assets/company_confidential_file.txt")} download="myFile">Download File</a></button>
        </div>
        : 
        <div>
          <h1>Please login</h1>
          <a href="/"><p>Sign in</p></a>
          <a href="/register"><p>Register</p></a>
        </div>
      }
    </div>
  );
}
  
export default UserPage;