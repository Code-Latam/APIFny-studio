import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsYaml from 'js-yaml';
import "./exportproducts.css";

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const ExportProduct = ({ clientNr, explorerId, onClose }) => {


  console.log('IN EXPORT')  ;
  const [clientNrTarget, setClientNrTarget] = useState(clientNr);
  const [explorerIdTarget, setExplorerIdTarget] = useState(explorerId);

  const [fileName, setFileName] = useState('export');
  const [version, setVersion] = useState('1.0');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [exportAllProducts, setExportAllProducts] = useState(false);
  // Assume similar states for tasks, links, and APIs

  // Fetch initial data for products
  useEffect(() => {
    axios.post(process.env.REACT_APP_CENTRAL_BACK +'/product/queryall', { clientNr, explorerId })
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
    // Fetch workflows, tasks, and links in a similar manner
  }, [clientNr, explorerId]);

  const handleExport = async () => {
    let exportData = {
      clientNr,
      explorerId,
      fileName,
      version,
      products: [],
      workflows: [],
      tasks:[],
      links:[],
      apis:[]

      // Include tasks and links in a similar structure
    };

    const productsToExport = exportAllProducts ? products : products.filter(product => selectedProducts.includes(product.productName));

    // go through all the products that are to be exported and add the workflows belonging to it
  for (const product of productsToExport) {
    exportData.products.push({ ...product });

    // Assuming there's an API endpoint to fetch workflows by product name
    // Fetch and compile workflows associated with the current product
    try {
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/workflow/queryallgivenproduct', {
        clientNr: product.clientNr,
        explorerId: product.explorerId,
        productName: product.productName,
      });
      const productWorkflows = response.data;
      for (const workflow of productWorkflows) {
        exportData.workflows.push({ ...workflow });
        // Here you can add logic to fetch and include tasks and links for each workflow
      }
    } catch (error) {
      console.error(`Error fetching workflows for product ${product.productName}:`, error);
    }
  }

  // Fetch tasks for each workflow in the workflows array
  for (const workflow of exportData.workflows) {
    try {
      const taskResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/task/queryall', {
        clientNr: workflow.clientNr,
        explorerId: workflow.explorerId,
        workflowName: workflow.name,
      });
      const workflowTasks = taskResponse.data;

      for (const task of workflowTasks) {
        exportData.tasks.push({
          ...task
        });
      }
    } catch (error) {
      console.error(`Error fetching tasks for workflow ${workflow.name}:`, error);
    }
    // fetch also the links
    try {
        const linkResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK +'/link/query', {
          clientNr: workflow.clientNr,
          explorerId: workflow.explorerId,
          workflowName: workflow.name,
        });
        const workflowLink = linkResponse.data; // Assuming this returns a single link object
  
        exportData.links.push({
          ...workflowLink
        });
      } catch (error) {
        console.error(`Error fetching link for workflow ${workflow.name}:`, error);
      }
  }

  //finally add the APIS To the export too!

  try {
    const apiResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/queryall', {
      clientNr: clientNr, explorerId: explorerId // Use the clientNr provided to the component
    });
    const apis = apiResponse.data;
  
    // Assuming `apis` is an array of API objects
    for (const api of apis) {
      exportData.apis.push({ ...api }); // Add each API object to the exportData.apis array
    }
  } catch (error) {
    console.error("Error fetching APIs:", error);
  }

    // Convert to YAML
    const yamlContent = jsYaml.dump(exportData);
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}-${version}.yaml`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleExportAllProductsChange = (e) => {
    setExportAllProducts(e.target.checked);
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.productName)); // Optionally select all products in UI
    } else {
      setSelectedProducts([]); // Clear selection when unchecked
    }
  };

  return (
    <div className = "ExportProductmodalDialog">
    <div className="topapidef">
         <div className="leftapiExport" >Export Products 
         <Tippy content={<CustomTooltip content={tooltips.exportProducts.content} isHtml={tooltips.exportProducts.isHtml} />} placement="right" theme = "terminal" maxWidth= "700px"  trigger ='click' interactive = "true" >    
          <HelpCenterIcon />
          </Tippy>
          </div>
    
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
      <label>File Name</label>
      <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="File Name" />
      <br></br>
      <br></br>
      <label>Version</label>
      <input type="text" value={version} onChange={e => setVersion(e.target.value)} placeholder="Version" />
      <br></br>
      <br></br>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="exportAllProducts"
          checked={exportAllProducts}
          onChange={handleExportAllProductsChange}
        />
        <label style={{ marginLeft: '5px' }} htmlFor="exportAllProducts">Export all Products or choose below</label>
      </div>
      
      <select className = "productselect" multiple value={selectedProducts} onChange={e => setSelectedProducts([...e.target.selectedOptions].map(option => option.value))}>
        {products.map(product => (
          <option key={product.productName} value={product.productName}>{product.productName}</option>
        ))}
      </select>
      <br></br>
      <br></br>

      {/* Workflow Selection UI (similar to products) */}

      <button className="ExportProductmodalclosebutton" onClick={handleExport}>Export</button>
      <button className="ExportProductmodalclosebutton" onClick={onClose}>
            Close
      </button>
    </div>
  );
};

export default ExportProduct;
