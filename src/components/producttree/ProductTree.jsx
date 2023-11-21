import React, { useState, useEffect } from 'react';
import "./producttree.css" ;
import axios from "axios";
import ApiTerminal from "../../components/apiTerminal/ApiTerminal";
import ApiCode from "../../components/apicode/ApiCode";
import WorkflowCode from "../../components/workflowcode/WorkflowCode";
import Graphview from "../../components/graphview/Graphview";
import Productview from "../productview/Productview";
import Workflowview from '../workflowview/Workflowview';
import Taskview from '../taskview/Taskview';
import ContextMenu from "../contextmenu/ContextMenu"; 
import { FiMoreVertical } from 'react-icons/fi'
import {convertToOpenAPI} from "../../utils/utils.js";
import jsYaml from 'js-yaml';
import { saveAs } from 'file-saver';

const clientNr = process.env.REACT_APP_CLIENTNR;
const explorerId = process.env.REACT_APP_EXPLORERID;

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

const ProductTree = () => {
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWork, setSelectedWorkflow] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedApi, setSelectedApi] = useState(null);
  const [selectedCodeType, setCodeType] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedMenu,setMenu ] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false); 
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 }); 

  async function exportApiOpenApi(ExportApiName)
  {
    try {
      const myApibody = 
      {
        clientNr: clientNr,
        name: ExportApiName
      }
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/api/query", myApibody);
      const myApi = await response.data;
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
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/queryorderedapi", myWorkflowbody);
      const myApiList = await response.data;

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

      const workflowListResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workflow/queryallgivenproduct", myWorkflowListRequestBody);
      const myWorkflowList = await workflowListResponse.data;
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
              const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/queryorderedapi", myWorkflowRequestbody);
              var myApiList = await response.data;
        
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


  const handleSelectMenuItem = (menuItem) => {
    switch (menuItem) {
      case 'javascript':
      case 'python':
        setMenu('code');
        if (selectedItemType === 'api') {
          setSelectedItemType("apicode");
        } else if (selectedItemType === 'workflow') {
          setSelectedItemType("workflowcode");
        }
        setCodeType(menuItem);
        break;
      case 'cURL':
          setMenu('cURL');
          if (selectedItemType === 'api' || selectedItemType === 'apicode' || selectedItemType === 'taskapi' ) {
            setSelectedItemType("api");
            break;
          } 
      case 'description':
          setMenu('description');
          if (selectedItemType === 'api' || selectedItemType === 'apicode' || selectedItemType === 'taskapi' ) {
            setSelectedItemType("taskapi");
            break;  
          } 
          if (selectedItemType === 'task' ) {
            setSelectedItemType("task");
            break;  
          } 
          if (selectedItemType === 'workflow' || selectedItemType === 'workflowcode' ) {
            setSelectedItemType("workflow");
            break;
          }
          break;
      case 'export-openapi':
        setMenu('export-openapi');
        if (selectedItemType === 'api'|| selectedItemType === 'apicode' || selectedItemType === 'taskapi' ) {
          exportApiOpenApi(selectedApi);
          break; } 
          if (selectedItemType === 'workflow' || selectedItemType === 'workflowcode' ) {
          exportWorkflowOpenApi(selectedWork);
          break;}
          if (selectedItemType === 'product') {
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
    console.log("We are in product Tree");
    console.log(newselectItem);
    console.log(newWorkflowName);
    console.log(newTaskId);
    
    setSelectedItemType(newselectItem);
    setSelectedProduct(newProductName);
    
    setSelectedTaskId(newTaskId);
    setSelectedApi(newApiName);
    setSelectedWorkflow(newWorkflowName);
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
  }, []);

  const fetchProducts = async () => {
    
    try {
      const mybody = 
      {
        clientNr: clientNr,
        explorerId: explorerId
      }
      // Make the API call using axios and parse the response as JSON
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/product/gettree", mybody);
      const json = response.data;

      // Set the data state variable with the JSON data
      setProducts(json);
      // on first fetch set the productname
      setSelectedProduct(json[0].name)
      setSelectedItemType('product');
    } catch (error) {
      // Handle any errors
      console.error(error);
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

  const handleContextMenuClick = (e) => {
    e.preventDefault();
    // Calculate the position of the context menu based on the click event
    setContextMenuPosition({ x: (e.clientX - 200), y: e.clientY });
    setContextMenuVisible(true);
  };

  const hideContextMenu = () => {
    setContextMenuVisible(false);
  };

  return (
    <div className="main-container">
        <div className="left-container">
          <br></br>
          {renderTree(products, false)}
        </div>
      <div className = "right-container">
        <div className="graph-view">
          <Graphview
            selectedProduct={selectedProduct}
            selectedWork={selectedWork}
            onTaskChange = {handleSelectedItemChange}
          />
        </div>
        <div className="lower-panel">

        <div className="icon-right-align">
          <FiMoreVertical className="context-menu-icon" onClick={handleContextMenuClick} />
        </div>

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
        /> 
        : null}
        {selectedItemType === 'workflow' ?
         <Workflowview
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         name = {selectedWork}
       /> 
         : null} 
        {selectedItemType === 'task' || selectedItemType === 'taskapi' ?
         <Taskview
         clientNr = {clientNr}
         explorerId = {explorerId}
         workflowName = {selectedWork}
         taskId = {selectedTaskId}
       /> 
         : null} 
        {selectedItemType === 'api'  ?
         <ApiTerminal
         clientNr = {clientNr}
         explorerId = {explorerId}
         productName = {selectedProduct}
         workflowName = {selectedWork}
         apiName = {selectedApi}
         taskId = {selectedTaskId}
       /> 
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
      </div>
  );
  
};

export default ProductTree;
