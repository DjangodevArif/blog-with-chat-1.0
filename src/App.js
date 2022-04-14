import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import HomePage from "./page/homepage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ChatSocket from './component/Chat';
import { ThemeProvider } from "@material-ui/core/styles";
// import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Login from './page/login';
import { CssBaseline } from '@material-ui/core';
import Context from './utils/context';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ 'unseen_message': {}, 'loder': false, });
  const [user, setUser] = useState()

  return (
    <Context.Provider value={[data, setData, user, setUser]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {/* <Messanger /> */}
          <Switch>
            <Route exact path="/auth/:action" component={Login} />
            {/* {
              wait ?
                <Route path="/" component={HomePage} /> :
                ''
            } */}
            <Route path="/" component={HomePage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Context.Provider>
  );
}

export default App;
