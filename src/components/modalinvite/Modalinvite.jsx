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
import {encodebody, getDecodedBody} from "../../utils/utils.js";

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
  
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/invitation/invite", encodebody(mypayload));
      alert("Invite was successfully sent.")
      return true;
    } catch (error) {

      if (error.response) {
        // The request was made and the server responded with a status code that is not in the range of 2xx
      
        alert(`Failed to send invite to the user: ${getDecodedBody(error.response.data)}`);
        return false
      } else if (error.request) {
        // The request was made but no response was received
        alert("Failed to send invite to the user: No response from server");
        return false
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Failed to send invite to the user: ${getDecodedBody(error.message)}`);
        return false
      }
      
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
