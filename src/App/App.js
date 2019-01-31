import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import connection from '../helpers/data/connection';
import authRequests from '../helpers/data/authRequests';
import userRequests from '../helpers/data/userRequests';
import Auth from '../components/Auth/Auth';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import Battle from '../components/Battle/Battle';
import Characters from '../components/Characters/Characters';
import Locations from '../components/Locations/Locations';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (authed === false
    ? (<Component { ...props } />)
    : (<Redirect to={{ pathname: './characters', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (authed === true
    ? (<Component { ...props } { ...rest } />)
    : (<Redirect to={{ pathname: './auth', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authed: false,
    currentUid: '',
    pendingUser: true,
    levelUpToken: 0,
    characterToken: 0,
  }

  componentDidMount() {
    connection();
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const currentUid = authRequests.getCurrentUid();
        this.setState({ authed: true, currentUid, pendingUser: false });
        userRequests.getFirebaseUserId(currentUid).then((firebaseId) => {
          userRequests.getUserObject(firebaseId)
            .then((userObject) => {
              const levelUpToken = userObject.data.levelUpTokens;
              const characterToken = userObject.data.characterTokens;
              this.setState({ levelUpToken, characterToken });
            })
            .catch(error => console.error('error on getUserObject', error));
        }).catch(error => console.error('error on getFirebaseUserId', error));
      } else {
        this.setState({ authed: false, currentUid: '', pendingUser: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  logoutClickEvent = () => {
    authRequests.logoutUser();
    this.setState({ authed: false, currentUid: '' });
  }

  setLevelTokens = (tokenValue) => {
    this.setState({ levelUpToken: tokenValue });
  }

  setCharacterTokens = (tokenValue) => {
    this.setState({ characterToken: tokenValue });
  }


  render() {
    const {
      authed,
      pendingUser,
      levelUpToken,
      characterToken,
    } = this.state;
    if (pendingUser) {
      return null;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <MyNavbar
              isAuthed={authed}
              logoutClickEvent={this.logoutClickEvent}
              levelUpToken={levelUpToken}
              characterToken={characterToken}
            />
            <div className="container">
              <div className="row">
                <Switch>
                  <PrivateRoute path='/characters' component={Characters} authed={authed} setLevelTokens={this.setLevelTokens} />
                  <PrivateRoute path='/locations' component={Locations} authed={authed} setCharacterTokens={this.setCharacterTokens} />
                  <PrivateRoute path='/battle' component={Battle} authed={authed} setCharacterTokens={this.setCharacterTokens} setLevelTokens={this.setLevelTokens} />
                  <PublicRoute path='/auth' component={Auth} authed={authed} />
                </Switch>
              </div>
            </div>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
