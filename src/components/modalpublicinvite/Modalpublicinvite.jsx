import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./modalpublicinvite.css";
import { AuthContext } from "../../context/AuthContext";
import { encodebody, getDecodedBody } from "../../utils/utils.js";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { ownerDocument } from "@mui/material";

function Modalpublicinvite({ clientNr, explorerId, onClose }) {
  const { user } = useContext(AuthContext);
  const [isPublicInvite, setIsPublicInvite] = useState(false);
  const [url, setUrl] = useState('');
  const [selectedAuth, setSelectedAuth] = useState("reader");

  useEffect(() => {
    const fetchPublicInviteStatus = async () => {
      try {
        const payload = {
          clientNr: clientNr,
          explorerId: explorerId,
        };

        const response = await axios.post(`${process.env.REACT_APP_CENTRAL_BACK}/invitation/GetPublicInviteStatus`, encodebody(payload));
        const responseData = getDecodedBody(response.data);
        const status = responseData.publicInvite;
        setIsPublicInvite(!!status); // Set to false if status is falsy
      } catch (error) {
        setIsPublicInvite(false);
        console.error('Failed to fetch public invite status:', error);
      }
    };

    fetchPublicInviteStatus();
  }, [clientNr, explorerId]);

  const handlePublicInviteChange = async (event) => {
    const value = event.target.checked;
    setIsPublicInvite(value);
    
    try {
      const payload = {
        clientNr: clientNr,
        explorerId: explorerId,
        publicInvite: value
      };

      await axios.post(`${process.env.REACT_APP_CENTRAL_BACK}/invitation/SetPublicInviteStatus`, encodebody(payload));
      console.log('Public invite status updated successfully');
    } catch (error) {
      console.error('Failed to update public invite status:', error);
    }
  };

  const handleAuthChange = (event) => {
    setSelectedAuth(event.target.value);
  };

  const handleGenerateUrl = async () => {
    try {
      const payload = {
        clientNr: clientNr,
        explorerId: explorerId,
        chatbotKey: user.chatbotKey,
        email:"public@gwocu.com",
        authorization: selectedAuth,
      };

      const response = await axios.post(`${process.env.REACT_APP_CENTRAL_BACK}/invitation/generate-token`, encodebody(payload));
      const token = getDecodedBody(response.data);
      const generatedUrl = `${process.env.REACT_APP_FROND_END}/acceptpublicinvite?token=${token}`;
      setUrl(generatedUrl);
      // registe public user. upinsert it
      // create explorer
      const myExplorer = {
        name: explorerId,
        designer: selectedAuth === "designer",
        owner: selectedAuth === "owner",
        reader: selectedAuth === "reader"
      };
      const explorers = [];
      explorers.push(myExplorer);

      const userPayload =
      {
        clientNr: clientNr,
        explorerId: explorerId,
        email: "public@gwocu.com",
        username:  "public@gwocu.com",
        chatbotKey: user.chatbotKey,
        groups: ["chatbotDesigners"],
        explorers: explorers,
        isAdmin: false

      }
      console.log("USER PAYLOAD", userPayload );
     
      const myResult = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/invitation/registerpublicuser', encodebody(userPayload));
      
      console.log("Success", myResult.data);

    } catch (error) {
      console.error('Failed to generate URL:', error);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="modalinviteDialog">
      <div>
        <div className="top-invite">
          <div className="left-invite">Public Invite Settings</div>
          <div className="close-invite" onClick={onClose}>&times;</div>
        </div>

        <div className="workflow-switch-container">
          <div>
            <input
              type="checkbox"
              checked={isPublicInvite}
              onChange={handlePublicInviteChange}
            />
            <label className="invite-label">Enable Public Invite</label>
          </div>
          <div>
            <select
              value={selectedAuth}
              onChange={handleAuthChange}
              disabled={!isPublicInvite}
            >
              <option value="designer">Designer</option>
              <option value="owner">Owner</option>
              <option value="reader">Reader</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleGenerateUrl}
              disabled={!isPublicInvite}
            >
              Generate URL
            </button>
          </div>
          {url && (
            <div className="url-container">
              <input
                type="text"
                value={url}
                readOnly
              />
              <button style={{ "margin-left": '5px',"margin-bottom": '3px'  }} onClick={handleCopyUrl} title="Copy URL">
              <FileCopyIcon style={{ fontSize: '0.75rem', height: '0.75rem' }} />
              </button>
            </div>
          )}
        </div>

        <div className="modalDialog-buttons">
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modalpublicinvite;
