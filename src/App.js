import React, { useState, Suspense, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import PrivateRoute from './components/Misc/PrivateRoute'
import SelectModule from './pages/SelectModule'
import './styles/App.css';
import { modules } from './data/data';
import Loading from './components/Misc/Loading';
import { serverAddress, serverPort } from "./data/data"

const Login = React.lazy(() => import('./pages/Login'));

const getUserData = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const decoded = jwt.decode(token);
    const id = decoded.data.id;
    const userModules = decoded.data.modules.split(',');
    const previliges = decoded.data.previliges.split(',');
    const userMods = modules.filter(module => userModules.find(userModule => userModule === module.text));
    const structureid = decoded.data.structureid;
    const fullName = decoded.data.fullName;
    return {
      modules: userMods, previliges: previliges, userInfo: {
        id,
        structureid,
        fullName
      }
    }
  }
  else
    return {}
}
const App = () => {
  const location = useLocation();
  const history = useHistory();
  const [token, setToken] = useState({ token: localStorage.getItem('token'), userData: getUserData() });
  const logout = () => {
    setToken({ token: '', userData: {} })
    localStorage.removeItem('token');
    // window.location.replace(`${serverAddress}${serverPort}/?from=procurement&action=logout`)
  }
  // localStorage.removeItem("token")
  useEffect(() => {
    if (/from=(.*)/.test(location.search)) {
      if (location.search.match(/from=(.*)&/)[1] === 'warehouse' && location.search.match(/action=(.*)/)[1] === 'login') {
        if (token.token)
          window.location.replace(`${serverAddress}${serverPort}/login?token=${token.token}`)
        else
          history.replace('/login')
      }
      else if (location.search.match(/from=(.*)&/)[1] === 'warehouse' && location.search.match(/action=(.*)/)[1] === 'logout') {
        localStorage.removeItem('token');
        setToken({})
        history.replace('/login')
      }
    }
  }, [location, history, token.token]);

  return (
    <TokenContext.Provider value={[token, setToken, logout]}>
      <Switch>
        <Route path="/login" render={() => !token.token ?
          <Suspense fallback={<Loading />}>
            <Login setToken={setToken} />
          </Suspense>
          : <Redirect to="/" />}>
        </Route>
        <PrivateRoute token={token.token} path="/">
          <SelectModule />
        </PrivateRoute>
      </Switch>
    </TokenContext.Provider>
  );
}
export default App
export const TokenContext = React.createContext();
