import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function NewPassword() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const history = useHistory();

//   useEffect(() => {
//     if(authenticated){
//       history.push("/userpage");
//       return () => {
//         console.log("unmounting");
//         setAuthenticated(false);
//       }
//     } else {
//       fetchcookie();
//     }
//   }, [authenticated]);

const retrievePassword = async (e) => {

}

    return (
      <div className="default">
        <div className="SignOrReg">
          <div className="form-title">
              <h2>Register</h2>
          </div>
          <form onSubmit={retrievePassword}>
              <label>Username</label>
              <input type="text" onChange={(e) => {setUsername(e.target.value)}}></input>
              <label>Password</label>
              <input type="password" onChange={(e) => {setPassword(e.target.value)}}></input>
              <label>Re-enter Password</label>
              <input type="password" onChange={(e) => {setPassword2(e.target.value)}}></input>
              <button type="submit">Submit</button>
          </form>
          <a href="/"><p>Remembered password? Sign in.</p></a>
        </div>
        {/* <p style={{color: 'red', visibility: errMsg}}>Some fields are missing. Try again!</p>
        <p style={{color: 'red', visibility: pwErr}}>The passwords do not match. Try again!</p> */}
      </div>
    );
}
  
export default NewPassword;