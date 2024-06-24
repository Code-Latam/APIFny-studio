import React, { useState, useEffect } from 'react';
import "./producttree.css" ;
import axios from "axios";
import ApiTerminal from "../../components/apiTerminal/ApiTerminal";
import ApiCode from "../../components/apicode/ApiCode";
import WorkflowCode from "../../components/workflowcode/WorkflowCode";
import Graphview from "../../components/graphview/Graphview";
import Productview from "../productview/Productview";
import Productcomplianceview from "../productcomplianceview/Productcomplianceview";
import Workflowview from '../workflowview/Workflowview';
import Workflowcomplianceview from '../workflowcomplianceview/Workflowcomplianceview';
import Workflowterminal from '../workflowterminal/Workflowterminal';
import Taskview from '../taskview/Taskview';
import Taskcomplianceview from '../taskcomplianceview/Taskcomplianceview';
import Linkview from '../linkview/Linkview';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';

import ContextMenu from "../contextmenu/ContextMenu"; 
import ContextMenuTree from "../contextmenutree/ContextMenuTree"; 

import Modalworkflow from "../modalworkflow/Modalworkflow"; 

import Modalinvite from '../modalinvite/Modalinvite';

import JiraServiceDeskModal from '../jiraservicedeskmodal/JiraServiceDeskModal';

import Modalproduct from "../modalproduct/Modalproduct";
import Modalconfiguration from "../modalconfiguration/Modalconfiguration";
import Thirdparties from "../thirdparties/Thirdparties";
import Modalapidefimport from "../modalapidefimport/Modalapidefimport";  
import ExportProducts from "../exportproducts/ExportProducts";  
import ImportProducts from "../importproducts/ImportProducts";  

import Chatbot from "../chatbot/Chatbot"; 
import { FiMoreVertical } from 'react-icons/fi'
import {convertToOpenAPI} from "../../utils/utils.js";
import jsYaml from 'js-yaml';
import { saveAs } from 'file-saver';
import { TerminalContextProvider } from "react-terminal";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import HelpCenterIcon from '@mui/icons-material/HelpCenter';

import {encodebody, getDecodedBody} from "../../utils/utils.js";

const TreeNode = ({ label, children, isChild, topLevelClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = (product) => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`tree-node ${isChild ? 'child-node' : ''}`}>
      <span onClick={topLevelClick || toggleCollapse}>
        {collapsed ? '▶' : '▼'} {label}
      </span>
      <div style={{ display: collapsed ? 'none' : 'block' }}>
        {children}
      </div>
    </div>
  );
};

