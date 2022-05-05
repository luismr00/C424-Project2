import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

function ResetPassword() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [changePassword, setChangePassword] = useState(true);

  const history = useHistory();

  //get token from url
  const {pathname} = useLocation();
  const parse = pathname.split('/');
  const user = parse[2]
  const token = parse[3];
  // console.log(user, token);

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

const authorizeReset = async () => {
  const res = await fetch("http://localhost:4000/reset-password", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: user,
      token: token
    }),
  })
  const data = await res.json();
  if(data.success) {
    console.log("user is authorized to reset password");
    setAuthorized(true);
    //test redirect here for now
    // setTimeout(function() {
    //   window.location.replace('/');
    // }, 5000);
  } else {
    console.log("user is unauthorized either because the link either it expired or changed");
  }
}

// const user = req.body.user;
// const password = req.body.password;

useEffect(() => {

  authorizeReset();

}, []);

const resetPw = async (e) => {
  e.preventDefault();

  //if password does not match, throw an error to the console to try again
  if (password != password2) {
    console.log("The passwords you typed do NOT match. Try again.");
  } else if (password.length < 8) {
    console.log("password must be at least 8 characters long");
  } else if (password === password.toUpperCase() || password === password.toLowerCase()) {
    console.log("password must have a combination of upper and lower case letters");
  } else {
    //make a post request to update password
    const res = await fetch("http://localhost:4000/update-password", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
        password: password
      }),
    })
    const data = await res.json();
    if(data.success) {
      console.log("password was successfully updated");
      console.log("token has been resetted back to null for security purposes");
      //change UI interface to something that displays success with a state and components
      setChangePassword(false);
      //test redirect here for now
      setTimeout(function() {
        window.location.replace('/');
      }, 5000);
    } else {
      console.log("there was an error while trying to update password");
    }
  }
}

// const tokenReset = async () => {
//   const res = await fetch("http://localhost:4000/reset-token", {
//     method: "POST",
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       token: token
//     }),
//   })
//   const data = await res.json();
//   if(data.success) {
//     console.log("token has been resetted back to null for security purposes");
//     setAuthorized(true);
//     //test redirect here for now
//     // setTimeout(function() {
//     //   window.location.replace('/');
//     // }, 5000);
//   } else {
//     console.log("failed to reset token");
//   }
// }

// { authenticated ?
//   <div>
//     <h1>Welcome, {user?.firstName} </h1>
//     <p>Times logged in: {user?.logTimes} Last logged in: {user?.lastLogDate}</p>
//     <button onClick={logout}>Logout</button>
//     <button><a href={require("../assets/company_confidential_file.txt")} download="myFile">Download File</a></button>
//   </div>
//   : 
//   <div>
//     <h1>Please login</h1>
//     <a href="/"><p>Sign in</p></a>
//     <a href="/register"><p>Register</p></a>
//   </div>
// }
// </div>

    return (
      <div className="default">
        {authorized? 
          changePassword ?
            <div className="SignOrReg">
              <div className="form-title">
                  <h2>Reset Password</h2>
              </div>
              <form onSubmit={resetPw}>
                  <label>Password</label>
                  <input type="password" onChange={(e) => {setPassword(e.target.value)}}></input>
                  <label>Re-enter Password</label>
                  <input type="password" onChange={(e) => {setPassword2(e.target.value)}}></input>
                  <button type="submit">Submit</button>
              </form>
              <a href="/"><p>Remembered password? Sign in.</p></a>
            </div>
            :
            <div>
              <p>Success. Redirecting you to signin page. Please hold...</p>
            </div>
          :
          <div>
            <p>You are unauthorized to view this page</p>
          </div>
        }
      </div>
    );
}
  
export default ResetPassword;