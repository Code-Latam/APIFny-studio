import React, { useState, useEffect } from "react";
import axios from "axios";
import "./modalacceptinvite.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from 'react-router-dom';
import PasswordValidator from 'password-validator';
import {encodebody, getDecodedBody} from "../../utils/utils.js";

function Modalacceptinvite({ clientNr, explorerId, onClose }) {

  const schema = new PasswordValidator();
  schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().symbols()                                // Must have symbols
    .has().not().spaces();    


  const { user } = useContext(AuthContext);

  const [password, setPassword] = useState('');
  const [client, setClient] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userdata, setUserdata] = useState({});
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');


  function handleOnClose() {
    // Attempt to close the current window
    window.close();
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const result = schema.validate(password, { list: true });
    if (result.length === 0) {
      console.log('Password is strong');
    } else {
      alert('Your password is not strong enough, please make sure it is at least 8 characters long, has no spaces, contains uppercase and lower case letters, has symbols and has at least two digits.'); // Lists aspects of the password that failed
      return
    }

    // verify token and return JSON
    try {
    const tokenresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/invitation/verifytoken', {token:token});
    var myuserData = tokenresponse.data
    setClient(myuserData.clientNr);
  
    }
    catch(error) {
      alert("Your token is either invalid or expired or your login has already been created. Token expires after 5 days")
      return
    }
    // set gwocu-setting so APIS can start using gwocu
    const clientPayload = {
      clientNr: myuserData.clientNr,
      secretKey: process.env.REACT_APP_SECRET_KEY
    }

    console.log("Client Payload", clientPayload );

    const clientRes = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/clients/query",clientPayload );
   
    const myclient = clientRes.data;
    const gwocuSettingsString = JSON.stringify(myclient);
    localStorage.setItem('gwocu-setting', gwocuSettingsString);

    // Send data to your API endpoint to create the user
    try {
      const userPayload =
      {
        clientNr: myuserData.clientNr,
        email: myuserData.toEmail,
        username: myuserData.toEmail,
        password: password,
        chatbotKey: myuserData.chatbotKey,
        groups: ["chatbotDesigners"],
        explorers: myuserData.explorers,
        isAdmin: false

      }
      console.log("USER PAYLOAD");
      console.log(userPayload);
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/auth/register', encodebody(userPayload));
      // Redirect to login page after successful registration
      alert("User was created successfully! Please login.")
      // delete invite
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/invitation/delete", encodebody({ chatbotKey: myuserData.chatbotKey, email:  myuserData.toEmail}));
      
      history.push(`/login?clientNr=${encodeURIComponent(myuserData.clientNr)}&chatbotKey=${encodeURIComponent(myuserData.chatbotKey)}&email=${encodeURIComponent(myuserData.email)}`);
      // history.push('/login');
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code that is not in the range of 2xx
        alert(`Failed to create user: ${getDecodedBody(err.response.data)}`);
        return
      } else if (err.request) {
        // The request was made but no response was received
        
        alert("Failed to create user: No response from server");
        return
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Failed to create user: ${err.message}`);
       
      }
    }
  };


 
 
  

  return (
    <div className="backgroundContainer">
    <div className="modalacceptinviteDialog">
      <div>
        <div className="top-accept-invite">
          <div className="left-accept-invite">Welcome to the {client} gwocu studio workspace. Please set your password.</div>
          <div className="close-accept-invite" onClick={handleOnClose}>
            &times;
          </div>
        </div>

        <div className="workflow-switch-container">
          <div>

              <label className = "accept-invite-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                className="input-accept-invite"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label className = "accept-invite-label" htmlFor="confirmpassword">Confirm password</label>
              <input
                type="password"
                id="confirmpassword"
                value={confirmPassword}
                className="input-accept-invite"
                onChange={handleConfirmPasswordChange}
              />
            </div>


        </div>

        <div className="modalDialog-buttons">
          <button className="modalclosebutton" onClick={handleOnClose}>
            Close
          </button>
          <button className="modalsavebutton" onClick={handleSubmit}>
          Submit
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}


export default Modalacceptinvite;
