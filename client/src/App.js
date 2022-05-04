import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import UserPage from './components/UserPage';
import NewPassword from './components/NewPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path={"/"} component={Login} />
          <Route exact path={"/register"} component={Register} />
          <Route exact path={"/userpage"} component={UserPage} />
          <Route exact path={"/newpassword"} component={NewPassword} />
          <Route exact path={"/reset-password/:username/:token"} component={ResetPassword} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
