

import Explorer from "./pages/explorer/Explorer";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import React, { useState, useEffect } from 'react';
import Login from "./pages/login/Login";
import Updateuser from "./pages/updateuser/Updateuser";
import ApisEditor from './components/apisEditor/ApisEditor';

function App() {
  const { user } = useContext(AuthContext);
  
  var designerMode = false;
 
    if (user && user.groups && Array.isArray(user.groups)) {
      // Check if "apiFnyDesigners" is in the user.groups array
      designerMode = user.groups.includes("apiFnyDesigners");
    } else {
      // If user object doesn't exist or doesn't have groups array, set designerMode to false
      designerMode = false; 
    }
  return (
    <Router>
      <Switch>
        <Route exact path="/">
        {user ? <Explorer 
        clientNr = {user.clientNr}
        explorerId = {"1"}
        designerMode = {designerMode} 
        />
        : <Login />}  
        </Route>
        <Route path="/explorer">
        {user ? <Explorer 
          clientNr = {user.clientNr}
          explorerId = {"1"}
          designerMode = {designerMode}
          />
          : <Login />}
        </Route>
        <Route path="/updateuser">
          <Updateuser />
        </Route>
        <Route path="/apiseditor">
        {user ? <ApisEditor 
          clientNr = {user.clientNr}
          explorerId = {"1"}
          designerMode = {designerMode}
          />
          : <Login />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
