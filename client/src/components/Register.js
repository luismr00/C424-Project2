import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("hidden");
  const [pwErr, setPwError] = useState("hidden");
  const [authenticated, setAuthenticated] = useState(false);

  const history = useHistory();

  const signup = async (e) => {
    e.preventDefault();

    console.log(username, password, firstName, lastName, email);

    if ((!username || !password || !firstName || !lastName || !email)) {
      setErrMsg("visible");
      setPwError("hidden");
    } else if (password !== password2) {
      setPwError("visible");
      setErrMsg("hidden"); 
    } else {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
        }),
      })
      const data = await res.json();
      if(data.success) {
        console.log("registered successful");
        setErrMsg("hidden");
        history.push("/userpage");
      } else {
        setErrMsg("visible");
        console.log("registered failed: ", data.err);
      }
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
              <h2>Register</h2>
          </div>
          <form onSubmit={signup}>
              <label>Username</label>
              <input type="text" onChange={(e) => {setUsername(e.target.value)}}></input>
              <label>Password</label>
              <input type="password" onChange={(e) => {setPassword(e.target.value)}}></input>
              <label>Re-enter Password</label>
              <input type="password" onChange={(e) => {setPassword2(e.target.value)}}></input>
              <label>First Name</label>
              <input type="text" onChange={(e) => {setFirstName(e.target.value)}}></input>
              <label>Last Name</label>
              <input type="text" onChange={(e) => {setLastName(e.target.value)}}></input>
              <label>Email</label>
              <input type="text" onChange={(e) => {setEmail(e.target.value)}}></input>
              <button type="submit">Submit</button>
          </form>
          <a href="/"><p>Registered already? Sign in.</p></a>
        </div>
        <p style={{color: 'red', visibility: errMsg}}>Some fields are missing. Try again!</p>
        <p style={{color: 'red', visibility: pwErr}}>The passwords do not match. Try again!</p>
      </div>
    );
}
  
export default Register;