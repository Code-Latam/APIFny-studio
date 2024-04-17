import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import './contextmenutree.css';
import {
    RssFeed,
    Chat,
    PlayCircleFilledOutlined,
    Group,
    Bookmark,
    HelpOutline,
    WorkOutline,
    Event,
    School,
    Videocam,
    Adb,
    MoreVertIcon, 
    Description,
    Code,
    Folder,
    Close,
    Delete,
    CreateNewFolder
  } from "@material-ui/icons";

 

  const ContextMenuTree = ({onSelectTreeMenuItem, position }) => {
   
    const [explorers, setExplorers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", {
            clientNr:user.clientNr, chatbotKey: user.chatbotKey, email:user.email
          });
          setExplorers(response.data.explorers); // Adjust according to your response structure
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, []); // The empty array ensures this effect runs only once after the component mounts
  

    const handleMenuItemClick = (item, value) => {
      console.log("clicked");
      console.log(item);
      console.log(value);
      onSelectTreeMenuItem(item, value);
    };

    const handleDeleteExplorer = (item, value) => {
      if (window.confirm(`Are you sure you want to delete ${value}? Deletion of a workspace is a very destructive operation that will delete all products and workflows including associated APIS and is irreversible`))
       {
        onSelectTreeMenuItem(item, value);
        return
       } 
       else {
        // User clicked 'Cancel', do nothing
        console.log("Deletion cancelled.");
        return
        }
    };

    
    const handleCreateWorkspace = (item, value) => {
      const workspaceName = prompt("Please enter the name of the new workspace:");
      if (workspaceName) { // Checks if the user entered something and did not just cancel the dialog
        console.log(`Creating workspace with name: ${workspaceName}`);
        onSelectTreeMenuItem(item, workspaceName);
      } else {
        console.log("Workspace creation cancelled.");
      }
    };
    
  
  
    return (
      <div className="context-menu-tree" style={{ postion: "absolute", top: position.y, left: position.x }}>
        { (
          <>    
              <>
                <div className="menu-item" onClick={() => handleMenuItemClick("configuration", null)}>
                  <Code className="menu-icon" />
                  <span className="menu-text">Configuration</span>
                </div>
              </>
              <>
              <div className="menu-separator"></div> 
              </> 
              <div className="menu-item" onClick={() => handleMenuItemClick("importapidefinitions", null)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Api Definitions</span>
              </div>
              <div className="menu-separator"></div> 
              <div className="menu-item" onClick={() => handleMenuItemClick("exportproducts", null)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Export Products</span>
              </div>
              <div className="menu-item" onClick={() => handleMenuItemClick("importproducts",null)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Products</span>
              </div>

              <div className="menu-separator"></div>

            <div className="menu-item" onClick={() => handleMenuItemClick("thirdparty", null)}>
              <Description className="menu-icon" />
              <span className="menu-text">Third Party Api Providers</span>
            </div>
          </>
        )}
      
      <div className="menu-separator"></div>
      <div className="menu-text-workspaces">Workspaces</div>
      <div className="menu-separator"></div>
        <div className="menu-item" onClick={() => handleCreateWorkspace("createWorkspace",null)}>
          <CreateNewFolder className="menu-icon" />
          <span className="menu-text">Create New Workspace</span>
        </div>
        {/* Dynamically added menu items */}
       {/* Dynamically added menu items from API */}
       {explorers.map((explorer, index) => (
        <React.Fragment key={index}>
          <div className="menu-separator"></div>
          <div className="menu-item">
            <Bookmark className="menu-icon" />
            <span className="menu-text" onClick={() => handleMenuItemClick("explorer", explorer)}>{explorer}</span>
            <Delete className="menu-icon" onClick={() => handleDeleteExplorer("deleteExplorer",explorer)} style={{ cursor: 'pointer', marginLeft: '10px', fontSize: "14px", color: 'green'}} />
          </div>
        </React.Fragment>
      ))}
        
        <div className="menu-separator"></div>
        <div className="menu-item" onClick={() => handleMenuItemClick("Close",null)}>
          <Close className="menu-icon" />
          <span className="menu-text">Close</span>
        </div>
        
      </div>
    );
  };
  

export default ContextMenuTree;
