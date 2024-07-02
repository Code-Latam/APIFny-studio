import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./modalacceptpublicinvite.css";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from 'react-router-dom';
import { encodebody, getDecodedBody } from "../../utils/utils.js";

function Modalacceptpublicinvite({ clientNr, explorerId, onClose }) {
  console.log("FIRST IN");

  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [client, setClient] = useState('');
  const [publicUser, setPublicUser] = useState({});
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("WE ARE IN");
        const tokenresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/invitation/verifytoken', { token: token });
        console.log("we got a token response");
        return tokenresponse.data;
      } catch (error) {

        if (error.response) {
          // The request was made and the server responded with a status code that is not in the range of 2xx
          alert(`Failed to verify token: ${getDecodedBody(error.response.data)}`);
        } else if (error.request) {
          // The request was made but no response was received
          alert("Failed to verify token: No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          alert(`Failed to verify token: ${error.message}`);
        }

        alert("Your token is either invalid or expired or your login has already been created. Token expires after 5 days");
        throw error;
      }
    };

    const loginPublicUser = async (myuserData) => {
      try {
        const publicLoginPayload = {
          clientNr: myuserData.clientNr,
          explorerId: myuserData.explorerId,
          email: myuserData.email,
          chatbotKey: myuserData.chatbotKey,
        };
        
        console.log("USER PAYLOAD");
        console.log(publicLoginPayload);

        const publicUser = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/invitation/publiclogin', publicLoginPayload);
        setClient(myuserData.clientNr);
        setPublicUser(publicUser.data);
        console.log("USERDATA", publicUser.data);
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code that is not in the range of 2xx
          alert(`Failed to login public user: ${getDecodedBody(err.response.data)}`);
        } else if (err.request) {
          // The request was made but no response was received
          alert("Failed to create user: No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          alert(`Failed to create user: ${err.message}`);
        }
      }
    };

    const initialize = async () => {
      try {
        const myuserData = await verifyToken();
        await loginPublicUser(myuserData);
      } catch (error) {
        // Handle any error that occurred in either function
      }
    };

    initialize();
  }, [token]);



  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

      // set storage elements and redirect
      console.log("IN SUBMIT");
      console.log("process.env");
      console.log(process.env.REACT_APP_SECRET_KEY);
      console.log("client");
      console.log(client)

      const clientPayload = {
        clientNr: client,
        secretKey: process.env.REACT_APP_SECRET_KEY
      }

      console.log("Client Payload", clientPayload );

      const clientRes = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/clients/query",clientPayload );
     
      const myclient = clientRes.data;
      const gwocuSettingsString = JSON.stringify(myclient);
      localStorage.setItem('gwocu-setting', gwocuSettingsString);
      const userSettingsString = JSON.stringify(publicUser);
      localStorage.setItem('user', userSettingsString);

      if (email)
        {
          const emailPayload = {
            clientNr: client,
            email: email,
          };
  
          try{
          await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/invitation/registerpublicemail', encodebody(emailPayload));
          }
          catch(error)
          {
            console.log("error saving email")
          }
        }

      // do a complete load
      window.location.href = '/';
     

  };

  return (
    <div className="backgroundContainer">
      <div className="modalacceptinviteDialog">
        <div>
          <div className="top-accept-invite">
            <div className="left-accept-invite">
              Welcome to the {client} GWOCU Studio workspace. For an enhanced experience, please consider setting your email address. This step is optional but recommended.
            </div>
          </div>

          <div className="workflow-switch-container">
            <div>
              <label className="accept-invite-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                className="input-accept-invite"
                onChange={handleEmailChange}
              />
            </div>
          </div>

          <div className="modalDialog-buttons">
            <button className="modalsavebutton" onClick={handleSubmit}>
              Continue..
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modalacceptpublicinvite;
