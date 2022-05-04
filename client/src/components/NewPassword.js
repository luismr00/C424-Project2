import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function NewPassword() {

  const [email, setEmail] = useState("");
  const [changePassword, setChangePassword] = useState(true);

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
    e.preventDefault();

    console.log("sending email link to " + email);

    //send a link to email for resetting the password
    //email is verified on the backend already when you call this fetch request
    const res = await fetch("http://localhost:4000/reset-password-email", {
      method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      })
    const data = await res.json();
    if(data.success) {
      console.log("Reset link successfully sent to the email");
      //change UI interface to something that displays success with a state and components
      setChangePassword(false);
    } else {
      console.log("Failed to send link to email");
    }
  }

  return (
    <div className="default">
      {changePassword ?
        <div className="SignOrReg">
          <div className="form-title">
              <h2>Reset Password</h2>
          </div>
          <form onSubmit={retrievePassword}>
              <label>Email</label>
              <input type="email" onChange={(e) => {setEmail(e.target.value)}}></input>
              <button type="submit">Submit</button>
          </form>
          <a href="/"><p>Remembered password? Sign in.</p></a>
        </div>
        :
        <div>
          <p>Successfully sent an email link to reset the password</p>
        </div>
      }
      {/* <p style={{color: 'red', visibility: errMsg}}>Some fields are missing. Try again!</p>
      <p style={{color: 'red', visibility: pwErr}}>The passwords do not match. Try again!</p> */}
    </div>
  );
}
  
export default NewPassword;