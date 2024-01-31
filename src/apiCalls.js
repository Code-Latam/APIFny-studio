import axios from "axios";
import {encodebody, getDecodedBody} from "./utils/utils.js";

export const loginCall = async (userCredential, dispatch) => {

  dispatch({ type: "LOGIN_START" });
  try {

    
   
    const clientPayload = {
      clientNr: userCredential.clientNr,
      secretKey: process.env.REACT_APP_SECRET_KEY
    }
    console.log("test 0");
    const clientRes = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/clients/query",clientPayload );
    console.log("test 1");
    const client = clientRes.data;
    const gwocuSettingsString = JSON.stringify(client);
    localStorage.setItem('gwocu-setting', gwocuSettingsString);
    console.log("gwocuSettingsString")
    console.log(gwocuSettingsString)

    
    const myUserPayload = {
      clientNr: userCredential.clientNr,
      chatbotKey: userCredential.chatbotKey,
      email: userCredential.email,
      password: userCredential.password,
      explorer: userCredential.explorer,
      appname: "APIFNY"
    }
   
    const userPayload = encodebody(myUserPayload);
    console.log("MYUSERPAYLOAD");
    console.log("userPayload");
    const res = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/auth/login", userPayload);
  


    const mypayload = {
      clientNr: userCredential.clientNr,
      ...getDecodedBody(res.data)
    }
    dispatch({ type: "LOGIN_SUCCESS", payload: mypayload });
  } catch (err) {
    alert("login failed for unknown reasons")
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

