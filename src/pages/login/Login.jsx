import { useState, useContext, useRef, useEffect } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';






export default function Login() {
  const location = useLocation();  // Hook to get the location object
  const isLoginRoute = location.pathname === '/login';
  const params = new URLSearchParams(location.search);  // Instantiate with the current query string

  const clientNrFromQuery = params.get('clientNr');
  const chatbotKeyFromQuery = params.get('chatbotKey');
  const emailFromQuery = params.get('email');


  const [clientNr, setClientNr] = useState(clientNrFromQuery || "");
  const [chatbotKey, setChatbotKey] = useState(chatbotKeyFromQuery || "");
  const [email, setEmail] = useState("");


  
  const [explorers, setExplorers] = useState([]);
  const [gwokenToken, setGwokenToken] = useState("");
  const [gwokenEnabledChecked, setgwokenEnabledChecked] = useState(false);
  const [E2EEEnabledChecked, setE2EEEnabledChecked] = useState(false);
  const [explorerSelect, setExplorerSelect] = useState("");
  
  const [password, setPassword] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext);

  
  
  const defaultGwokuToken = process.env.REACT_APP_GWOKUTOKEN;

  const gwokenEnabledCheckboxChange = (e) => {
    setgwokenEnabledChecked(e.target.checked);
  };

  const E2EEEnabledCheckboxChange = (e) => {
    setE2EEEnabledChecked(e.target.checked);
  };

  const history = useHistory();

  const handleClick = async (e) => {
    console.log("CLICKED");
    e.preventDefault();

    await loginCall(
      {
        clientNr,
        gwokenToken,
        gwokenEnabled: gwokenEnabledChecked,
        E2EEEnabled: E2EEEnabledChecked,
        chatbotKey,
        explorer: explorerSelect,
        email,
        password,
      },
      dispatch
    );

    console.log("ROUTE");
    console.log(isLoginRoute);
    if (isLoginRoute)
    {
      history.push("/");
    }
   
  };


  useEffect(() => {

    const fetchExplorerData = async () => {
      console.log("ENTERED USE EFFECT");
      // Check if all required fields have values before making the API call
      if (clientNr.trim() !== "" && chatbotKey.trim() !== "" && email.trim() !== "") {
        const body = {
          clientNr,
          chatbotKey,
          email,
        };
        console.log("BODY");
        console.log(body);
        try {
          const response = await axios.post(
            process.env.REACT_APP_CENTRAL_BACK + "/users/explorers",
            body
          );
          // Assuming the API response has an array of explorers in the 'data' property
          setExplorers(response.data);
        } catch (error) {
          setExplorers([]);
        }
      }
    };

    fetchExplorerData();
  }, [clientNr, chatbotKey, email]);


  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="loginLogo">GWOCU Studio</div>
          <div className="loginDesc">
            Part of the GWOCU suite of products.
          </div>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
          <input
               placeholder="Client Number"
               required
               value={clientNr}
               onChange={(e) => setClientNr(e.target.value)}
               className="loginInput"
               disabled = {false}
            />
          <input
              placeholder="Gwoku Token"
              required
              
              onChange={(e) => setGwokenToken(e.target.value)}
              className="loginInput"
              type = "password"
              defaultValue={process.env.REACT_APP_GWOKUTOKEN}
              disabled
            />
           
          <input
              placeholder="Chatbot Key"
              required
              value={chatbotKey}
              onChange={(e) => setChatbotKey(e.target.value)}
              className="loginInput"
            />
          <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          <select
          value={explorerSelect} // Set the value attribute to the selected value
          onChange={(e) => setExplorerSelect(e.target.value)}
          className="loginInput"
          >
          <option value="" disabled>
            Select Explorer
          </option>
          {explorers.map((explorer) => (
            <option key={explorer.id} value={explorer.id}>
              {explorer.description}
            </option>
          ))}
        </select>
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            { false && (
            <div style={{ display: "flex", flexDirection: "row" }}> 
            <label className="logincheckboxLabel">
            Gwoken Enabled
              <input
             
              className = "logincheckmark"
              type="checkbox"
              checked={gwokenEnabledChecked}
              onChange={gwokenEnabledCheckboxChange}
              defaultValue={gwokenEnabledChecked}
              />
            </label>
            <label className="logincheckboxLabel">
            E2EE Enabled
              <input
              className = "logincheckmark"
              type="checkbox"
              checked={E2EEEnabledChecked}
              onChange={E2EEEnabledCheckboxChange}
              defaultValue={E2EEEnabledChecked}
              />
              
            </label>
            </div>
            )}
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
          </form>
        </div>
      </div>
    </div>
  );
}
