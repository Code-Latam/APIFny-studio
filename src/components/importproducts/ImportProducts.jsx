import React, { useState } from 'react';
import axios from 'axios';
import jsYaml from 'js-yaml';
import "./importproducts.css";
import ProgressBar from '../progressbar/ProgressBar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { encodebody, getDecodedBody } from "../../utils/utils.js";

const ImportProduct = ({ targetClientNr, targetExplorerId, onClose }) => {
  const existingProducts = new Set();
  const workflowsSet = new Set();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

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

  const updateProgress = (increment) => {
    setProgress((prevProgress) => prevProgress + increment);
  };

  const handleImport = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const data = jsYaml.load(text);

      const totalSteps = data.products.length + data.workflows.length + data.tasks.length + data.links.length + (data.apis ? data.apis.length : 0);
      const progressIncrement = 100 / totalSteps;

      // Process and register products
      for (const product of data.products) {
        const cleanedProduct = cleanObject(product);

        try {
          await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/query', encodebody({ clientNr: targetClientNr, explorerId: targetExplorerId, productName: cleanedProduct.productName }));
          existingProducts.add(cleanedProduct.productName);
        } catch (error) {
          await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/product/register', encodebody(cleanedProduct));
        } finally {
          updateProgress(progressIncrement);
        }
      }

      // Process and register workflows
      for (const workflow of data.workflows) {
        if (!existingProducts.has(workflow.productName)) {
          const cleanedWorkflow = cleanObject(workflow);
          try {
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/workflow/register', encodebody(cleanedWorkflow));
            workflowsSet.add(cleanedWorkflow.name);
          } catch (error) {
            console.error(`Error registering workflow `);
          } finally {
            updateProgress(progressIncrement);
          }
        }
      }

      // Process and register tasks
      for (const task of data.tasks) {
        if (workflowsSet.has(task.workflowName)) {
          const cleanedTask = cleanObject(task);
          try {
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/task/register', encodebody(cleanedTask));
          } catch (error) {
            console.error(`Error registering task`);
          } finally {
            updateProgress(progressIncrement);
          }
        }
      }

      // Process and register links
      console.log("ARRIVED AT LINKS", data.links)
      for (const link of data.links) {
        if (workflowsSet.has(link.workflowName)) {
          console.log("LINK HAS WORKFLOW NAME");
          if (link.links && Array.isArray(link.links)) {
            for (let i = 0; i < link.links.length; i++) {
              link.links[i] = cleanLink(link.links[i]);
            }
          }
          const cleanedLink = cleanObject(link);
          try {
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/update', encodebody(cleanedLink));
          } catch (error) {
            console.error(`Error registering link:`, error);
          } finally {
            updateProgress(progressIncrement);
          }
        }
      }
      console.log("STARTED WITH API");
      // Process and register APIs
      if (workflowsSet.size > 0) {
        console.log("SIZE OK");
        for (const api of data.apis) {
          const cleanedApi = cleanObject(api);
          try {
            console.log("IN QUERY API")
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/query', encodebody({ clientNr: targetClientNr, explorerId: targetExplorerId, name: cleanedApi.name }));
          } catch (error) {
            console.log("API NOT FOUND SAVING",cleanedApi);
            try {
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/register', encodebody(cleanedApi));
            console.log("SAVED");
            }
            catch(err)
            {
              console.log("error while saving api", err)
            }
          } finally {
            updateProgress(progressIncrement);
          }
        }
      }
      try{
        await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/sync', encodebody({ clientNr: targetClientNr, explorerId: targetExplorerId}));
        console.log("APIS SYNCED");
      }
      catch(err)
      {
        console.log("Could not SYNC apis");
      }
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        alert("Products imported!");
      }, 500);
    };

    reader.readAsText(file);
  };

  return (
    <div className="ImportProductmodalDialog">
      <div className="topapidef">
        <div className="leftapiImport">
          Import Products
          <a href="https://wiki.gwocu.com/en/GWOCU-Studio/product-tree-panel-menu#importproducts-section" target="_blank" rel="noopener noreferrer">
            <HelpCenterIcon />
          </a>
        </div>
        <div className="close" onClick={onClose}>
          &times;
        </div>
      </div>
      <label>Important notice: Existing products with the same name will NOT be overwritten!</label>
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <br />
      {progress > 0 && <ProgressBar progress={progress} />}
      <button className="ImportProductmodalclosebutton" onClick={handleImport}>Import</button>
      <button className="ImportProductmodalclosebutton" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default ImportProduct;
