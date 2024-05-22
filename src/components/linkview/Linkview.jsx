import React, { useState, useEffect } from 'react';
import "./linkview.css";
import axios from "axios";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Editor from '@monaco-editor/react';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

function Linkview({ clientNr, explorerId, workflowName, mylink,authorization,updateGraphView }) {

  const [link, setLink] = useState(mylink);
  const emptyObject = Object.create(null);
  const [selectedPathParameters, setSelectedPathParameters] = useState(mylink.pathParameters || emptyObject);
  const [selectedPathOrder, setSelectedPathOrder] = useState(mylink.pathOrder || []);
  console.log("MYLINK",mylink );
  console.log("PATHORDER",mylink.pathOrder );
  
  const [selectedQueryParameters, setSelectedQueryParameters] = useState(mylink.queryParameters || emptyObject);
  const [selectedRequestbodyParameters, setSelectedRequestBodyParameter] = useState(mylink.requestbodyParameters || emptyObject);
 
  
  const [selectedType, setSelectedType] = useState(mylink.type);
  const [isChecked, setIsChecked] = useState(mylink.passLinkParameters || false);

  const [sourceAndTargetNames, setSourceAndTargetNames] = useState({sourceName:"",targetName:""});
  const typeOptions = ["STRAIGHT", "CURVE_SMOOTH", "CURVE_FULL"];

  function isValidJSON(str) {
    if (str === undefined || str ==="") {
      return true; // Treat empty string and undefined as valid JSON
    }
  
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }
  

  function replaceType(arr, source, target, newType, newPassLinkParameters,newPathParameters, newPathOrder, newQueryParameters, newRequestBodyParameters) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].source === source && arr[i].target === target) {
        arr[i].type = newType || "STRAIGHT";
        arr[i].pathParameters = newPathParameters;
        arr[i].pathOrder = newPathOrder;
        arr[i].queryParameters = newQueryParameters;
        arr[i].requestbodyParameters = newRequestBodyParameters;
        arr[i].passLinkParameters = newPassLinkParameters || false;
        // If you want to stop after the first occurrence is replaced, you can return here
        return arr;
      }
    }
    return arr; // Return the array in case the source/target pair is not found
  }

  function validateParametersAndOrder(parameters, order) {

    // check if both parameters are valid objects:

    if (typeof parameters !== 'object' || parameters === null || Array.isArray(parameters)) {
      return { valid: false, message: "Path Parameters should be an object. It is allowed to be an empty object {}" };
    }

    // Check if order is an array
    if (!Array.isArray(order)) {
      return { valid: false, message: "Path Order should be an array." };
    }

    for (let key of order) {
      if (typeof key !== 'string') {
        return { valid: false, message: "Path Order array should contain only strings." };
      }
    }
  
    // Check if both parameters and order are empty
    if (Object.keys(parameters).length === 0 && order.length === 0) {
      return { valid: true, message: "Both Path Parameters and Path Order are empty and valid." };
    }
  
    // Check if only one of the parameters or order is empty
    if ((Object.keys(parameters).length === 0 && order.length > 0) || (Object.keys(parameters).length > 0 && order.length === 0)) {
      return { valid: false, message: "If Path Parameters is empty, Path Order must be empty, and vice versa." };
    }
  
    // Check if all elements in the order array are keys in the parameters object
    for (let key of order) {
      if (!parameters.hasOwnProperty(key)) {
        return { valid: false, message: `Path Order key '${key}' is not found in Path Parameters.` };
      }
    }
  
    // Check for duplicate keys in the order array
    let uniqueKeys = new Set(order);
    if (uniqueKeys.size !== order.length) {
      return { valid: false, message: "Path Order contains duplicate keys." };
    }
  
    // Check if the parameters object has the correct structure
   
  
    for (let key in parameters) {
      let value = parameters[key];
      if (typeof key !== 'string' || (typeof value !== 'string' && typeof value !== 'number')) {
        return { valid: false, message: "Path Parameters object should have string keys and string or numeric values." };
      }
      // Check for empty string values
      if (typeof value === 'string' && value.trim() === '') {
        return { valid: false, message: `Path Parameter value for key '${key}' is an empty string.` };
      }
      // Check for reserved characters in values
      if (typeof value === 'string' && /[?&/#]/.test(value)) {
        return { valid: false, message: `Path Parameter value for key '${key}' contains reserved characters.` };
      }
      // Check for valid URL encoding
      try {
        encodeURIComponent(value);
      } catch (e) {
        return { valid: false, message: `Path Parameter value for key '${key}' is not URL-encodable.` };
      }
    }
  
    return { valid: true, message: "Both Path Parameters and Path Order objects are valid." };
  }
  
  function validateQueryParameters(queryParameters) {
    // Check if queryParameters is a non-null object

   
  
    // Function to check if a value is a valid type (string, number, boolean, or array of these)
    function isValidValue(value) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return true;
      }
      if (Array.isArray(value) && value.length > 0) {
        return value.every(item => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean');
      }
      return false;
    }


    if (typeof queryParameters !== 'object' || queryParameters === null || Array.isArray(queryParameters)) {
      return { valid: false, message: "Query parameters is only allowed to be a non array object." };
    }
  
    for (let key in queryParameters) {
      let value = queryParameters[key];
  
      // Check if keys are strings
      if (typeof key !== 'string') {
        return { valid: false, message: `Query Parameters key '${key}' is not a string.` };
      }
  
      // Check if values are of valid types
      if (!isValidValue(value)) {
        return { valid: false, message: `Query Parameters value for key '${key}' is not a valid type.` };
      }
  
      // Check for reserved characters in keys and values
      if (/[?&/#]/.test(key)) {
        return { valid: false, message: `Query Parameters key '${key}' contains reserved characters.` };
      }
  
      if (typeof value === 'string' && /[?&/#]/.test(value)) {
        return { valid: false, message: `Query Parameters value for key '${key}' contains reserved characters.` };
      }
  
      // Check for valid URL encoding
      try {
        encodeURIComponent(key);
        if (typeof value === 'string') {
          encodeURIComponent(value);
        } else if (Array.isArray(value)) {
          value.forEach(item => encodeURIComponent(item));
        }
      } catch (e) {
        return { valid: false, message: `Query parameter key or value for key '${key}' is not URL-encodable.` };
      }
    }
  
    return { valid: true, message: "Query parameters are valid." };
  }
  
  
  

  const handleUpdate = async () => {
  console.log("IN HANDLE UPDATE");
   const pathValidation = validateParametersAndOrder(selectedPathParameters,selectedPathOrder);
   const queryValidation = validateQueryParameters(selectedQueryParameters);
    
   if (!pathValidation.valid) 
   {
    alert(pathValidation.message);
    return
   }

   if (!queryValidation.valid) 
   {
    alert(queryValidation.message);
    return
   }

    const MyrequestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName:workflowName
    };

    // get original links
    const myQueryResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/query', MyrequestBody);
    const myLinks = myQueryResponse.data.links;

    // replace the type in the original links
    const myNewLinks =  replaceType(myLinks, mylink.source, mylink.target, selectedType, isChecked, selectedPathParameters,selectedPathOrder,selectedQueryParameters,selectedRequestbodyParameters) 
    
   

    // Update the links object
    const MyPayload = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName:workflowName,
      links:myNewLinks
    };

      const myResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/update', MyPayload);
      updateGraphView();
  };

  useEffect(() => {
    // Define the API URL for fetching the product

        // fetch the source name and target name of the nodes
        fetch();
  }, [workflowName,mylink]);

  async function fetch() {
    const myPayloadSource = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName: workflowName,
      taskId: mylink.source

    }
    const myPayloadTarget = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName: workflowName,
      taskId: mylink.target

    }

    const myResponseSource = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/task/query", myPayloadSource )
    const myResponseTarget = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/task/query", myPayloadTarget )
     
    console.log("AFTER FETCH");
    console.log(myResponseSource.data.name);


    const mySourceAndTargetNames = {
      sourceName: myResponseSource.data.name,
      targetName: myResponseTarget.data.name,
    }

    setSourceAndTargetNames(mySourceAndTargetNames)
    setLink(mylink);

  }



  const handlePathParametersChange = (value, event) => {
    console.log("change");
    
    let parsedValue;
  
    // Check if the value is an empty string and set it to an empty object
    if (value === '') {
      parsedValue = {};
    } else {
      try {
        // Attempt to parse the value as JSON
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.error("Invalid JSON:", error);
        // If the value is not valid JSON, you might want to handle this case, 
        // e.g., by not calling setApiData, showing an error message, etc.
        return; // Exit the function if the JSON is invalid
      }
    }
  
    // Update the state with the parsed value, which is now guaranteed to be an object
    setSelectedPathParameters(parsedValue);
  };


  const handlePathOrderChange = (value, event) => {
    
    
    let parsedValue;
  
    // Check if the value is an empty string and set it to an empty array
    if (value === '') {
      parsedValue = [];
    } else {
      try {
        // Attempt to parse the value as JSON
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.error("Invalid JSON:", error);
        // If the value is not valid JSON, you might want to handle this case, 
        // e.g., by not calling setApiData, showing an error message, etc.
        return; // Exit the function if the JSON is invalid
      }
    }
  
    // Update the state with the parsed value, which is now guaranteed to be an JSON object
    setSelectedPathOrder(parsedValue);
  };

  const handleQueryParametersChange = (value, event) => {
    console.log("change");
    
    let parsedValue;
  
    // Check if the value is an empty string and set it to an empty object
    if (value === '') {
      parsedValue = {};
    } else {
      try {
        // Attempt to parse the value as JSON
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.error("Invalid JSON:", error);
        // If the value is not valid JSON, you might want to handle this case, 
        // e.g., by not calling setApiData, showing an error message, etc.
        return; // Exit the function if the JSON is invalid
      }
    }
  
    // Update the state with the parsed value, which is now guaranteed to be an object
    setSelectedQueryParameters(parsedValue);
  };


  const handleRequestBodyParametersChange = (value, event) => {
    console.log("change");
    
    let parsedValue;
  
    // Check if the value is an empty string and set it to an empty object
    if (value === '') {
      parsedValue = {};
    } else {
      try {
        // Attempt to parse the value as JSON
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.error("Invalid JSON:", error);
        // If the value is not valid JSON, you might want to handle this case, 
        // e.g., by not calling setApiData, showing an error message, etc.
        return; // Exit the function if the JSON is invalid
      }
    }
  
    // Update the state with the parsed value, which is now guaranteed to be an object
    setSelectedRequestBodyParameter(parsedValue);
  };

 

  return (
    <div className="Taskview">
      <div>
        
        {link ? (
          <div>
            {(authorization.designer || authorization.owner) && (
              <div className = "left-top-buttons-productview">
                <button onClick={handleUpdate}>Update</button>
                <Tippy content={<CustomTooltip content={tooltips.linkView.content} isHtml={tooltips.linkView.isHtml} />} placement="right" theme = "terminal" trigger ='click' interactive = "true" >      
                <HelpCenterIcon/>
                </Tippy>
              </div>
            )}
            <br></br>
            <div>
              <label htmlFor="source">Source</label>
              <input
                type="text"
                id="source"
                value={sourceAndTargetNames.sourceName}
                className="LinkViewinputname"
                disabled
              />
            </div>
            <div>
              <label htmlFor="target">Target</label>
              <input
                type="text"
                id="target"
                value={sourceAndTargetNames.targetName}
                className="LinkViewinputname"
                disabled
              />
            <div className="checkboxContainer">
              <input
              type="checkbox"
              className = "passLinkParametersCheckbox"
              id="passLinkParametersCheckbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
             <label htmlFor="passLinkParametersCheckbox">Pass following Parameters to target API..</label>
        
            </div>
            
            <label htmlFor="pathParameter">Path Parameters</label>

              <Editor
              id='json-editor1'
              defaultLanguage="json"
              defaultValue= {JSON.stringify(selectedPathParameters, null, 2)}
              height='100px'
              onChange={handlePathParametersChange}
              theme="vs-dark"
              />

              <br></br>     

              <label htmlFor="pathOrder">Path Order</label>
              <Editor
              id='json-editor1-1'
              defaultLanguage="json"
              defaultValue= {JSON.stringify(selectedPathOrder, null, 2)}
              height='100px'
              onChange={handlePathOrderChange}
              theme="vs-dark"
              />

              <br></br>   

              <label htmlFor="queryParameter">Query Parameters</label>
              <Editor
              id='json-editor2'
              defaultLanguage="json"
              defaultValue= {JSON.stringify(selectedQueryParameters, null, 2)}
              height='100px'
              onChange={handleQueryParametersChange}
              theme="vs-dark"
              /> 
               <br></br>
              <label htmlFor="requestbodyParameter">Requestbody Parameters</label>

              <Editor
              id='json-editor3'
              defaultLanguage="json"
              defaultValue= {JSON.stringify(selectedRequestbodyParameters, null, 2)}
              height='100px'
              onChange={handleRequestBodyParametersChange}
              theme="vs-dark"
              /> 

              <br/>
              <label htmlFor="linkType">Link Type</label>
              <select
                id="linkType"
                value={selectedType}
                className="LinkTViewType"
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={!authorization.designer && !authorization.owner }
                
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
           
            
          </div>
        ) : (
          <p>Loading Link information...</p>
        )}
      </div>
    </div>
  );
}

export default Linkview;
