import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

function ActivateAccount() {

  const [authorized, setAuthorized] = useState(false);
//   const [changePassword, setChangePassword] = useState(true);

  const history = useHistory();

  const {pathname} = useLocation();
  const parse = pathname.split('/');
  const user = parse[2]

  const activate = async () => {
    //call activate account from the backend
    const res = await fetch("http://localhost:4000/activate-account", {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        user: user
        }),
    })
    const data = await res.json();
    if(data.success) {
        console.log("Account has been activated");
        //change UI interface to something that displays success with a state and components
        setAuthorized(true);
        //test redirect here for now
        //   setTimeout(function() {
        //     window.location.replace('/');
        //   }, 5000);
    } else {
        console.log("there was an error activating your account");
    }
  } 

    useEffect(() => {
        activate();
    }, []);


    return (
      <div className="default">
        {authorized? 
            <div>
                <p>Account activation successful</p>
            </div>
            :
            <div>
                <p>You are unauthorized to view this page</p>
            </div>
        }
      </div>
    );
}
  
export default ActivateAccount;