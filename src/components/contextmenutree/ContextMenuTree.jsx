import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import './contextmenutree.css';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
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
    Email,
    Edit
  } from "@material-ui/icons";

  import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import {encodebody, getDecodedBody} from "../../utils/utils.js";
 

  const ContextMenuTree = ({onSelectTreeMenuItem, position }) => {
   
    const [explorers, setExplorers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);
    const [submenu, setSubmenu] = useState({ visible: false, content: null, position: {} });
    const [submenu2, setSubmenu2] = useState({ visible: false, content: null, position: {} });
    const [submenu3, setSubmenu3] = useState({ visible: false, content: null, position: {} });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", encodebody({
            clientNr:user.clientNr, chatbotKey: user.chatbotKey, email:user.email
          }));
          //set workspaces
          const listExplorers = response.data.explorers;
          const names = listExplorers.map(explorer => explorer.name);
          setExplorers(names); // Adjust according to your response structure
          // fetch invites to populate submenu
          const inviteResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/invitation/queryall", encodebody({
            chatbotKey: user.chatbotKey

          }));
          const emails = inviteResponse.data.map(invite => invite.email);
                setInvites(emails);  // Set the state with the array of emails

          const usersResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/queryall", encodebody({
            clientNr: user.clientNr,
            chatbotKey: user.chatbotKey

          }));
          // const myUsersEmails = usersResponse.data.map(myuser => myuser.email);
                setUsers(usersResponse.data);  // Set the state with the array of emails

          
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

  const openSubmenu2 = (item, event) => {
    const rect = event.target.getBoundingClientRect();
    setSubmenu2({
        visible: true,
        content: item,
        position: { x: rect.right, y: rect.top }
    });
};

