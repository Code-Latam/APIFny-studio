import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsYaml from 'js-yaml';
import "./importproducts.css";


  const ImportProduct = ({ targetClientNr, targetExplorerId,onClose }) => {

    const existingProducts = new Set();
    const existingworkflows = new Set();

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
  
    const handleImport = async () => {
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const data = jsYaml.load(text);
  
        // Process and register products
        for (const product of data.products) {
          const cleanedProduct = cleanObject(product);
          try {
            // Check if the product already exists before attempting to register
            // This pseudocode assumes an endpoint for checking product existence
            const product = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/query', { clientNr: targetClientNr, explorerId: targetExplorerId,productName: cleanedProduct.productName });
            if (product) 
            { existingProducts.add(cleanedProduct.productName);
              continue;
            }   
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/register', cleanedProduct);

          } catch (error) {
            console.error(`Error registering product ${cleanedProduct.productName}:`, error);
          }
        }
        // Process and register workflows

        for (const workflow of data.workflows) {
          if (existingProducts.has(workflow.productName)) {
            const cleanedWorkflow = cleanObject(workflow);
            try {
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/workflow/register', cleanedWorkflow);
              existingworkflows.add(cleanedWorkflow.name);
            } catch (error) {
              console.error(`Error registering workflow `);
            }
          }
        }

        for (const task of data.tasks) {
          if (existingworkflows.has(task.workflowName)) {
            const cleanedtask = cleanObject(task);
            try {

              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/task/register', cleanedtask);
            } catch (error) {
              console.error(`Error registering task`);
            }
          }
        }

        for (const link of data.links) {
          if (existingworkflows.has(link.workflowName)) {
            const cleanedlink = cleanObject(link);
            try {
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/register', cleanedlink);
            } catch (error) {
              console.error(`Error registering link`);
            }
          }
        }

        for (const api of data.apis) {
          
            const cleanedapi = cleanObject(api);
            try {
              const apiquery = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/query', { clientNr: targetClientNr, name: cleanedapi.name });
              if (apiquery) continue; 
              await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/register', cleanedapi);
            } catch (error) {
              console.error(`Error registering api`);
            }
        }

        
  
        // Similar loops for workflows, tasks, links, and APIs
        // Ensure to use the cleaned objects and correct endpoints
      };
      reader.readAsText(file);
    };
  
  return (
    <div className = "ImportProductmodalDialog">
    <div className="topapidef">
          <div className="leftapiImport">Import Products</div>
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
      <label>Important notice. Existing Product with the same name will not be overwritten!</label>
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
