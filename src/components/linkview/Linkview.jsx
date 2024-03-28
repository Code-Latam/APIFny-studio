import React, { useState, useEffect } from 'react';
import "./linkview.css";
import axios from "axios";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

function Linkview({ clientNr, explorerId, workflowName, mylink,designerMode,updateGraphView }) {

  const [link, setLink] = useState(mylink);
  const emptyObject = Object.create(null);
  const [selectedPathParameters, setSelectedPathParameters] = useState(mylink.pathParameters || emptyObject);
  const [selectedQueryParameters, setSelectedQueryParameters] = useState(mylink.queryParameters || emptyObject);
  const [selectedRequestbodyParameters, setSelectedRequestBodyParameter] = useState(mylink.requestbodyParameters || emptyObject);
  console.log("PARAMETERS");
  console.log(selectedPathParameters);
  console.log(selectedQueryParameters);
  console.log(selectedRequestbodyParameters);
  
  const [selectedType, setSelectedType] = useState(mylink.type);
  const [isChecked, setIsChecked] = useState(mylink.passLinkParameters || false);

  const [sourceAndTargetNames, setSourceAndTargetNames] = useState({sourceName:"",targetName:""});
  const typeOptions = ["STRAIGHT", "CURVE_SMOOTH", "CURVE_FULL"];

  console.log('LINKVIEW');
  console.log(mylink)

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
  

  function replaceType(arr, source, target, newType, newPassLinkParameters,newPathParameters, newQueryParameters, newRequestBodyParameters) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].source === source && arr[i].target === target) {
        arr[i].type = newType || "STRAIGHT";
        arr[i].pathParameters = newPathParameters;
        arr[i].queryParameters = newQueryParameters;
        arr[i].requestbodyParameters = newRequestBodyParameters;
        arr[i].passLinkParameters = newPassLinkParameters || false;
        // If you want to stop after the first occurrence is replaced, you can return here
        return arr;
      }
    }
    return arr; // Return the array in case the source/target pair is not found
  }

  const handleUpdate = async () => {




    // check if JSON filed are valid JSON or empty string

    const MyrequestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName:workflowName
    };

    // get original links
    const myQueryResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/link/query', MyrequestBody);
    const myLinks = myQueryResponse.data.links;

    // replace the type in the original links
    const myNewLinks =  replaceType(myLinks, mylink.source, mylink.target, selectedType, isChecked, selectedPathParameters,selectedQueryParameters,selectedRequestbodyParameters) 
    
   

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

  const handlePathParametersChange = (data) => {
    if (data.jsObject) {
      setSelectedPathParameters(data.jsObject);  
    }
  };

  const handleQueryParametersChange = (data) => {
    if (data.jsObject) {
      setSelectedQueryParameters(data.jsObject);  
    }
  };

  const handleRequestBodyParametersChange = (data) => {
    if (data.jsObject) {
      setSelectedRequestBodyParameter(data.jsObject);  
    }
  };

  return (
    <div className="Taskview">
      <div>
        
        {link ? (
          <div>
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
              <JSONInput
              id='json-editor1'
              placeholder={selectedPathParameters} // data to display
              locale={locale}
              height='100px'
              onChange={handlePathParametersChange}
              />  
              <br></br>           
              <label htmlFor="queryParameter">Query Parameters</label>
              <JSONInput
              id='json-editor2'
              placeholder={selectedQueryParameters} // data to display
              locale={locale}
              height='100px'
              onChange={handleQueryParametersChange}
              
              />   
               <br></br>
              <label htmlFor="requestbodyParameter">Requestbody Parameters</label>
              <JSONInput
              id='json-editor3'
              placeholder={selectedRequestbodyParameters} // data to display
              locale={locale}
              height='100px'
              onChange={handleRequestBodyParametersChange}
              
              />   

              <br/>
              <label htmlFor="linkType">Link Type</label>
              <br/>
              <select
                id="linkType"
                value={selectedType}
                className="LinkTViewType"
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={!designerMode }
                
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <br />
            {designerMode && (
              <div>
                <button onClick={handleUpdate}>Update</button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading Link information...</p>
        )}
      </div>
    </div>
  );
}

export default Linkview;
