
import React, { useState, useEffect } from "react"
import './apiTerminal.css'; // Import your CSS file here
import axios from "axios";
import crypto from 'crypto-js';
import {HeadersGlobalAdd, requestBodyGlobalAdd, addAuthToHeaders, addAuthToRequestBody, parseApiHeaders, getConfiguration, isValidConfiguration, isObject} from "../../utils/api-spec-util.js";
import { ReactTerminal } from "react-terminal";
import ReactJson from 'react-json-view';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {encodebody, getDecodedBody} from "../../utils/utils.js";

const ApiTerminal = ({ clientNr, explorerId, productName, workflowName, taskId,apiName }) => {
  const [gwoken, setGwoken] = useState('saasasasas');
  const [chatbotKey, setChatbotKey] = useState('chatbot199');
  const [username, setUsername] = useState('Rodolfo Dominguez');
  const [response, setResponse] = useState('');
  const [route, setRoute] = useState('');
  const [api, setApi] = useState([]);
  const [explorer, setExplorer] = useState([]);
  const [requestBodyFields, setRequestBodyFields] = useState({});
  const [reload, setReload] = useState(false);


  const commands = {
    whoami: () => {
      console.log("HELLO");
      return "jackharper"
    },
    cd: (directory) => {
      const myreturn = `changed path to ${directory}`;
      return myreturn;
    },
    run: async () => {
      try {
        // Execute the handleSubmit logic when "run" is entered in the terminal
        const myResponse = await handleSubmit();
        console.log("JASON");
        console.log(myResponse);

        let jsonResponse;
        if (typeof myResponse === 'string') {
          // Convert string to a valid JSON object
          jsonResponse = { data: myResponse };
        } else {
          // myResponse is already an object, use it directly
          jsonResponse = myResponse;
        }
      

        return (
          <ReactJson src={jsonResponse} theme="apathy"   name={null} collapsed={1} />
        );
      } catch (error) {
        console.error('Error during API execution:', error);
        return <div style={{ color: '#006400' }}> {'An error occurred during API execution'}</div>;
      }
    },
  };

  function removeProperty(propertyName, object) {
    // create a new object to store the result
    let result = {};
    // loop through the keys of the original object
    for (let key in object) {
      // if the key is not equal to the property name to remove
      if (key !== propertyName) {
        // copy the key-value pair to the result object
        result[key] = object[key];
      }
    }
    // return the result object
    return result;
  }

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const endpoint = `${process.env.REACT_APP_CENTRAL_BACK}/api/registercustom`;

      const myCustomPayload = {
        ...api,
        requestBody: requestBodyFields,
        clientNr: clientNr,
        explorerId: explorerId,
        userClientNr:user.clientNr,
        urlRoute: route,
        email: user.email,
        chatbotKey: user.chatbotKey,
      };

      const registerCustomPayload = removeProperty("_id", myCustomPayload );

      const response = await axios.post(endpoint, encodebody(registerCustomPayload));
      alert("Custom API values saved!");
      setReload(true);
    } catch (error) {
      alert("Error during save operation: " + (error.response ? JSON.stringify(getDecodedBody(error.response.data)) : error.message));
    }
  };


  const handleRestoreDefault = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const endpoint = `${process.env.REACT_APP_CENTRAL_BACK}/api/deletecustom`;

      const query = {
        userClientNr: user.clientNr,
        explorerId: explorerId,
        name: apiName,
        email: user.email,
        chatbotKey: user.chatbotKey
      };

      const response = await axios.post(endpoint, encodebody(query));
      alert("Default API values restored!");
      setReload(true);
    } catch (error) {
      alert((error.response ? JSON.stringify(getDecodedBody(error.response.data)) : error.message));
    }
  };


  const handleRequestBodyChange = (field, value) => {
    // Try to parse the value as JSON
    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
    } catch (error) {
      // If parsing fails, use the raw value
      parsedValue = value;
    }
  
    // Update the state with the new value for the specified field
    setRequestBodyFields((prevFields) => ({
      ...prevFields,
      [field]: parsedValue,
    }));
    console.log("REQUEST BODY FIELDS");
    console.log(requestBodyFields);
  };



  const handleRouteChange = (value) => {
    // Update the state with the new value for the specified field
    setRoute(value)
  };

  handleRouteChange

  useEffect( () => {
    // Fetch the initial products using an API call
    // Replace this with your actual API endpoint
    if (reload) {
      setReload(false); 
     }

    fetchApi();
  }, [reload, clientNr,explorerId,apiName]);

  const fetchApi = async () => {
    var user = JSON.parse(localStorage.getItem("user"));
    
    try {
      const myApibody = 
      {
        clientNr: clientNr,
        explorerId: explorerId,
        userClientNr: user.clientNr,
        name: apiName,
        custom: true,
        email: user.email,
        chatbotKey: user.chatbotKey
      }
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/api/query", encodebody(myApibody));
      var myApi = getDecodedBody(response.data);

      try 
      {
        const myLinkParamPayload =
        {
          clientNr: clientNr,
          explorerId: explorerId,
          workflowName: workflowName,
          taskId: taskId,
          chatbotKey: user.chatbotKey,
          email:user.email,
          baseUrl: myApi.resourcePath ? myApi.resourcePath : ""
        }
        console.log("MYLINK PARAM PAYLOAD", myLinkParamPayload );
        const myLinkParamResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/querylinkparameters", encodebody(myLinkParamPayload));
        var myParams = getDecodedBody(myLinkParamResponse.data);
        var activeLinks = false;
        if (myParams.activeLinks)
        {
          setRoute(myParams.path)
          activeLinks = true ;
        }
        else
        {
          setRoute(myApi.urlRoute)
          activeLinks = false;
        }

      }
      catch(error)
      {
        setRoute(myApi.urlRoute)
        activeLinks = false;
      }
      

      const myExplorerbody = 
      {
        clientNr: clientNr,
        explorerId: explorerId
      }
      const Eresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/explorer/query", encodebody(myExplorerbody));
      const myExplorer = getDecodedBody(Eresponse.data);
      setExplorer(myExplorer);

      if (myApi.requestBody) {
        console.log('API REQUEST BODY', myApi.requestBody);
        const yamlObject = await getConfiguration(myExplorer,myApi.thirdparty);
        // console.log("YAML");
        // console.log(yamlObject);
        var initialRequestBodyFields
        if (activeLinks)
        {
          initialRequestBodyFields = {...myParams.requestBody} ;
          myApi.requestBody = {...myParams.requestBody};
        }
        else
        {
          initialRequestBodyFields = { ...myApi.requestBody };
        }
        
        setApi(myApi);

        const myRequestBodyWithGlobals = requestBodyGlobalAdd( initialRequestBodyFields,yamlObject);
        console.log('REQUEST BODY WITH GLOBALS ADDED', myRequestBodyWithGlobals);
        setRequestBodyFields(myRequestBodyWithGlobals);
      }


    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };
  
  
  

  const handleSubmit = async (e) => {
    try {
    // e.preventDefault();
    setResponse(''); // Clear the response

    // get the YAML configuration of GWOCU Studio for this explorer 
    if (!isValidConfiguration(explorer ))
    {
      alert("The GWOCU STudio configuration file is not a valid yaml file.");
      return;
    }
    const yamlObject = await getConfiguration(explorer, api.thirdparty)
    console.log("YAML");
    console.log(yamlObject);
    //build the headers as found in the API dynamically
    const apiHeaders = parseApiHeaders(api);
    // add or replace the global parameters (found in the config) to the headers
    const myheadersWithGlobals = HeadersGlobalAdd(apiHeaders,yamlObject )
    // add or replace the global parameters (found in the config) to the request body
    // const myRequestBodyWithGlobals = requestBodyGlobalAdd( requestBodyFields,yamlObject)
    
    const finalHeaders = addAuthToHeaders(myheadersWithGlobals,yamlObject );
    console.log("FINAL HEADERS");
    console.log(finalHeaders);
    const finalRequestBody = addAuthToRequestBody(requestBodyFields,yamlObject,crypto);
    // we are using the relay function of our backen to get to the clients API so:

    finalHeaders["destination"] = route;

    //  Determine the three mayor parameters of API call based on the authentication case

    console.log("FINAl HEADERS");
    console.log(finalHeaders);
    console.log("FINAL RequestBody");
    console.log(finalRequestBody);

    const allowedMethodsForBody = ["POST", "PUT", "PATCH"]; 
    const fetchOptions = {
      method: api.method,
      headers: {
        ...finalHeaders,
      },
    };
    // Check if the current API method allows a body
    if (allowedMethodsForBody.includes(api.method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(finalRequestBody);
    }

    console.log("FETCHOPTIONS");
    console.log(fetchOptions);
    
    const fetchResponse = await fetch(process.env.REACT_APP_CENTRAL_BACK + "/relay", fetchOptions);
      
    const responseData = await fetchResponse.json();
    setResponse(JSON.stringify(responseData, null, 2));

    const resultWithStatus = {
      status: fetchResponse.status,
      resultBody: responseData
    };

    // save result for eventual workflow use
    const user = JSON.parse(localStorage.getItem("user"));
    const endpoint = `${process.env.REACT_APP_CENTRAL_BACK}/api/registerapiresult`;

    const myresultPayload = {
      result: {...resultWithStatus},
      clientNr: clientNr,
      explorerId: explorerId,
      name: apiName,
      email: user.email,
      chatbotKey: user.chatbotKey,
    }
    try
      {
      await axios.post(endpoint, encodebody(myresultPayload));
      }
  catch(error)
      {
          console.log("An error occured when saving result", error);
      }

  return resultWithStatus;

   
    // return JSON.stringify(responseData, null, 2); // Return the response data
  } catch (error) {
    console.error('Error during API execution:', error);
    setResponse(JSON.stringify(error, null, 2));
    throw error; // Throw the error to be caught in the catch block outside the fetch
  }
};

  return (
    <div className="container">
      <div className = "left-top-buttons-productview">
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="restore-button" onClick={handleRestoreDefault}>Restore Default</button>
        <a href="https://wiki.gwocu.com/en/GWOCU-Studio/curl-execution" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>
      </div>
      <div className="page">
        <div className="curl-panel">
          <form id="form" onSubmit={handleSubmit}>
            <div className="input-fields">
              <div>1  // API EXPLORER. NOTE, FIELDS ARE EDITABLE!!</div>
              <div>3  //</div>
              <div>4  // Api Name: {api.name}.</div>
              <div>4  // {api.description}.</div>
              <div>5  //</div>
              <div>6  curl -X {api.method}</div>
              <div>
              <textarea
                title={`Curl`}
                className="myroute"
                name="route"
                value={route}
                onChange={(e) => handleRouteChange(e.target.value)}
                rows = "auto"
              />  
              
              </div>
              <div>
               {api.headers && api.headers.map((header) => `-H "${header}"`).join(' ')} -d {' '}
              </div>
              
              <div>{`{`}</div>

              {api.requestBody &&
                Object.keys(api.requestBody).map((field, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <label style={{ marginRight: '8px' }}>{`"${field}": `}</label>
                    <textarea
                      title={`The ${field} is a...`}
                      className="mycurlinput"
                      name={field}
                      rows={isObject(requestBodyFields[field]) ? 5 : 1} // Set rows to a higher value only if it's an object
                      value={isObject(requestBodyFields[field]) ? JSON.stringify(requestBodyFields[field], null, 2) : requestBodyFields[field]}
                      onChange={(e) => handleRequestBodyChange(field, e.target.value)}
                    />
                  </div>
                ))}
            <div>{`}`}</div>
              
          
            </div>
          </form>
        </div>
      <div className="terminal">
      <ReactTerminal 
      style={{ overflow: 'hidden', height:"100px" }}
      commands={commands} 
      showControlBar = {false}
      themes={{
        "my-custom-theme": {
          themeBGColor: "black",
          themeToolbarColor: "#DBDBDB",
          themeColor: "#03A062",
          themePromptColor: "#03A062"
        }
      }}
      theme="my-custom-theme"
      prompt = '>>'
      welcomeMessage ={
        <div>
          Welcome to the API execution terminal.
          <br />
          Please type in "run" to submit the Curl.
          <br />
        </div>
      }
      />
        </div>
      </div>
    </div>
  );
};


function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
export default ApiTerminal;
