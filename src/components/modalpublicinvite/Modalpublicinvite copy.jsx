import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./modalpublicinvite.css";
import { AuthContext } from "../../context/AuthContext";
import { encodebody, getDecodedBody } from "../../utils/utils.js";
import { Button, TextField, Tooltip, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

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
        console.log("FETCHED RESPONSE DATA", responseData)
        const status = responseData.publicInvite;
        if (status)
          {
            setIsPublicInvite(status)
          }
        else
        {
        setIsPublicInvite(false);
        } // Set to false if status is falsy
      } catch (error) {
        setIsPublicInvite(false);
        console.error('Failed to fetch public invite status:', error);
      }
    };

    fetchPublicInviteStatus();
  }, [clientNr, explorerId]);

  const handlePublicInviteChange = async (event) => {
    const value = event.target.checked;
    console.log("VALUE CHECKBOX", value);
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
        authorization: selectedAuth,
      };

      const response = await axios.post(`${process.env.REACT_APP_CENTRAL_BACK}/invitation/generate-token`, encodebody(payload));
      const token = getDecodedBody(response.data);
      const generatedUrl = `${process.env.REACT_APP_FROND_END}/auto-login/${token}`;
      setUrl(generatedUrl);
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
            <FormControl fullWidth disabled={!isPublicInvite}>
              <InputLabel id="userAuth-label">User Authorization</InputLabel>
              <Select
                labelId="userAuth-label"
                id="userAuth"
                value={selectedAuth}
                onChange={handleAuthChange}
                label="User Authorization"
              >
                <MenuItem value="designer">Designer</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="reader">Reader</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateUrl}
              disabled={!isPublicInvite}
            >
              Generate URL
            </Button>
          </div>
          {url && (
            <div className="url-container">
              <TextField
                label="Public Invite URL"
                value={url}
                InputProps={{ readOnly: true }}
                fullWidth
                variant="outlined"
              />
              <Tooltip title="Copy URL">
                <IconButton onClick={handleCopyUrl}>
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="modalDialog-buttons">
          <Button variant="contained" color="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Modalpublicinvite;
