

import Explorer from "./pages/explorer/Explorer";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from 'axios';
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import React, { useState, useEffect } from 'react';
import Login from "./pages/login/Login";
import Updateuser from "./pages/updateuser/Updateuser";
import ApisEditor from './components/apisEditor/ApisEditor';

function App() {
  const { user } = useContext(AuthContext);
  const [authorization, setAuthorization] = useState({ name: "1", designer: false, owner: false, reader: false });
  console.log("IN APP");
  useEffect(() => {
    console.log("ENTERING USE EFFECT");
    const getUserAuthorization = async () => {
      if (!user) {
        // No user is logged in, so skip making any axios calls
        // setAuthorization({name: "1", designer: false, owner: false, reader: false});
        return;
      }

      try {
        const userPayload = {
          clientNr: user.clientNr,
          chatbotKey: user.chatbotKey,
          email: user.email,
        };
        console.log("Just before calling user query");
        const res = await axios.post(`${process.env.REACT_APP_CENTRAL_BACK}/users/query`, userPayload);
        console.log("Just after calling user query");
        console.log(res.data);
        const currentAuth = res.data.explorers.find(explorer => explorer.name === user.explorerId);
        //const currentAuth = res.data.explorers[user.explorerId]
        setAuthorization(currentAuth);
        // Assuming the response might affect authorization somehow
        // Process response if necessary, e.g., res.data

        
      } catch (error) {
        console.error('Failed to fetch authorization:', error);
        // setAuthorization({name: "1", designer: false, owner: false, reader: false});
      }
    };

    getUserAuthorization();
  }, [user]); 

  return (
    <Router>
      <Switch>
        <Route exact path="/">
        {user ? <Explorer 
        clientNr = {user.clientNr}
        explorerId = {user.explorerId || "1"} 
        authorization = {authorization}    
        />
        : <Login />}  
        </Route>
        <Route path="/explorer">
        {user ? <Explorer 
          clientNr = {user.clientNr}
          explorerId = {user.explorerId || "1"}
          authorization = {authorization}
          />
          : <Login />}
        </Route>
        <Route path="/updateuser">
          <Updateuser />
        </Route>
        <Route path="/apiseditor">
        {user ? <ApisEditor 
          clientNr = {user.clientNr}
          explorerId = {user.explorerId || "1"}
          authorization = {authorization}
          />
          : <Login />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
