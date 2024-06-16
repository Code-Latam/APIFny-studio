
import './apisEditor.css'; // Import your CSS file here
// App.js
// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from "..//topbar/Topbar";
import APIDetails from '../apidetails/APIDetails';
import MyFolderTree from '../myfoldertree/MyFolderTree';
import { TerminalContextProvider } from "react-terminal";
import {encodebody, getDecodedBody} from "../../utils/utils.js";

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
        const apiResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/query', encodebody(myApiPayload))
        setSelectedApi(getDecodedBody(apiResponse.data))
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
      const foldersResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/query', encodebody(myFolderPayload))
      setFolders(getDecodedBody(foldersResponse.data))
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
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
