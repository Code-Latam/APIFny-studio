
import './apisEditor.css'; // Import your CSS file here
// App.js
// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from "..//topbar/Topbar";
import APIDetails from '../apidetails/APIDetails';
import MyFolderTree from '../myfoldertree/MyFolderTree';
import { TerminalContextProvider } from "react-terminal";

const ApisEditor = ({clientNr, explorerId, authorization}) => {
  const [folders, setFolders] = useState([]);
  const [apis, setAPIs] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);

  async function handleSelectApi( apiName) {
  if (!apiName)
  {
    setSelectedApi(null)
  }

    try {
        const myApiPayload = {
          clientNr: clientNr,
          explorerId: explorerId,
          name: apiName
        }  
        const apiResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/query', myApiPayload)
        setSelectedApi(apiResponse.data)
      } 
      catch (error) 
      {
        console.error('Error fetching data:', error);
      }

  }

  useEffect(() => {
    fetchFoldersAndAPIs();
  }, []);

  const fetchFoldersAndAPIs = async () => {
    try {
      const myFolderPayload = {
        clientNr: clientNr,
        explorerId: explorerId
      }  
      const foldersResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/query', myFolderPayload)
      setFolders(foldersResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleFolderFormSubmit = async (data) => {
    try {
      if (selectedNode && selectedNode.type === 'folder') {
        // Update existing folder
        await axios.put(`/api/folders/${selectedNode.id}`, data);
      } else {
        // Create new folder
        await axios.post('/api/folders', data);
      }
      fetchFoldersAndAPIs();
    } catch (error) {
      console.error('Error saving folder:', error);
    }
  };

  const handleDeleteFolder = async () => {
    try {
      if (selectedNode && selectedNode.type === 'folder') {
        await axios.delete(`/api/folders/${selectedNode.id}`);
        fetchFoldersAndAPIs();
        setSelectedNode(null);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleUpdateApi = async () => {
    console.log("Update API");
  };


  const handleAPIFormSubmit = async (data) => {
    try {
      if (selectedNode && selectedNode.type === 'api') {
        // Update existing API
        await axios.put(`/api/apis/${selectedNode.id}`, data);
      } else {
        // Create new API
        await axios.post('/api/apis', data);
      }
      fetchFoldersAndAPIs();
    } catch (error) {
      console.error('Error saving API:', error);
    }
  };

  const handleDeleteAPI = async () => {
    try {
      if (selectedNode && selectedNode.type === 'api') {
        await axios.delete(`/api/apis/${selectedNode.id}`);
        fetchFoldersAndAPIs();
        setSelectedNode(null);
      }
    } catch (error) {
      console.error('Error deleting API:', error);
    }
  };



  return (
    <div className = "apiEditorTopLevel">
  <Topbar />      
  {folders.items && (
    <div className = "apiEditor">
      <div className = "myFolder">
        <MyFolderTree
          myItems={folders.items}
          onSelectApi={handleSelectApi}
          clientNr= {clientNr}
          explorerId={explorerId}
        />
      </div>
      {selectedApi && ( // This line ensures APIDetails is rendered only if selectedApi has a value
      <div className = "APIDetails">
        <TerminalContextProvider>
          <APIDetails 
            clientNr={clientNr}
            explorerId={explorerId}
            api={selectedApi}
          />
         </TerminalContextProvider> 
       </div>
      )}
    </div>
  )}
</div>
  );

};

export default ApisEditor;
