import React from 'react';
import { Motion, spring } from 'react-motion';
import { userInfo } from 'os';

// To-Do:
// 2. Make a basic user registration and basic stuff with it
class User extends React.Component {
  constructor(props, id, password, isAdmin, isBlocked, username) {
    super(props);
    this.id = id;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isBlocked = isBlocked;
    this.username = username;
    this.isLogged = false;
  }
  handleLogin(event) {
    this.setState({
      // how does  one get children's values? document.getDocumentById?
    });
  }
}

function UserLogin(props) {
  return (
    <div className="wrapper">
      <form className="authBox">
        <div className="centerWrapper">
          <div className="title">
          Добро пожаловать!
          </div>
          <div className="subtitle">
          Пожалуйста, авторизуйтесь!
          </div>
          <div className="authBlock">
            <div className="outerIn">
              <h5 className="inHeading">имя пользователя</h5>
              <div className="inputWrapper">
                <input type="text" name="имя пользователя" id="usernameIn" className="inputDefault"/>
              </div>
            </div>
            <div className="outerIn">
              <h5 className="inHeading">пароль</h5>
              <div className="inputWrapper">
                <input type="password" name="пароль" id="passwordIn" className="inputDefault"/>
              </div>
            </div>
            <button className="button">
            <div className="contents">
              Войти
            </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <User />;
  }
  return <UserLogin />;
}

export default class App extends React.Component {
  render() {
    return (<Greeting isLoggedIn={false} />);
  }
}
