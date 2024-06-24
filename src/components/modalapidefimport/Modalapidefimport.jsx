import React, { useState, useEffect } from "react";
import axios from "axios";
import "./modalapidefimport.css";
import FileUpload from '../fileupload/FileUpload';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {encodebody, getDecodedBody} from "../../utils/utils.js";

function Modalapidefimport({ clientNr, explorerId,onClose }) {

  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWorkflowName, setSelectedWorkflowName] = useState("No Name Yet");
  const [selectedWorkflowDescription, setSelectedWorkflowDescription] = useState("No Description Yet");
  

  useEffect(() => {
    const fetchData = async () => {
      // first query products for products listbox


      const myProductsPayload = {
        clientNr: clientNr,
        explorerId: explorerId,
      }
      try {
        const productresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/product/queryall", encodebody(myProductsPayload));
        const productresponseData = getDecodedBody(productresponse.data)
        setProducts(productresponseData);
         
        
        if (productresponseData.length > 0) {
          setSelectedProduct(productresponseData[0].productName);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  const handleNameChange = (event) => {
    setSelectedWorkflowName(event.target.value);
  };
  
  const handleDescriptionChange = (event) => {
    setSelectedWorkflowDescription(event.target.value)
    }


  
  const handleSave = async () => {
    // Perform save logic with selectedSource and selectedTarget
    // You can use these values to update your backend or state, as needed
    if (await handleCreateProduct(selectedProduct, selectedWorkflowName,selectedWorkflowDescription))
    {
      onClose(); 
    }  
  };

  async function handleCreateProduct(productName, workflowName, workflowDescription) {
    try {
      const mypayload = {
        clientNr: clientNr,
        explorerId: explorerId,
        productName: productName,
        name: workflowName,
        description: workflowDescription
      };
  
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workflow/register", encodebody(mypayload));
      const responseData = getDecodedBody(response.data);
      // Check if the response indicates an error
      if (responseData && responseData.error) {
        // Display an alert with the error data
        alert(`Error: ${responseData.error}`);
        return false;
      }
  
      // setNodesAdded(nodesAdded + 1);
      return true;
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
      return false;
    }
  };
  

  

  return (
    <div className="modalDialog">
      <div>
        <div className="topapidef">
            <div className="leftapiImport">Import Api Definitions
            <a href="https://wiki.gwocu.com/en/GWOCU-Studio/product-tree-panel-menu#importapi-section" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>
          </div>
        
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>

        <div className="switch-container">
          <FileUpload
          clientNr = {clientNr}
          explorerId = {explorerId}
          />
        </div>

        <div className="modalDialog-buttons">
          <button className="modalclosebutton" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


export default Modalapidefimport;
