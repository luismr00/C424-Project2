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
      updateLogs();
      console.log("logout successful");
      setAuthenticated(false);
      setUser(null);
    } else {
      console.log("logout failed");
    }
  }

  //'/api/updateLog'
  const updateLogs = async () => {

    let logTimes = user.logTimes;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let fulldate = month + '-' + day + '-' + year;

    const res = await fetch("http://localhost:4000/api/updateLog", {
      method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          logTimes: logTimes + 1,
          lastLogDate: fulldate
        }),
    })
  }

  useEffect(() => {
    console.log("fetching cookie for loggin in...");
    const fetchcookie = async () => {
      const res = await fetch("http://localhost:4000/", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

      })
      const data = await res.json();
      if(data.user != null && data.user.activated === "active"){
        setAuthenticated(true);
        setUser(data.user);
        console.log(data.user)
      } else {
        console.log("user is not logged in or hasn't activated account");
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
          <p>Times logged in: {user?.logTimes} Last logged in: {user?.lastLogDate}</p>
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