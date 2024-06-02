const crypto = require('crypto-js');
const forge = require('node-forge');
import yaml from 'js-yaml';
import axios from 'axios';

export function HeadersGlobalAdd(apiHeaders, yamlObject) {
  const globalParameters = yamlObject['Global-Parameters-Header'];

  if (!globalParameters || (globalParameters.enable ==='no') || !globalParameters.parameters || Object.keys(globalParameters.parameters).length === 0) {
    // No parameters specified, return the original apiHeaders
    return apiHeaders;
  }

  if (globalParameters.overwrite && globalParameters.overwrite.toLowerCase() === 'yes') {
    // Overwrite specified parameters in apiHeaders
    for (const param in globalParameters.parameters) {
      if (apiHeaders.hasOwnProperty(param)) {
        apiHeaders[param] = globalParameters.parameters[param];
      }
    }
  }

  // Add missing parameters to apiHeaders
  for (const param in globalParameters.parameters) {
    if (!apiHeaders.hasOwnProperty(param)) {
      apiHeaders[param] = globalParameters.parameters[param];
    }
  }

  return apiHeaders;
}

function calculateBasicAuth(username, password) {
  const credentials = `${username}:${password}`;
  console.log("CREDENTIALS SPECIAL");
  console.log(credentials);
  const encodedCredentials = btoa(credentials);

  return `Basic ${encodedCredentials}`;
}

