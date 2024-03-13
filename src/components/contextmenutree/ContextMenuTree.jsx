import React from 'react';
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
    Close
  } from "@material-ui/icons";

  const ContextMenuTree = ({onSelectTreeMenuItem, position }) => {
   
  
    const handleMenuItemClick = (item) => {
      console.log("clicked");
      onSelectTreeMenuItem(item);
    };
  
  
    return (
      <div className="context-menu-tree" style={{ postion: "absolute", top: position.y, left: position.x }}>
        { (
          <>    
              <>
                <div className="menu-item" onClick={() => handleMenuItemClick("configuration")}>
                  <Code className="menu-icon" />
                  <span className="menu-text">Configuration</span>
                </div>
              </>
              <>
              <div className="menu-separator"></div> 
              </> 
              <div className="menu-item" onClick={() => handleMenuItemClick("importapidefinitions")}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Api Definitions</span>
              </div>
              <div className="menu-separator"></div> 
              <div className="menu-item" onClick={() => handleMenuItemClick("exportproducts")}>
                <Folder className="menu-icon" />
                <span className="menu-text">Export Products</span>
              </div>
              <div className="menu-item" onClick={() => handleMenuItemClick("importproducts")}>
                <Folder className="menu-icon" />
                <span className="menu-text">Import Products</span>
              </div>

              <div className="menu-separator"></div>

            <div className="menu-item" onClick={() => handleMenuItemClick("thirdparty")}>
              <Description className="menu-icon" />
              <span className="menu-text">Third Party Api Providers</span>
            </div>
          </>
        )}
        
        <div className="menu-separator"></div>
        <div className="menu-item" onClick={() => handleMenuItemClick("Close")}>
          <Close className="menu-icon" />
          <span className="menu-text">Close</span>
        </div>
      </div>
    );
  };
  

export default ContextMenuTree;
