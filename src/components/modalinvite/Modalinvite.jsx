import React, { useState, useEffect } from "react";
import axios from "axios";
import "./modalinvite.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';

function Modalinvite({ clientNr, explorerId, onClose }) {

  const { user } = useContext(AuthContext);

 

 
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedAuth, setSelectedAuth] = useState("reader");
  
  

 

  const handleEmailChange = (event) => {
    setSelectedEmail(event.target.value);
  };
  
  const handleAuthChange = (event) => {
    setSelectedAuth(event.target.value);
  };

  
  const handleSave = async () => {
    {
      if (selectedEmail)
      {
        let explorers = [] ;
        const myExplorer = {name: user.explorerId, designer: (selectedAuth == "designer"), owner: (selectedAuth == "owner"), reader: (selectedAuth == "reader"),}
        explorers.push(myExplorer);
        handleSendEmail(user.chatbotKey, selectedEmail,explorers);

      }
      onClose(); 
    }  
  };

  async function handleSendEmail(chatbotKey, email, explorers) {
    console.log("HELOOO");
    try {
      const mypayload = {
        clientNr: clientNr,
        explorers: explorers,
        chatbotKey: chatbotKey,
        toEmail: email,
        url: process.env.REACT_APP_FROND_END + "/acceptinvite"
      };
  
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/invitation/invite", mypayload);
  
      // Check if the response indicates an error
      if (response.data && response.data.error) {
        // Display an alert with the error data
        alert(`Error: ${response.data.error}`);
        return false;
      }
      alert("Invite was successfully sent.")
      return true;
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      alert("Invite was not succesfull. Please try again.");
      return false;
    }
  };
  

  

  return (
    <div className="modalinviteDialog">
      <div>
        <div className="top-invite">

         <div className="left-invite">
          Send Invitation 
          <Tippy content={<CustomTooltip content={tooltips.invitation.content} isHtml={tooltips.invitation.isHtml} />} placement="right" theme = "terminal" trigger ='click' interactive = "true" >    
          <HelpCenterIcon/>
          </Tippy>
          </div>
         
         
          <div className="close-invite" onClick={onClose}>
            &times;
          </div>
        </div>

        <div className="workflow-switch-container">
          <div>
              <label className = 'invite-label' htmlFor="workflowName">Email</label>
              <input
                type="email"
                id="workflowName"
                value={selectedEmail}
                className="input-invite"
                onChange={handleEmailChange}
              />
            </div>
            <div>
            <label className = 'invite-label' htmlFor="userAuth">User Authorization</label>
            <select
              id="userAuth"
              value={selectedAuth}
              onChange={handleAuthChange}
              className="input-invite"
            >
              <option value="designer">Designer</option>
              <option value="owner">Owner</option>
              <option value="reader">Reader</option>
            </select>
          </div>


        </div>

        <div className="modalDialog-buttons">
          <button className="modalclosebutton" onClick={onClose}>
            Close
          </button>
          <button className="modalsavebutton" onClick={handleSave}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}


export default Modalinvite;