export function addAuthToHeaders(myheadersWithGlobals,yamlObject )
  {
    const authenticationType =  yamlObject['Authentication-Type'];

    switch (authenticationType) {
      case "No-Authentication":
        return myheadersWithGlobals;
      case "Digital-Signature":
        return myheadersWithGlobals;
      case "Basic-Authentication":
         // get properties for the basic authentication
         const basicAuthentication = yamlObject['Basic-Authentication'] ;
         if (basicAuthentication.overwrite == "yes")
         {
          const param = "Authorization"
          myheadersWithGlobals[param] = calculateBasicAuth( basicAuthentication.username, basicAuthentication.password);
          return myheadersWithGlobals
        }
         else
          {return myheadersWithGlobals;}
      case "ApiKey":
        return myheadersWithGlobals;
      default:
        return myheadersWithGlobals;
    }
  }

  export function addAuthToRequestBody(myRequestBodyWithGlobals,yamlObject )
  {
    const authenticationType =  yamlObject['Authentication-Type'];

    switch (authenticationType) {
      case "No-Authentication":
        return myRequestBodyWithGlobals;
      case "Digital-Signature":
        // get properties for the digital signature
        const DigitalSignature = yamlObject['Digital-Signature'] ;
        // parameters and result of the function
        const token = DigitalSignature.token ;

        const functionString = DigitalSignature.calculationFunction
        const parameterName = DigitalSignature.parameterName
        // remove the destination and signature parameter from the body if it is present 
        console.log("PARAMETER NAME");
        console.log(parameterName); 
        console.log("BODY BEFORE DELETE OF SIGNATURE");
        console.log(myRequestBodyWithGlobals);

        delete myRequestBodyWithGlobals["destination"] ;
        delete myRequestBodyWithGlobals[parameterName] ;
        
        console.log("BODY AFTER DELETE OF SIGNATURE");
        console.log(myRequestBodyWithGlobals);

        
        const calculationFunction = new Function("token, parameters,crypto",functionString);
        const mydigitalSignature = calculationFunction(token,myRequestBodyWithGlobals,crypto);
        console.log("DIGITAL SIGNATURE");
        console.log(mydigitalSignature);
        myRequestBodyWithGlobals[parameterName] = mydigitalSignature ;
        return myRequestBodyWithGlobals;
      case "Basic-Authentication":
        return myRequestBodyWithGlobals;
      case "ApiKey":
        return myRequestBodyWithGlobals;
      default:
        return myRequestBodyWithGlobals;
    }
  }

  function isFunctionParam(inputString) {
    // Check if the inputString contains the word "function"
    return inputString.includes("{");
}

  export function requestBodyGlobalAdd (apiRequestBody, yamlObject) {
    const globalParameters = yamlObject['Global-Parameters-RequestBody'];
  
    if (!globalParameters || (globalParameters.enable ==='no') || !globalParameters.parameters || Object.keys(globalParameters.parameters).length === 0) {
      // No parameters specified, return the original apiHeaders
      return apiRequestBody;
    }
  
    if (globalParameters.overwrite && globalParameters.overwrite.toLowerCase() === 'yes') {
      // Overwrite specified parameters in api Request Body
      for (const param in globalParameters.parameters) {
        if (apiRequestBody.hasOwnProperty(param)) {
          // first check if it is a function or regular value parameter
          const paramValue = globalParameters.parameters[param];


          if (isFunctionParam(String(paramValue)))
          {
              // it is a function. Calll the function to return the value
              console.log ("function found")
              console.log(String(paramValue));
              const functionString = String(paramValue);
              const calculationFunction = new Function(functionString);
              const myparamvalue = calculationFunction();
              console.log("FUNCTION VALUE");
              console.log(myparamvalue);
              apiRequestBody[param] = myparamvalue;
          }
          else
          {
            //not a function. use value
            apiRequestBody[param] = globalParameters.parameters[param];
          }
            
        }
      }
    }
  
    // Add missing parameters to body
    for (const param in globalParameters.parameters) {
      if (!apiRequestBody.hasOwnProperty(param) && (globalParameters.addIfMissing?.toLowerCase() ?? 'no') === 'yes')

      {
        const paramValue = globalParameters.parameters[param];
        if (isFunctionParam(String(paramValue)))
        {
            // it is a function. Calll the function to return the value
            console.log ("function found")
            console.log(String(paramValue));
            const functionString = String(paramValue);
            const calculationFunction = new Function(functionString);
            const myparamvalue = calculationFunction();
            console.log("FUNCTION VALUE");
            console.log(myparamvalue);
            apiRequestBody[param] = myparamvalue;
        }
        else
        {
          //not a function. use value
          apiRequestBody[param] = globalParameters.parameters[param];
        }

      }
    }
  
    return apiRequestBody;
  }

  export function parseApiHeaders(api) {
    return api.headers.reduce((acc, header) => {
      const [key, value] = header.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
  }

  export async function getConfiguration(explorerObject, thirdPartyName) {
    if (thirdPartyName) {
      const myPayload = {
        clientNr: explorerObject.clientNr,
        name: thirdPartyName
      };
      console.log("MY THIRD PARTY PAYLOAD");
      console.log(myPayload);
  
      try {
        const myThirdPartyResponse = await axios({
          method: 'post',
          url: process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/query',
          data: myPayload
        });
  
        const thirdParty = myThirdPartyResponse.data;
        if (thirdParty.yaml) {
          return yaml.load(thirdParty.yaml);
        }
      } catch (error) {
        console.error("Axios call failed:", error);
        // If the axios call fails, the catch block catches the error and the function will return this:
        return yaml.load(explorerObject.yaml);
      }
    }
    // This return statement will execute if thirdPartyName is falsy
    return yaml.load(explorerObject.yaml);
  }
  

  export function isValidConfiguration(explorerObject) {
    try {
      // Try to parse the YAML string
      yaml.load(explorerObject.yaml);
      // If parsing succeeds, return true
      return true;
    } 
    catch (error) {
      // If an error occurs during parsing, return false
      return false;
    }
  };

  export async function makeCurlComponentFromApi(explorer, workflowName,taskId, api) 
  {
    // Construct the curl statement
    const yamlObject = await getConfiguration(explorer, api.thirdparty)
    

    const apiHeaders = parseApiHeaders(api);
    const Globalheaders = HeadersGlobalAdd(apiHeaders, yamlObject);
    var headers = addAuthToHeaders(Globalheaders,yamlObject);

    var user = JSON.parse(localStorage.getItem("user"));
    var endpoint;

    try 
      {
        const myLinkParamPayload =
        {
          clientNr: explorer.clientNr,
          explorerId: explorer.explorerId,
          workflowName: workflowName,
          taskId: taskId,
          chatbotKey: user.chatbotKey,
          email:user.email,
          baseUrl: api.resourcePath ? api.resourcePath : ""
        }
        console.log("MYLINK PARAM PAYLOAD", myLinkParamPayload );
        const myLinkParamResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/querylinkparameters", myLinkParamPayload);
        var myParams = await myLinkParamResponse.data;
        var activeLinks = false;
        if (myParams.activeLinks)
        {
          endpoint = myParams.path;
          activeLinks = true ;
        }
        else
        {
          endpoint = api.urlRoute;
          activeLinks = false;
        }

      }
      catch(error)
      {
        endpoint = api.urlRoute
        activeLinks = false;
      }
      
      var initialRequestBodyFields
      if (activeLinks)
      {
        initialRequestBodyFields = {...myParams.requestBody} ;
      }
      else
      {
        initialRequestBodyFields = { ...api.requestBody };
      }

  const globalRequestBody = requestBodyGlobalAdd(initialRequestBodyFields,yamlObject );
  const requestBody = addAuthToRequestBody(globalRequestBody,yamlObject);

  const apiType = api.method;

  let stringifiedHeaders = headers ? JSON.stringify(headers).replace(/"/g, "'") : {};
  let stringifiedRequestBody = requestBody ? JSON.stringify(requestBody).replace(/"/g, "'") : {};

    const curlStatement = `curl -X ${apiType.toUpperCase()} ${endpoint} -H '${stringifiedHeaders}' -d '${stringifiedRequestBody}'`;
    console.log("CURL COMPONENT C");
    console.log(curlStatement);
    return curlStatement;
  };

  export async function makeCurlComponentFromApiExecutionResult(explorer, workflowName,taskId, api) 
  {
    // Construct the curl statement
    const yamlObject = await  getConfiguration(explorer, api.thirdparty)
    

    const apiHeaders = parseApiHeaders(api);
    const Globalheaders = HeadersGlobalAdd(apiHeaders, yamlObject);
    var headers = addAuthToHeaders(Globalheaders,yamlObject);

    var user = JSON.parse(localStorage.getItem("user"));  
    var endpoint;

    try 
      {
        const myLinkParamPayload =
        {
          clientNr: explorer.clientNr,
          explorerId: explorer.explorerId,
          workflowName: workflowName,
          taskId: taskId,
          chatbotKey: user.chatbotKey,
          email:user.email,
          baseUrl: api.resourcePath ? api.resourcePath : ""
        }
        console.log(" 2. MYLINK PARAM PAYLOAD", myLinkParamPayload );
        const myLinkParamResponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/link/querylinkparameters", myLinkParamPayload);
        var myParams = await myLinkParamResponse.data;
        var activeLinks = false;
        if (myParams.activeLinks)
        {
          endpoint = myParams.path;
          activeLinks = true ;
        }
        else
        {
          endpoint = api.urlRoute;
          activeLinks = false;
        }

      }
      catch(error)
      {
        endpoint = api.urlRoute
        activeLinks = false;
      }
      
      var initialRequestBodyFields
      if (activeLinks)
      {
        initialRequestBodyFields = {...myParams.requestBody} ;
      }
      else
      {
        initialRequestBodyFields = { ...api.requestBody };
      }


    const globalRequestBody = requestBodyGlobalAdd(initialRequestBodyFields,yamlObject );
    const requestBody = addAuthToRequestBody(globalRequestBody,yamlObject);
    headers["destination"] = endpoint;

  
    const allowedMethodsForBody = ["POST", "PUT", "PATCH"]; 
    const fetchOptions = {
      method: api.method,
      headers: {
        ...headers,
      },
    };
    // Check if the current API method allows a body
    if (allowedMethodsForBody.includes(api.method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(requestBody);
    }

    console.log("FETCHOPTIONS");
    console.log(fetchOptions);
    
    const fetchResponse = await fetch(process.env.REACT_APP_CENTRAL_BACK + "/relay", fetchOptions);
      
    const responseData = await fetchResponse.json();
   

    const resultWithStatus = {
      status: fetchResponse.status,
      resultBody: responseData
    };

    console.log("RESULT WITH STATUS", resultWithStatus );

    // save result for eventual workflow use
    const resultEndpoint = `${process.env.REACT_APP_CENTRAL_BACK}/api/registerapiresult`;

    const myresultPayload = {
      result: {...resultWithStatus},
      clientNr: explorer.clientNr,
      explorerId: explorer.explorerId,
      name: api.name,
      email: user.email,
      chatbotKey: user.chatbotKey,
    }

    console.log("MY RESULT PAYLOAD", myresultPayload );
    try
      {
      await axios.post(resultEndpoint, myresultPayload);
      }
  catch(error)
      {
          console.log("An error occured when saving result", error);
      }
  
    return resultWithStatus
  };

  export function isObject(value)
  {
    return value !== null && typeof value === 'object';
  };

  
  