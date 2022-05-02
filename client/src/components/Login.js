import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


function Login() {

  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("hidden");
  const [authenticated, setAuthenticated] = useState(false);

  const history = useHistory();

  const signIn = async (e) => {
    e.preventDefault();

    console.log("checking email and password entered");
    console.log(email, password);

    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'credentials': 'include'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
    const data = await res.json();
    if(data.success) {
      console.log("login successful");
      setErrMsg("hidden");
      history.push("/userpage");
    } else {
      setErrMsg("visible");
      console.log("login failed: ", data.err);
    }
  }

  const fetchcookie = async () => {
    try{
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
      } else {
        console.log("user is not logged in");
        setAuthenticated(false);
      }
    } catch(err){
      console.log("error: ", err);
    }
  }

  useEffect(() => {
    if(authenticated){
      history.push("/userpage");
      return () => {
        console.log("unmounting");
        setAuthenticated(false);
      }
    } else {
      fetchcookie();
    }
  }, [authenticated]);

    return (
      <div className="default">
        <div className="SignOrReg">
          <div className="form-title">
              <h2>Log In</h2>
          </div>
          <form onSubmit={signIn}>
              <label>Email</label>
              <input type="text" id="username" onChange={(e) => {setEmail(e.target.value)}}></input>
              <label>Password</label>
              <input type="password" id="password" onChange={(e) => {setPassword(e.target.value)}}></input>
              <button type="submit">Submit</button>
          </form>
          <a href="/register"><p>Not registered? Sign up.</p></a>
        </div>
        <p style={{color: 'red', visibility: errMsg}}>Username or password is invalid. Try again!</p>
      </div>
    );
}
  
export default Login;