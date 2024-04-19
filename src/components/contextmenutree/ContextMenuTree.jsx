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
    CreateNewFolder,
    GroupAdd,
    KeyboardArrowRight,
    Email
  } from "@material-ui/icons";

 

  const ContextMenuTree = ({onSelectTreeMenuItem, position }) => {
   
    const [explorers, setExplorers] = useState([]);
    const [invites, setInvites] = useState([]);
    const { user } = useContext(AuthContext);
    const [submenu, setSubmenu] = useState({ visible: false, content: null, position: {} });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", {
            clientNr:user.clientNr, chatbotKey: user.chatbotKey, email:user.email
          });
          setExplorers(response.data.explorers); // Adjust according to your response structure

          const inviteResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/invitation/queryall", {
            chatbotKey: user.chatbotKey

          });
          const emails = inviteResponse.data.map(invite => invite.email);
                setInvites(emails);  // Set the state with the array of emails
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, []); // The empty array ensures this effect runs only once after the component mounts

    const openSubmenu = (item, event) => {
      const rect = event.target.getBoundingClientRect();
      setSubmenu({
          visible: true,
          content: item,
          position: { x: rect.right, y: rect.top }
      });
  };
  

    const handleMenuItemClick = (item, value, event) => {
    // Check if the item has a submenu
    const itemsWithSubmenu = ["invitations"];
    if (itemsWithSubmenu.includes(item)) {
        openSubmenu(item, event);
    } else {
        setSubmenu({ visible: false, content: null, position: {} }); // Close any open submenu
        onSelectTreeMenuItem(item, value);
    }
    };

    const handleSubmenuItemClick = (submenuItem, value) => {
        setSubmenu({ visible: false, content: null, position: {} }); // Close the submenu
        onSelectTreeMenuItem(submenuItem, value);
    };

    const closeSubmenu = () => setSubmenu({ visible: false, content: null, position: {} });


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
                <div className="menu-item" onClick={(e) => handleMenuItemClick("configuration", null, e)}>
                  <Code className="menu-icon" />
                  <span className="menu-text">Configuration</span>
                </div>
              </>
              <>
              <div className="menu-separator"></div> 
                <div className="menu-item" onClick={(e) => handleMenuItemClick("invitations", null, e)}>
                  <GroupAdd  className="menu-icon" />
                  <span className="menu-text"> Invitations  </span>
                  <KeyboardArrowRight  className="menu-icon"/>
                </div>

                {submenu.visible && (
                <div className="context-menu-sub-tree" style={{ position: "absolute", top: 60, left: 200 }}>
                    {/* Content based on `submenu.content` */}
                    <div className="menu-item" onClick={() => handleSubmenuItemClick(submenu.content, "Item 1")}>
                    <div className="menu-text-send">Send new invitation</div>
                    </div>
                    <div className="menu-separator"></div> 
                    <div className="menu-text-workspaces">Invitations Pending</div>
                    {invites.map((invite, index) => (
                    <React.Fragment key={index}>
                      <div className="menu-separator"></div>
                      <div className="menu-item">
                        <Email className="menu-icon" />
                        <div className="menu-text" >{invite}</div>
                        <Delete className="menu-icon" onClick={(e) => handleDeleteInvite("deleteInvite",invite, e)} style={{ cursor: 'pointer', marginLeft: '10px', fontSize: "14px", color: 'green'}} />
                      </div>
                    </React.Fragment>
                  ))}

                </div>
                )}


                <div className="menu-separator"></div> 
              </> 
              <div className="menu-item" onClick={(e) => handleMenuItemClick("importapidefinitions", null, e)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Api Definitions</span>
              </div>
              <div className="menu-separator"></div> 
              <div className="menu-item" onClick={(e) => handleMenuItemClick("exportproducts", null, e)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Export Products</span>
              </div>
              <div className="menu-item" onClick={(e) => handleMenuItemClick("importproducts",null,e)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Products</span>
              </div>

              <div className="menu-separator"></div>

            <div className="menu-item" onClick={(e) => handleMenuItemClick("thirdparty", null,e)}>
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
            <span className="menu-text" onClick={(e) => handleMenuItemClick("explorer", explorer, e)}>{explorer}</span>
            <Delete className="menu-icon" onClick={(e) => handleDeleteExplorer("deleteExplorer",explorer, e)} style={{ cursor: 'pointer', marginLeft: '10px', fontSize: "14px", color: 'green'}} />
          </div>
        </React.Fragment>
      ))}
        
        <div className="menu-separator"></div>
        <div className="menu-item" onClick={(e) => handleMenuItemClick("Close",null,e)}>
          <Close className="menu-icon" />
          <span className="menu-text">Close</span>
        </div>
        
      </div>
    );
  };
  

export default ContextMenuTree;
