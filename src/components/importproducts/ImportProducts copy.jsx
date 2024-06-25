import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsYaml from 'js-yaml';
import "./importproducts.css";


import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {encodebody, getDecodedBody} from "../../utils/utils.js";

  const ImportProduct = ({ targetClientNr, targetExplorerId,onClose }) => {

    const existingProducts = new Set();
    const workflowsSet = new Set();

    const [file, setFile] = useState(null);
  
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const cleanObject = (obj) => {
      const newObj = { ...obj };
      delete newObj._id;
      delete newObj.__v;
      delete newObj.createdAt;
      delete newObj.updatedAt;
      newObj.clientNr = targetClientNr;
      newObj.explorerId = targetExplorerId;
      return newObj;
    };

    const cleanLink = (obj) => {
      const newObj = { ...obj };
      delete newObj._id;
      delete newObj.__v;
      delete newObj.createdAt;
      delete newObj.updatedAt;
      return newObj;
    };
  
    const handleImport = async () => {
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const data = jsYaml.load(text);
  
        // Process and register products
        for (const product of data.products) {

          const cleanedProduct = cleanObject(product);
        
            // Check if the product already exists before attempting to register
            // This pseudocode assumes an endpoint for checking product existence
            try
            { 
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/query', encodebody({ clientNr: targetClientNr, explorerId: targetExplorerId, productName: cleanedProduct.productName }));
              existingProducts.add(cleanedProduct.productName);
              continue;
            }
            catch (error)
            {
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/register', encodebody(cleanedProduct));
            }           
        }
        // Process and register workflows
        // NOTE WORKFLOW CREATION WITH THE REGISTER API WILL AUTOMATICALLY CREATE A LINK OBJECT FOR THAT WORKFLOW
        for (const workflow of data.workflows) {
          if (!existingProducts.has(workflow.productName)) {
            const cleanedWorkflow = cleanObject(workflow);
            try {
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/workflow/register', encodebody(cleanedWorkflow));
              workflowsSet.add(cleanedWorkflow.name);
            } catch (error) {
              console.error(`Error registering workflow `);
            }
          }
        }

        for (const task of data.tasks) {
          if (workflowsSet.has(task.workflowName)) {
            const cleanedtask = cleanObject(task);
            try {

              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/task/register', encodebody(cleanedtask));
            } catch (error) {
              console.error(`Error registering task`);
            }
          }
        }

        console.log("DATALINKS LENGTH");
        console.log(data.links.length);
        for (const link of data.links) {
          if (workflowsSet.has(link.workflowName)) 
          {
           
            if (link.links && Array.isArray(link.links)) {
              for (let i = 0; i < link.links.length; i++) {
                // Clean each object in the links array
                link.links[i] = cleanLink(link.links[i]);
              }
            }
        
            const cleanedLink = cleanObject(link);
        
            try {
              // NOTE WORKFLOW CREATION WITH THE WORKFLOW REGISTER API HAS ALREADY CREATEd A LINK OBJECT FOR THAT WORKFLOW
              // SO WE NEED TO UPDATE IT!
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/update', encodebody(cleanedLink));
            } catch (error) {
              
              console.error(`Error registering link:`, error);
            }
          }
        }



        if (workflowsSet.size > 0)
        {
        for (const api of data.apis) {
          
            const cleanedapi = cleanObject(api);
            try {
              // try to find the API. if it exists, skip!
              const apiquery = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/query', encodebody({ clientNr: targetClientNr, explorerId: targetExplorerId ,name: cleanedapi.name }));
              continue; 
              
            } 
            catch (error) {
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/register', encodebody(cleanedapi));
            }
        }
        }
        
        alert("Products imported!")
  
        // Similar loops for workflows, tasks, links, and APIs
        // Ensure to use the cleaned objects and correct endpoints
      };
      reader.readAsText(file);
    };
  
  return (
    <div className = "ImportProductmodalDialog">
    <div className="topapidef">
     
          <div className="leftapiImport" >Import Products
          <a href="https://wiki.gwocu.com/en/GWOCU-Studio/product-tree-panel-menu#importproducts-section" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>
          </div>
   
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
      <label>Important notice. Existing Products with the same name will NOT be overwritten!</label>
      <br></br>
      <input type="file" onChange={handleFileChange} />
      <br></br>
      <br></br>
      <button className="ImportProductmodalclosebutton" onClick={handleImport}>Import</button>
      <button className="ImportProductmodalclosebutton" onClick={onClose}>
            Close
      </button>
    </div>
  );
};

export default ImportProduct;