const ProductTree = ({authorization, clientNr, explorerId}) => {
  console.log("AUTHORIZATION");
  console.log(authorization);
  const { user } = useContext(AuthContext);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWork, setSelectedWorkflow] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [selectedApi, setSelectedApi] = useState(null);
  const [selectedCodeType, setCodeType] = useState(null);
  const [products, setProducts] = useState([]);

  const [selectedMenu,setMenu ] = useState(null);
  const [selectedTreeMenu,setTreeMenu ] = useState(null);

  const [contextMenuVisible, setContextMenuVisible] = useState(false); 
  const [treeContextMenuVisible, setTreeContextMenuVisible] = useState(false); 

  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [treeContextMenuPosition, setTreeContextMenuPosition] = useState({ x: 0, y: 0 });

  const [newTreeItem, setNewTreeItem] = useState(0);
  const [newGraphItem, setNewGraphItem] = useState(0);

  const [showModalInvite, setShowModalInvite] = useState(false);

  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isApiDefImportModalOpen, setIsApiDefImportModalOpen] = useState(false);

  const [isExportProductsModalOpen, setIsExportProductsModalOpen] = useState(false);
  const [isImportProductsModalOpen, setIsImportProductsModalOpen] = useState(false);
  const [isServicedDeskModalOpen, setIsServicedDeskModalOpen] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfigurationModalOpen, setIsConfigurationModalOpen] = useState(false);
  const [isThirdpartiesOpen, setIsThirdpartiesOpen] = useState(false);
  const history = useHistory();

  const openWorkflowModal = () => {
    setIsWorkflowModalOpen(true);
  };

  const openApiDefImportModal = () => {
    setIsApiDefImportModalOpen(true);
  };

  openApiDefImportModal

  const openProductModal = () => {
    setIsProductModalOpen(true);
  };

  const openConfigurationModal = () => {
    setIsConfigurationModalOpen(true);
  };

  const openThirdparties = () => {
    setIsThirdpartiesOpen(true);
  };


  const closeModal = () => {
    setIsWorkflowModalOpen(false);
    setIsProductModalOpen(false);
  };

  async function exportApiOpenApi(ExportApiName)
  {
    try {
      const myApibody = 
      {
        clientNr: clientNr,
        explorerId:explorerId,
        name: ExportApiName
      }
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/api/query", encodebody(myApibody));
      const myApi = await getDecodedBody(response.data);
      const myApiList = [];
      myApiList.push(myApi);

      // create the openApi Object
      const openAPIObject = convertToOpenAPI(myApiList,myApi.name, myApi.description);
      const yamlContent = jsYaml.dump(openAPIObject, { skipInvalid: true });
      // Create a Blob from the YAML content
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      // Use the saveAs function from the file-saver library to trigger the download
      saveAs(blob, 'api.yaml');
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  }


  async function exportWorkflowOpenApi(workflowName)
  {
    try {
      const myWorkflowbody = 
      {
        clientNr: clientNr,
        explorerId: explorerId,
        workflowName: workflowName
      }
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/queryorderedapi", encodebody(myWorkflowbody));
      const myApiList = await getDecodedBody(response.data);

      if (myApiList === undefined || myApiList.length === 0)
      {
        return
      }
      // remove empty object from array.
      const nonEmptyApiList = myApiList.filter(item => Object.keys(item).length > 0);

      const openAPIObject = convertToOpenAPI(nonEmptyApiList, workflowName,"collection of APIS belongin to workflow" );
      const yamlContent = jsYaml.dump(openAPIObject, { skipInvalid: true });
      // Create a Blob from the YAML content
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      // Use the saveAs function from the file-saver library to trigger the download
      saveAs(blob, 'api.yaml');
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  }

  async function exportProductOpenApi(productName)
  {
    try {
      const myWorkflowListRequestBody =
      {
        clientNr: clientNr,
        explorerId: explorerId,
        productName: productName
      }

      const workflowListResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workflow/queryallgivenproduct", encodebody(myWorkflowListRequestBody));
      const myWorkflowList = await getDecodedBody(workflowListResponse.data);
      if (myWorkflowList === undefined || myWorkflowList.length === 0)
      {
        return
      }

      var myProductApiList = [];

      for (const myWorkflow of myWorkflowList) 
      {

            const myWorkflowRequestbody = 
            {
              clientNr: clientNr,
              explorerId: explorerId,
              workflowName: myWorkflow.name
            }
            console.log('before query');
            console.log(myWorkflowRequestbody);

            try {
              const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/queryorderedapi", encodebody(myWorkflowRequestbody));
              var myApiList = await getDecodedBody(response.data);
        
              if (myApiList === undefined || myApiList.length === 0) {
                myApiList = [];
              }
              // add myApiList to myProductApiList
              myProductApiList = myProductApiList.concat(myApiList);
            } catch (error) {
              // Handle the error for this specific API call, e.g., set myApiList to an empty array
              myApiList = [];
            }

          }
            // remove empty object from array.



      const nonEmptyApiList = myProductApiList.filter(item => Object.keys(item).length > 0)

      const openAPIObject = convertToOpenAPI(nonEmptyApiList, productName,"collection of APIS belongin to product" );
      const yamlContent = jsYaml.dump(openAPIObject, { skipInvalid: true });
      // Create a Blob from the YAML content
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      // Use the saveAs function from the file-saver library to trigger the download
      saveAs(blob, 'api.yaml');
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  }


  const handleSelectTreeMenuItem = async  (menuItem, value) => {
    console.log("TOPLEVEL MENUTREE", menuItem)

    // isThirdpartiesOpen
    switch (menuItem) {
      case 'createWorkspace':
        try {
          await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workspace/register", encodebody({clientNr: user.clientNr, explorerId: value,  chatbotKey: user.chatbotKey, email: user.email}));
        }
        catch (err) {
          
          if (err.response) {
            // The request was made and the server responded with a status code that is not in the range of 2xx
          
            alert(`Failed to Create the workspace: ${getDecodedBody(err.response.data)}`);
            break;
          } else if (err.request) {
            // The request was made but no response was received
            alert("Failed to create the workspace: No response from server");
            break
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error:", err.message);
            alert(`Failed to create the workspace: ${getDecodedBody(err.message)}`);
            break;
          }
          break;
        }
        alert("Workspace was successfully created")
        break;


        case 'SendNewInvitation':
        setShowModalInvite(true);
        break;

        case 'editUser':
        // fetch user
        const responseTargetUser = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", encodebody({ clientNr:user.clientNr, chatbotKey: user.chatbotKey, email: value}));
        const targetuser = getDecodedBody(responseTargetUser.data);

        history.push({
          pathname: '/edituser',
          state: { targetuser: targetuser, explorerId : user.explorerId}
      });
        break;

        case 'deleteInvite':
          try {
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/invitation/delete", encodebody({ chatbotKey: user.chatbotKey, email: value}));
          }
          catch (err) {
            if (err.response) {
              // The request was made and the server responded with a status code that is not in the range of 2xx
              alert(`Failed to delete the invite: ${getDecodedBody(err.response.data)}`);
              break;
            } else if (err.request) {
              // The request was made but no response was received
              alert("Failed to delete the invite: No response from server");
              break
            } else {
              // Something happened in setting up the request that triggered an Error
              alert(`Failed to delete the invite: ${getDecodedBody(err.message)}`);
              break;
            }
          
          }
          
            alert(`Invite was successfully deleted`);
            break  


          case 'deleteUser':
          try {
            // proceed to remove the current explorer from the user's explorers.
            const myUser = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", encodebody({ clientNr: user.clientNr, chatbotKey: user.chatbotKey, email: value}));
            const myUserData = getDecodedBody(myUser.data)
            myUserData.explorers = myUserData.explorers.filter(explorer => explorer.name !== user.explorerId);
            // Update the user to the backend
            myUserData.clientNr = user.clientNr ;
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/update", encodebody(myUserData));
          }
          catch (err) {
            if (err.response) {
              // The request was made and the server responded with a status code that is not in the range of 2xx
            
              alert(`Failed to remove the user: ${getDecodedBody(err.response.data)}`);
              break;
            } else if (err.request) {
              // The request was made but no response was received
              console.error("API Error: No response received");
              alert("Failed to remove the user: No response from server");
              break
            } else {
              // Something happened in setting up the request that triggered an Error
              alert(`Failed to remove the user: ${getDecodedBody(err.message)}`);
              break;
            }
          
          }
          
            alert(`User was successfully removed from workspace`);
            break  



      case 'deleteExplorer':
      try {
        await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workspace/delete", encodebody({clientNr: user.clientNr, explorerId: value,  chatbotKey: user.chatbotKey, email: user.email}));
      }
      catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code that is not in the range of 2xx
          alert(`Failed to delete the workspace: ${getDecodedBody(err.response.data)}`);
          break;
        } else if (err.request) {
          // The request was made but no response was received
          alert("Failed to delete the workspace: No response from server");
          break
        } else {
          // Something happened in setting up the request that triggered an Erro
          alert(`Failed to delete the workspace: ${getDecodedBody(err.message)}`);
          break;
        }
      
      }
      
        alert(`workspace was successfully deleted`);
        window.location.reload();
        break
      case 'explorer':
        // Check if workspace exists (it could have been deleted by another user)
        let myExplorerId = value;
        const myUser = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", encodebody({clientNr: user.clientNr, chatbotKey: user.chatbotKey, email: user.email}));
        
        let myExplorers = getDecodedBody(myUser.data).explorers;
        const myworkspacePayload = { clientNr: clientNr, explorerId: myExplorerId,}
        try {
          await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workspace/exist", encodebody(myworkspacePayload));
        }
        catch(err) {
          alert("The selected workspace was deleted or your access has been revoked by a workspace admin");
          // remove workspace from user.explorers
          
          let filteredExplorers = myExplorers.filter(explorer => explorer !== myExplorerId);
          myExplorers = filteredExplorers;
          if (myExplorers.length === 0) // the user does not have access to any other workspaces
            {
              localStorage.removeItem("user");
              localStorage.removeItem("gwocu-setting");
              alert("this was your last workspace you do not have access to other workspaces. Please contact your workspace admin. Logged out!");
              window.location.reload();
              break;
            }
         
          
        }

        const myNewUserSetting = {
          ...user,
          explorers: myExplorers,
          explorerId:myExplorerId
        }
        const userSettingsString = JSON.stringify(myNewUserSetting);    
        localStorage.setItem('user', userSettingsString);

        // reload the page
        window.location.reload();
        break;
      case 'exportproducts':
        setTreeMenu('exportproducts');
        setIsExportProductsModalOpen(true);
        break;
      case 'importproducts':
        console.log("IMPORT PRODUCT");
          setTreeMenu('importproducts');
          setIsImportProductsModalOpen(true);
          break; 
      case 'helpdesk':
        console.log("SDESK");
        const jiraServiceDeskUrl = 'https://customers.support.gwocu.com';
        window.open(jiraServiceDeskUrl, '_blank', 'noopener,noreferrer');
        // setTreeMenu('servicedesk');
        // setIsServicedDeskModalOpen(true);
        break; 
      case 'workspace-action':
        setTreeMenu('workspace-action');
        setIsConfigurationModalOpen(true);
        break;
      case 'api-action':
        setTreeMenu('api-action');
        setIsThirdpartiesOpen(true);
        break;
      case 'importapidefinitions':
          setTreeMenu('importapidefinitions');
          setIsApiDefImportModalOpen(true)
          break;
      default:
        if (menuItem !== 'close') {
          setTreeMenu(menuItem);
        }
        break;
    }
    hideTreeContextMenu();
  };


  const handleSelectMenuItem = (menuItem) => {
    switch (menuItem) {
      case 'javascript':
      case 'python':
        setMenu('code');
        if (selectedItemType === 'api'|| selectedItemType === 'taskapi' || selectedItemType === 'apicompliance') {
          setSelectedItemType("apicode");
        } else if (selectedItemType === 'workflow' || selectedItemType === 'workflowcompliance'|| selectedItemType === 'workflowterminal') {
          setSelectedItemType("workflowcode");
        }
        setCodeType(menuItem);
        break;
      case 'cURL':
          setMenu('cURL');
          if (selectedItemType === 'api' || selectedItemType === 'apicode' || selectedItemType === 'taskapi' || selectedItemType === 'apicompliance' ) {
            setSelectedItemType("api");
            break;
          } 
      case 'description':
          setMenu('description');
          if (selectedItemType === 'api' || selectedItemType === 'apicode' || selectedItemType === 'taskapi' || selectedItemType === 'apicompliance'  ) {
            setSelectedItemType("taskapi");
            break;  
          } 
          if (selectedItemType === 'task' || selectedItemType === 'taskcompliance') {
            setSelectedItemType("task");
            break;  
          } 
          if (selectedItemType === 'workflow' || selectedItemType === 'workflowcode'  || selectedItemType === 'workflowcompliance' || selectedItemType === 'workflowterminal') {
            setSelectedItemType("workflow");
            break;
          }
          if (selectedItemType === 'product' || selectedItemType === 'productcompliance' ) {
            setSelectedItemType("product");
            break;
          }
          break;
          case 'compliancedescription':
            setMenu('compliancedescription');
            if (selectedItemType === 'api' || selectedItemType === 'apicode' || selectedItemType === 'taskapi' ) {
              setSelectedItemType("apicompliance");
              break;  
            } 
            if (selectedItemType === 'task' ) {
              setSelectedItemType("taskcompliance");
              break;  
            } 
            if (selectedItemType === 'workflow' || selectedItemType === 'workflowcode' || selectedItemType === 'workflowterminal') {
              setSelectedItemType("workflowcompliance");
              break;
            }
            if (selectedItemType === 'product' || selectedItemType === 'productcompliance' ) {
              setSelectedItemType("productcompliance");
              break;
            }
            break;
            case 'workflowterminal':
              setMenu('workflowterminal');
              if (selectedItemType === 'workflow' || selectedItemType === 'workflowcode' || selectedItemType === 'workflowterminal' || selectedItemType === 'workflowcompliance') {
                setSelectedItemType("workflowterminal");
                break;
              }
              break;  
      case 'export-openapi':
        setMenu('export-openapi');
        if (selectedItemType === 'api'|| selectedItemType === 'apicode' || selectedItemType === 'taskapi' || selectedItemType === 'apicompliance') {
          exportApiOpenApi(selectedApi);
          break; } 
          if (selectedItemType === 'workflow' || selectedItemType === 'workflowcode'  || selectedItemType === 'workflowcompliance' || selectedItemType === 'workflowterminal' ) {
          exportWorkflowOpenApi(selectedWork);
          break;}
          if (selectedItemType === 'product' || selectedItemType === 'productcompliance' ) {
            exportProductOpenApi(selectedProduct);
            break;}
        break;
      default:
        if (menuItem !== 'close') {
          setMenu(menuItem);
        }
        break;
    }
    hideContextMenu();
  };
  


  const handleSelectedItemChange = (newselectItem,newProductName,newWorkflowName,newApiName, newTaskId) => {
    
    setSelectedItemType(newselectItem);
    setSelectedProduct(newProductName);
    
    setSelectedTaskId(newTaskId);
    setSelectedApi(newApiName);
    setSelectedWorkflow(newWorkflowName);
    setSelectedLink(null);
  };

  const handleSelectedLinkChange = (newselectItem,newProductName,newWorkflowName,newLink, linkId) => {
    
    setSelectedItemType(newselectItem);
    setSelectedProduct(newProductName);
    setSelectedWorkflow(newWorkflowName);
    setSelectedLink(newLink)
    setSelectedLinkId(linkId)
    setSelectedTaskId(null)
  };

  const handleSelectedWorkflowChange = (newselectItem,newProductName,newWorkflowName,newWorkflow) => {
    
    setSelectedItemType(newselectItem);
    setSelectedProduct(newProductName);
    setSelectedWorkflow(newWorkflowName);
    setSelectedLink(null)
    setSelectedTaskId(null)
  };


  


  const handleProductClick = (product) => {
    console.log("product clicked");
    console.log(product);
    setSelectedItemType('product'); // Set the selected item type to 'product'
    setSelectedProduct(product); // Set the selected product
    setSelectedWorkflow(null);
  };

  const handleWorkflowClick = (workflow,product) => {
    console.log("workflow clicked");
    console.log(workflow);
    setSelectedItemType('workflow');
    setSelectedWorkflow(workflow);
    setSelectedProduct(product);
  };

  useEffect(() => {
    // Fetch the initial products using an API call
    // Replace this with your actual API endpoint
    fetchProducts();
  }, [newTreeItem, authorization]);

  const fetchProducts = async () => {
    const myAll = authorization.designer || authorization.owner
    console.log("MYALL");
    console.log(myAll);
    try {
      const mybody = {
        clientNr: clientNr,
        explorerId: explorerId,
        status: myAll ? "All" : "Public"
      };

     
  
      // Make the API call using axios and parse the response as JSON
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/product/gettree", encodebody(mybody));
      const json = getDecodedBody(response.data);
      console.log("JSON");
      console.log(json);

      // Set the data state variable with the JSON data
      setProducts(json);
      // on first fetch set the productname
      if (json.length > 0)
      {
      setSelectedProduct(json[0].name)
      }
      setSelectedItemType('product');
     
    } catch (error) {
      // Handle any errors
      console.log(error);
    }

   //  const mockProducts = [
   //   { name: 'Product 1', workflows: ['Workflow 1', 'Workflow 2'] },
   //  { name: 'Product 2', workflows: ['Workflow 3'] },
   // ];

    // setProducts(mockProducts);
  };

  const renderTree = (nodes, isChild) => {
    return nodes.map((node, index) => (
      <TreeNode
        key={index}
        label={node.name}
        isChild={isChild}
        onProductClick={handleProductClick}
        topLevelClick={isChild ? undefined : () => handleProductClick(node.name)}
      >
        {node.workflows.map((workflow, wIndex) => (
          <div
            key={wIndex}
            className="workflow"
            onClick={() => handleWorkflowClick(workflow,node.name)} // Handle workflow click
          >
            {workflow}
          </div>
        ))}
      </TreeNode>
    ));
  };

  const handleTreeContextMenuClick = (e) => {
    e.preventDefault();
    const windowWidth = window.innerWidth;
    console.log("clientX:", e.clientX);
    console.log("clientY:", e.clientY);
    console.log("window.innerWidth:", window.innerWidth);

    // Define percentage values for positioning
    const xPercentage = 0.1; // Adjust this value based on your needs
    const yPercentage = 0.05; // Adjust this value based on your needs

    // Calculate the position of the context menu based on the window size and click event
    const contextMenuX = e.clientX - 60 - (windowWidth * xPercentage);
    const contextMenuY = e.clientY + 90 - (windowWidth * yPercentage);

   


    setTreeContextMenuPosition({ x: contextMenuX, y: contextMenuY });
    setTreeContextMenuVisible(true);
  };

  const handleContextMenuClick = (e) => {
    e.preventDefault();
    const windowWidth = window.innerWidth;
    console.log("clientX:", e.clientX);
    console.log("clientY:", e.clientY);
    console.log("window.innerWidth:", window.innerWidth);

    // Define percentage values for positioning
    const xPercentage = 0.1; // Adjust this value based on your needs
    const yPercentage = 0.05; // Adjust this value based on your needs

    // Calculate the position of the context menu based on the window size and click event
    const contextMenuX = e.clientX - 60 - (windowWidth * xPercentage);
    const contextMenuY = e.clientY + 90 - (windowWidth * yPercentage);

    setContextMenuPosition({ x: contextMenuX, y: contextMenuY });
    setContextMenuVisible(true);
  };

  const hideContextMenu = () => {
    setContextMenuVisible(false);
  };

  const hideTreeContextMenu = () => {
    setTreeContextMenuVisible(false);
  };

  const handleApiEditorClick = () => {
    
    history.push('/apiseditor');
  };

  return (
    <div className="main-container">
        <div className="left-container">
          {(authorization.designer || authorization.owner) && (
          
          <div>
          <div className = "left-top-buttons">
         <button className="open-modal-button" onClick={openProductModal}>
          Add Product
          </button>
          <button className="open-modal-button" onClick={openWorkflowModal}>
          Add Workflow
          </button>
          <a href="https://wiki.gwocu.com/en/GWOCU-Studio/product-tree-panel#treebuttons-section" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>
          </div>
          

          <button  onClick={handleApiEditorClick}>All API's</button>
          <br></br>
          <br></br>
          </div>
          )}

          <Tippy content={<CustomTooltip content={tooltips.mainMenu.content} isHtml={tooltips.mainMenu.isHtml} />} placement="right" theme = "terminal">       
          <div className="tree-icon-right-align">
          <FiMoreVertical className="tree-context-menu-icon" onClick={handleTreeContextMenuClick} />
          </div>
          </Tippy>

          {renderTree(products, false)}
        </div>
        <div className = "middle-panel">
        <div className="graph-view">
        {(selectedProduct || selectedWork) && (
          <Graphview
            clientNr = {clientNr}
            explorerId = {explorerId}
            selectedProduct={selectedProduct}
            selectedWork={selectedWork}
            onTaskChange = {handleSelectedItemChange}
            onWorkflowChange = {handleSelectedWorkflowChange}
            onLinkChange = {handleSelectedLinkChange}
            graphChange = {newGraphItem}
            authorization ={authorization}
          />
        )}
        </div>
        
        <div className = "botpanel">
            <Chatbot
            clientNr = {clientNr}
            explorerId = {explorerId}
            />
        </div>     
      </div>
          <div className= "view-panel">
          <div className="icon-right-align">
          <FiMoreVertical className="context-menu-icon" onClick={handleContextMenuClick} />
          </div>
        {isWorkflowModalOpen && (
        <Modalworkflow
          clientNr = {clientNr}
          explorerId = {explorerId}
          onClose={() => {
            setIsWorkflowModalOpen(false);
            setNewTreeItem(newTreeItem+1);
          }}
        />
      )}
       {isProductModalOpen && (
        <Modalproduct
          clientNr = {clientNr}
          explorerId = {explorerId}
          onClose={() => {
            setIsProductModalOpen(false);
            setNewTreeItem(newTreeItem+1);
          }}
        />
      )}
      {showModalInvite && (
        <Modalinvite
          clientNr={user.clientNr}
          explorerId={user.explorerId}
          onClose={() => {
            setShowModalInvite(false);
          }}
        />
      )}
      {isConfigurationModalOpen && (
        <Modalconfiguration
          clientNr = {clientNr}
          explorerId = {explorerId}
          onClose={() => {
            setIsConfigurationModalOpen(false);
          }}
        />
      )}

      {isThirdpartiesOpen && (
              <Thirdparties
                clientNr = {clientNr}
                explorerId = {explorerId}
                onClose={() => {
                  setIsThirdpartiesOpen(false);
                }}
              />
            )}

        {isApiDefImportModalOpen && (
                <Modalapidefimport
                  clientNr = {clientNr}
                  explorerId = {explorerId}
                  onClose={() => {
                    setIsApiDefImportModalOpen(false);
                  }}
                />
              )}

        {isExportProductsModalOpen && (
                <ExportProducts
                  clientNr = {clientNr}
                  explorerId = {explorerId}
                  onClose={() => {
                  setIsExportProductsModalOpen(false);
                  }}
                />
              )}
        {isImportProductsModalOpen && (
                <ImportProducts
                  targetClientNr = {clientNr}
                  targetExplorerId = {explorerId}
                  onClose={() => {
                  setIsImportProductsModalOpen(false);
                  }}
                />
              )}

        {isServicedDeskModalOpen && (
                <JiraServiceDeskModal
                  clientNr = {clientNr}
                  explorerId = {explorerId}
                  onClose={() => {
                  setIsServicedDeskModalOpen(false);
                  }}
                />
              )}

          {treeContextMenuVisible && (
            <ContextMenuTree
              onSelectTreeMenuItem={handleSelectTreeMenuItem}
              position={treeContextMenuPosition}
            />
          )}    

          {contextMenuVisible && (
            <ContextMenu
              selectedItemType={selectedItemType}
              onSelectMenuItem={handleSelectMenuItem}
              position={contextMenuPosition}
            />
          )}
        {selectedItemType === 'product' ? 
        <Productview
        clientNr = {clientNr}
        explorerId = {explorerId}
        productName = {selectedProduct}
        authorization = {authorization}
        updateTreeView = {() => {
          setNewTreeItem(newTreeItem+1);
        }}
        /> 
        : null}
        {selectedItemType === 'productcompliance' ? 
        <Productcomplianceview
        clientNr = {clientNr}
        explorerId = {explorerId}
        productName = {selectedProduct}
        authorization = {authorization}
        updateTreeView = {() => {
          setNewTreeItem(newTreeItem+1);
        }}
        /> 
        : null}
        {selectedItemType === 'workflow' ?
         <Workflowview
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         name = {selectedWork}
         authorization = {authorization}
         updateTreeView = {() => {
          setNewTreeItem(newTreeItem+1);
        }}
       /> 
         : null} 
        {selectedItemType === 'workflowcompliance' ?
         <Workflowcomplianceview
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         name = {selectedWork}
         authorization = {authorization}
         updateTreeView = {() => {
          setNewTreeItem(newTreeItem+1);
        }}
       /> 
         : null} 
        {selectedItemType === 'workflowterminal' ?
        <TerminalContextProvider>
         <Workflowterminal
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         name = {selectedWork}
         authorization = {authorization}
       /> 
       </TerminalContextProvider>
         : null} 
        {selectedItemType === 'task' || selectedItemType === 'taskapi' ?
         <Taskview
         clientNr = {clientNr}
         explorerId = {explorerId}
         workflowName = {selectedWork}
         taskId = {selectedTaskId}
         authorization = {authorization}
         updateGraphView = {() => {
          setNewGraphItem(newGraphItem+1);
        }}
       /> 
         : null} 

        {selectedItemType === 'taskcompliance' ||  selectedItemType === 'apicompliance' ?
         <Taskcomplianceview
         clientNr = {clientNr}
         explorerId = {explorerId}
         workflowName = {selectedWork}
         taskId = {selectedTaskId}
         authorization = {authorization}
         updateGraphView = {() => {
          setNewGraphItem(newGraphItem+1);
        }}
       /> 
         : null}  
        {selectedItemType === 'link' ?
         <Linkview
         clientNr = {clientNr}
         explorerId = {explorerId}
         workflowName = {selectedWork}
         mylink = {selectedLink}
         linkId = {selectedLinkId}
         authorization = {authorization}
         updateGraphView = {() => {
          setNewGraphItem(newGraphItem+1);
        }}
       /> 
         : null} 
        {selectedItemType === 'api'  ?
        <TerminalContextProvider>
         <ApiTerminal
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         workflowName = {selectedWork}
         apiName = {selectedApi}
         taskId = {selectedTaskId}
       /> 
       </TerminalContextProvider>
         : null} 

        {(selectedItemType ==='apicode' ) ?
         <ApiCode
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         workflowName = {selectedWork}
         apiName = {selectedApi}
         taskId = {selectedTaskId}
         codeType = {selectedCodeType}
       /> 
         : null} 
        {(selectedItemType === 'workflowcode') ?
         <WorkflowCode
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         workflowName = {selectedWork}
         codeType = {selectedCodeType}
       /> 
         : null} 
          </div>
          
      </div>
   
  );
  
};

export default ProductTree;
