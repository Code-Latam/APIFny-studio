import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, IconButton, Typography } from '@mui/material';
import { AddBox, Delete } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import './apidetails.css'; // Import your CSS file here
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import { ReactTerminal } from "react-terminal";
import ReactJson from 'react-json-view';

import {HeadersGlobalAdd, requestBodyGlobalAdd, addAuthToHeaders, addAuthToRequestBody, parseApiHeaders, getConfiguration, isValidConfiguration, isObject} from "../../utils/api-spec-util.js";


function APIDetails({ clientNr, explorerId, api }) {

// set the theme for the MUI

console.log("IN APIDETAILS");
console.log(api.requestBodyType);

const theme = createTheme({
    components: {
           
    MuiTabs: { // Targeting the Tabs component
        styleOverrides: {
            indicator: { // Targeting the indicator of the Tabs
            backgroundColor: 'green', // Set your desired color for the active tab indicator
            },
        },
        },
      MuiTab: { // Targeting the Tab component
        styleOverrides: {
          root: { // Targeting the root style of the Tab
            // Style for the inactive tab
            color: 'blue', // Set your desired color for inactive tabs
            '&.Mui-selected': { // Targeting the selected (active) tab
              color: '#03A062', // Set your desired color for the active tab
            },
            '&:hover': { // Optional: change the color when hovering (for both active and inactive)
              color: '#03A062', // Set your desired hover color
            },
          },
        },
      },
      // Continue with your existing customizations...
      MuiInputLabel: { // Existing customizations for InputLabel
        styleOverrides: {
          root: {
            color: '#03A062',
            transform: 'translate(0px, -20px) scale(1)',
          },
        },
      },
      MuiOutlinedInput: { // Existing customizations for OutlinedInput
        styleOverrides: {
          root: {
            backgroundColor: '#3A3B3C',
            height: '25px',
            margin: '4px 0',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'green',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'lightgreen',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'limegreen',
            },
          },
          input: {
            color: '#03A062',
            height: '100%',
            padding: '18px 14px',
          },
        },
      },
    },
  });
  

  const [value, setValue] = useState(0);
  const [apiData, setApiData] = useState(api);
  const [headers, setHeaders] = useState([]);
  const [explorer, setExplorer] = useState([]);
  const [selectedThirdParty, setSelectedThirdParty] = useState("none");
  const [thirdparties, setThirdparties] = useState([]);

  async function  fetchExplorer()
  {
    const myExplorerbody = 
    {
      clientNr: clientNr,
      explorerId: explorerId
    }
    const Eresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/explorer/query", myExplorerbody);
    const myExplorer = await Eresponse.data;
    setExplorer(myExplorer);
  }

  const fetchThirdParties = async () => {
    const myBody = {
      clientNr: clientNr,
    }
    try {
      const thirdpartiesresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/thirdparties/queryall", myBody);
      const myEmptyThirdParty = { name: "none"}
      const mythirdparties = thirdpartiesresponse.data;
      mythirdparties.unshift(myEmptyThirdParty);;
      setThirdparties(mythirdparties);  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Parse headers from string to object format for editing
    if (api.headers) {
      setHeaders(api.headers.map(header => {
        const [headerName, value] = header.split(': ');
        return { headerName, value };
      }));
    }

    fetchExplorer() ;
    fetchThirdParties();

  }, [api.headers]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleApiDataChange = (field, value) => {
    setApiData({ ...apiData, [field]: value });
  };

  const handleRequestBodyChange = (data) => {
    if (data.jsObject) {
      setApiData({ ...apiData, ["requestBody"]: data.jsObject });  
    }
  };

  const handleParametersDescriptionChange = (data) => {
    if (data.jsObject) {
      setApiData({ ...apiData, ["parametersDescription"]: data.jsObject });  
    }
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { headerName: '', value: '' }]);
  };

  const deleteHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const updateApi = async () => {
    // Convert headers back to the string format expected by the backend
    const headersAsStringArray = headers.map(({ headerName, value }) => `${headerName}: ${value}`);
    const updatedApi = { ...apiData, headers: headersAsStringArray };

    // Update API logic using Axios
    try {
    console.log("API VALUE");
    console.log(updatedApi);  
    const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/update', updatedApi); // Change '/api/update' to your actual API endpoint
    alert("Api was succesfully updated!")
    // setApiData(response.data);
    console.log("RESPONSE VALUE");
    console.log(response.data);
    } catch (error) {
      console.error('Error updating API:', error);
    }
  };


  useEffect(() => {
    setApiData(api);
    setHeaders(api.headers.map(header => ({ headerName: header.split(':')[0], value: header.split(':')[1] })) || []);
  }, [api]);


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
          <ReactJson src={jsonResponse} theme="apathy" />
        );
      } catch (error) {
        console.error('Error during API execution:', error);
        return <div style={{ color: '#006400' }}> {'An error occurred during API execution'}</div>;
      }
    },
  };



  const handleSubmit = async (e) => {
    try {
    // setResponse(''); 
    // get the YAML configuration of ApiFny for this explorer 
    if (!isValidConfiguration(explorer ))
    {
      alert("The APIFny configuration file is not a valid yaml file.");
      return;
    }
    const yamlObject = await getConfiguration(explorer,apiData.thirdparty)
    //build the headers as found in the API dynamically
    const apiHeaders = parseApiHeaders(apiData);
    // add or replace the global parameters (found in the config) to the headers
    const myheadersWithGlobals = HeadersGlobalAdd(apiHeaders,yamlObject )
    // add or replace the global parameters (found in the config) to the request body
    const myRequestBodyWithGlobals = requestBodyGlobalAdd( apiData.requestBody,yamlObject)
    
    const finalHeaders = addAuthToHeaders(myheadersWithGlobals,yamlObject );
    console.log("FINAL HEADERS");
    console.log(finalHeaders);
    const finalRequestBody = addAuthToRequestBody(myRequestBodyWithGlobals,yamlObject,crypto);
    // we are using the relay function of our backen to get to the clients API so:

    finalHeaders["destination"] = apiData.urlRoute;

    //  Determine the three mayor parameters of API call based on the authentication case

    console.log("FINAl HEADERS");
    console.log(finalHeaders);
    console.log("FINAL RequestBody");
    console.log(finalRequestBody);

    const allowedMethodsForBody = ["POST", "PUT", "PATCH"]; 
    const fetchOptions = {
      method: apiData.method,
      headers: {
        ...finalHeaders,
      },
    };
    // Check if the current API method allows a body
    if (allowedMethodsForBody.includes(apiData.method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(finalRequestBody);
    }
    
    const fetchResponse = await fetch(process.env.REACT_APP_CENTRAL_BACK + "/relay", fetchOptions);
      
    const responseData = await fetchResponse.json();
    // setResponse(JSON.stringify(responseData, null, 2));
    return responseData; 
    // return JSON.stringify(responseData, null, 2); // Return the response data
  } catch (error) {
    console.error('Error during API execution:', error);
    throw error; // Throw the error to be caught in the catch block outside the fetch
  }
};

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="API Tabs">
        <Tab label="Api Basic Information" />
        <Tab label="Advanced Settings" />
        <Tab label="Response" />
      </Tabs>
      <TabPanel value={value} index={0}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
          <Button onClick={updateApi} variant="contained" color="primary" sx={{ mr: 1 }}>Save</Button>
        </Box>
        <TextField
         InputProps={{
            readOnly: true, // This makes the TextField non-editable without the disabled appearance.
          }}
         label="API Name" 
         value={apiData.name} 
         variant="outlined" 
         fullWidth 
         margin="normal" 
         onChange={(e) => handleApiDataChange('name', e.target.value)} />
        
        <label className = "thirdParty" htmlFor="thirdparty">Third Party</label>
              <select
                id="thirdparty"
                value={apiData.thirdparty} 
                className="thirdPartyViewType"
                onChange={(e) => handleApiDataChange('thirdparty', e.target.value)}
              >
                {thirdparties.map((thirdparty) => (
                  <option key={thirdparty.name} value={thirdparty.name}>
                    {thirdparty.name}
                  </option>
                ))}
              </select> 
              <div></div>
        
        <FormControl  margin="normal">
          <InputLabel id="method-select-label">Method</InputLabel>
          <Select 
          labelId="method-select-label" 
          value={apiData.method} 
          label="Method" 
          onChange={(e) => handleApiDataChange('method', e.target.value)}
          style={{ color: 'green' }}
          >
            {['POST', 'GET', 'PUT', 'DELETE','HEAD','OPTIONS'].map((method) => (
              <MenuItem key={method} value={method}>{method}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="URL Route Example" value={apiData.urlRoute} variant="outlined" fullWidth margin="normal" onChange={(e) => handleApiDataChange('urlRoute', e.target.value)} />
        <TextField label="Resource Path" value={apiData.resourcePath ? apiData.resourcePath : ""} variant="outlined" fullWidth margin="normal" onChange={(e) => handleApiDataChange('resourcePath', e.target.value)} />
        <br></br>
        <label className = "apidescription" >Description:
         </label>
        <textarea
        className = "apitextarea"
        value={apiData.description} 
        variant="outlined" 
        rows={8} 
        onChange={(e) => handleApiDataChange('description', e.target.value)} 
        />
        <Typography variant="h6" sx={{ mt: 1, color: '#03A062' }}>Headers</Typography>
        {headers.map((header, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              
              value={header.headerName}
              onChange={(e) => handleHeaderChange(index, 'headerName', e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              value={header.value}
              onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
            />
           <IconButton onClick={() => deleteHeader(index)} sx={{ ml: 1 }}>
            <Delete sx={{ color: 'green' }} />
            </IconButton>
          </Box>
        ))}
        <Button onClick={addHeader} startIcon={<AddBox />} sx={{ mt: 1 }}>
          New Header
        </Button>
        
      </TabPanel>
      <TabPanel value={value} index={1}>

        <label className = "requestbodylabel" >Request Body:</label>

        <JSONInput
        id='json-editor'
        placeholder={apiData.requestBody} // data to display
        locale={locale}
        height='300px'
        onChange={handleRequestBodyChange}
        />
        
        <FormControl className="formControlWidth" margin="normal">
          <InputLabel id="requestBodyType-select-label">Request Body Type</InputLabel>
          <Select  
          labelId="requestBodyType-select-label" 
          value={(apiData.requestBodyType?.toUpperCase() || 'JSON')}
          label="Request Body Type"
          onChange={(e) => handleApiDataChange('requestBodyType', e.target.value)}>
            {['JSON', 'RAW'].map((type) => (
              <MenuItem style={{ color: 'green' }} key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="formControlWidth" margin="normal">
          <InputLabel id="responseBodyType-select-label">Response Body Type</InputLabel>
          <Select labelId="responseBodyType-select-label" 
            value={(apiData.responseBodyType?.toUpperCase() || 'JSON')}
            label="Response Body Type" 
            onChange={(e) => handleApiDataChange('responseBodyType', e.target.value)}>
            {['JSON', 'RAW'].map((type) => (
              <MenuItem  style={{ color: 'green' }} key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <label className = "requestbodylabel" >Parameters Descriptions:</label>

        <JSONInput
        id='json-editor2'
        placeholder={apiData.parametersDescription} // data to display
        locale={locale}
        height='300px'
        onChange={handleParametersDescriptionChange}
        />        
      </TabPanel>

      <TabPanel value={value} index={2}>
      <div className="terminal">
      <ReactTerminal 
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
          Welcome to the ApiFny API execution terminal.
          <br />
          Please type in "run" to submit the API Request. Type "clear" to clear the terminal.
          <br />
        </div>
      }
      />
        </div>
            
      </TabPanel>


    </Box>
    </ThemeProvider>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default APIDetails;