const openSubmenu3 = (item, event) => {
  const rect = event.target.getBoundingClientRect();
  setSubmenu3({
      visible: true,
      content: item,
      position: { x: rect.right, y: rect.top }
  });
};
  

    const handleMenuItemClick = (item, value, event) => {
      // Check if the item has a submenu

      switch (item) {
        case 'invitations':
          // CLOSE ALL other sUBMENUS         
          setSubmenu2({ visible: false, content: null, position: {} }); // Close any open submenu
          setSubmenu3({ visible: false, content: null, position: {} }); 
          openSubmenu(item, event);
            break;
        case 'users':
          setSubmenu({ visible: false, content: null, position: {} }); // Close any open submenu
          setSubmenu3({ visible: false, content: null, position: {} }); 
          openSubmenu2(item, event);
            break;
        case 'api-pre-request-actions':
          setSubmenu({ visible: false, content: null, position: {} }); // Close any open submenu
          setSubmenu2({ visible: false, content: null, position: {} });
          openSubmenu3(item, event);
            break;
    
        default:
          setSubmenu({ visible: false, content: null, position: {} }); // Close any open submenu
          setSubmenu2({ visible: false, content: null, position: {} }); // Close any open submenu
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

    

    const handleDeleteInvite = (item, value) =>
     {
      if (window.confirm(`Are you sure you want to delete ${value}?. The person invited will no longer be able to join.`))
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

    const handleDeleteUser = (item, value) =>
     {
      if (window.confirm(`Are you sure you want to delete ${value}? The user will be remove from all work spaces.`))
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

    const handleEditUser = (item, value) =>
     {   
      console.log("Hello 1");
      onSelectTreeMenuItem(item, value);
      return
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

    const handleSendNewInvitation = (item, value) => {
      
        onSelectTreeMenuItem(item, value)
    };

    
    
    
  
  
    return (
      <div className="context-menu-tree" style={{ postion: "absolute", top: position.y, left: position.x }}>
        { (
          <>    
             
              <>

             
                <div className="menu-item" onClick={(e) => handleMenuItemClick("invitations", null, e)}>
                  <GroupAdd  className="menu-icon" />
                  <span className="menu-text"> Invitations  </span>
                  <KeyboardArrowRight  className="menu-icon"/>
                </div>

                {submenu.visible && (
                <div className="context-menu-sub-tree" style={{ position: "absolute", top: 40, left: 200 }}>
                    {/* Content based on `submenu.content` */}
                    <div className="menu-text-invitation">
                    <Tippy content={<CustomTooltip content={tooltips.invitation.content} isHtml={tooltips.invitation.isHtml} />} placement="right" theme = "terminal" maxWidth= "700px"  trigger ='click' interactive = "true" >
                    <HelpCenterIcon/>
                    </Tippy>
                    </div>
                    <div className="menu-separator"></div>
                    <div className="menu-item" onClick={() => handleSendNewInvitation("SendNewInvitation", null)}>
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
                <div className="menu-item" onClick={(e) => handleMenuItemClick("users", null, e)}>
                  <GroupAdd  className="menu-icon" />
                  <span className="menu-text"> Users  </span>
                  <KeyboardArrowRight  className="menu-icon"/>
                </div>

              {submenu2.visible && (
                <div className="context-menu-sub-tree" style={{ position: "absolute", top: 70, left: 200 }}>
                    {/* Content based on `submenu.content` */} 
                    <div className="menu-text-user">
                    <Tippy content={<CustomTooltip content={tooltips.usersroles.content} isHtml={tooltips.usersroles.isHtml} />} placement="right" theme = "terminal" maxWidth= "700px"  trigger ='click' interactive = "true" >
                    <HelpCenterIcon/>
                    </Tippy>
                    </div>
                    
                    {users.map((user, index) => (
                    <React.Fragment key={index}>
                      <div className="menu-separator"></div>
                      <div className="menu-item">
                        <Email className="menu-icon" />
                        <div className="menu-text" >{user.email}</div>
                        {user.username !== "Admin" && (
                          <>
                            <Tippy content={<CustomTooltip content={tooltips.editUser.content} isHtml={tooltips.editUser.isHtml} />} placement="right" theme = "terminal"  interactive = "true">
                            <Edit 
                              className="menu-icon" 
                              onClick={(e) => handleEditUser("editUser", user.email, e)} 
                              style={{ cursor: 'pointer', marginLeft: '10px', fontSize: "14px", color: 'green'}}
                            />
                            </Tippy>
                            <Tippy content={<CustomTooltip content={tooltips.deleteUser.content} isHtml={tooltips.deleteUser.isHtml} />} placement="right" theme = "terminal"  interactive = "true">
                            <Delete 
                              className="menu-icon" 
                              onClick={(e) => handleDeleteUser("deleteUser", user.email, e)} 
                              style={{ cursor: 'pointer', marginLeft: '10px', fontSize: "14px", color: 'green'}}
                            />
                            </Tippy>
                          </>
                        )}
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

              <div className="menu-item" onClick={(e) => handleMenuItemClick("api-pre-request-actions", null, e)}>
                  <Description  className="menu-icon" />
                  <span className="menu-text"> Pre Request Actions  </span>
                  <KeyboardArrowRight  className="menu-icon"/>
              </div>

              {submenu3.visible && (
                <div className="context-menu-sub-tree" style={{ position: "absolute", top: 180, left: 200 }}>
                    {/* Content based on `submenu.content` */}
                    <div className="menu-text-invitation">
                    <Tippy content={<CustomTooltip content={tooltips.apiPreRequestAction.content} isHtml={tooltips.apiPreRequestAction.isHtml} />} placement="right" theme = "terminal" maxWidth= "700px"  trigger ='click' interactive = "true" >
                    <HelpCenterIcon/>
                    </Tippy>
                    </div>
                    <div className="menu-separator"></div>
                    <div className="menu-item" onClick={(e) => handleMenuItemClick("workspace-action", null, e)}>
                    <Code className="menu-icon" />
                    <span className="menu-text">Workspace Actions</span>
                    </div>
                    <div className="menu-item" onClick={(e) => handleMenuItemClick("api-action", null,e)}>
                    <Code className="menu-icon" />
                    <span className="menu-text">Api Actions</span>
            </div>
                </div>
                )}


              <div className="menu-separator"></div> 
              <div className="menu-item" onClick={(e) => handleMenuItemClick("exportproducts", null, e)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Export Products</span>
              </div>
              <div className="menu-item" onClick={(e) => handleMenuItemClick("importproducts",null,e)}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Products</span>
              </div>

          </>
        )}
      
      <div className="menu-separator"></div>
      <Tippy content={<CustomTooltip content={tooltips.workspaces.content} isHtml={tooltips.workspaces.isHtml} />} placement="right" theme = "terminal"   trigger ='click' interactive = "true"> 
      <div className="menu-text-workspaces">Workspaces(?)</div>
      </Tippy>
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
            <Tippy content={<CustomTooltip content={tooltips.deleteWorkspace.content} isHtml={tooltips.deleteWorkspace.isHtml} />} placement="right" theme = "terminal"  interactive = "true"> 
            <Delete className="menu-icon" onClick={(e) => handleDeleteExplorer("deleteExplorer",explorer, e)} style={{ cursor: 'pointer', marginLeft: '10px', fontSize: "14px", color: 'green'}} />
            </Tippy>
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
