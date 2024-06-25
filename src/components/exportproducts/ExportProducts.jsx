import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsYaml from 'js-yaml';
import './exportproducts.css';
import ProgressBar from '../progressbar/ProgressBar';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { encodebody, getDecodedBody } from '../../utils/utils.js';

const ExportProduct = ({ clientNr, explorerId, onClose }) => {
  const [clientNrTarget, setClientNrTarget] = useState(clientNr);
  const [explorerIdTarget, setExplorerIdTarget] = useState(explorerId);
  const [fileName, setFileName] = useState('export');
  const [version, setVersion] = useState('1.0');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [exportAllProducts, setExportAllProducts] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/queryall', encodebody({ clientNr, explorerId }))
      .then(response => setProducts(getDecodedBody(response.data)))
      .catch(error => console.error("Error fetching products:", error));
  }, [clientNr, explorerId]);

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleExport = async () => {
    setShowProgressBar(true);
    setProgress(0);

    let exportData = {
      clientNr,
      explorerId,
      fileName,
      version,
      products: [],
      workflows: [],
      tasks: [],
      links: [],
      apis: []
    };

    const productsToExport = exportAllProducts ? products : products.filter(product => selectedProducts.includes(product.productName));
    const totalSteps = productsToExport.length * 3 + 1; // Adjust this based on your export process
    let currentStep = 0;

    for (const product of productsToExport) {
      exportData.products.push({ ...product });

      try {
        const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/workflow/queryallgivenproduct', encodebody({
          clientNr: product.clientNr,
          explorerId: product.explorerId,
          productName: product.productName,
        }));
        const productWorkflows = getDecodedBody(response.data);
        for (const workflow of productWorkflows) {
          exportData.workflows.push({ ...workflow });
        }
      } catch (error) {
        console.error(`Error fetching workflows for product ${product.productName}:`, error);
      }
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);
    }

    const myRandomString = generateRandomString(7);
    for (const workflow of exportData.workflows) {
      try {
        const taskResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/task/queryall', encodebody({
          clientNr: workflow.clientNr,
          explorerId: workflow.explorerId,
          workflowName: workflow.name,
        }));
        const workflowTasks = getDecodedBody(taskResponse.data);

        for (const task of workflowTasks) {
          const modifiedTask = {
            ...task,
            taskId: `EXP_CLONE_${myRandomString}${task.taskId}`
          };
          exportData.tasks.push(modifiedTask);
        }
      } catch (error) {
        console.error(`Error fetching tasks for workflow ${workflow.name}:`, error);
      }

      try {
        const linkResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/query', encodebody({
          clientNr: workflow.clientNr,
          explorerId: workflow.explorerId,
          workflowName: workflow.name,
        }));
        const workflowLink = getDecodedBody(linkResponse.data);
        const clonedLinks = workflowLink.links.map(link => ({
          ...link,
          source: `EXP_CLONE_${myRandomString}${link.source}`,
          target: `EXP_CLONE_${myRandomString}${link.target}`
        }));
        workflowLink.links = clonedLinks 
        exportData.links.push({ ...workflowLink });
      } catch (error) {
        console.error(`Error fetching link for workflow ${workflow.name}:`, error);
      }

      currentStep++;
      setProgress((currentStep / totalSteps) * 100);
    }

    try {
      const apiResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/queryall', encodebody({
        clientNr: clientNr, explorerId: explorerId
      }));
      const apis = getDecodedBody(apiResponse.data);
      for (const api of apis) {
        exportData.apis.push({ ...api });
      }
    } catch (error) {
      console.error("Error fetching APIs:", error);
    }

    setProgress(100);

    const yamlContent = jsYaml.dump(exportData);
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}-${version}.yaml`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setShowProgressBar(false);
  };

  const handleExportAllProductsChange = (e) => {
    setExportAllProducts(e.target.checked);
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.productName));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="ExportProductmodalDialog">
      <div className="topapidef">
        <div className="leftapiExport">Export Products 
          <a href="https://wiki.gwocu.com/en/GWOCU-Studio/product-tree-panel-menu#exportproducts-section" target="_blank" rel="noopener noreferrer">
            <HelpCenterIcon />
          </a>
        </div>
        <div className="close" onClick={onClose}>
          &times;
        </div>
      </div>
      <label>File Name</label>
      <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="File Name" />
      <br /><br />
      <label>Version</label>
      <input type="text" value={version} onChange={e => setVersion(e.target.value)} placeholder="Version" />
      <br /><br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="exportAllProducts"
          checked={exportAllProducts}
          onChange={handleExportAllProductsChange}
        />
        <label style={{ marginLeft: '5px' }} htmlFor="exportAllProducts">Export all Products or choose below</label>
      </div>
      <select className="productselect" multiple value={selectedProducts} onChange={e => setSelectedProducts([...e.target.selectedOptions].map(option => option.value))}>
        {products.map(product => (
          <option key={product.productName} value={product.productName}>{product.productName}</option>
        ))}
      </select>
      <br /><br />
      {showProgressBar && <ProgressBar progress={progress} />}
      <button className="ExportProductmodalclosebutton" onClick={handleExport}>Export</button>
      <button className="ExportProductmodalclosebutton" onClick={onClose}>Close</button>
    </div>
  );
};

export default ExportProduct;
