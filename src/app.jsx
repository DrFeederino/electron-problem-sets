import React from 'react';
import { Motion, spring } from 'react-motion';

// To-Do:
// 2. Make a basic user registration and basic stuff with it

class User {
  constructor(id, username, password, isAdmin, isBlocked) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isBlocked = isBlocked;
  }
}

var users = [ new User("admin", "admin", "admin", true, false)];

class UserHandler extends React.Component {
  handleLogin(event) {
    users.push(new User(event.name, event.name, "123", false, false))
    console.Write(users);
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
            <div className="contents" onClick={this.handleLogin}>
              Войти
            </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function UserLogged(props) {
  const userProps = User(props);
  if (userProps.isBlocked) {
    return (
      <div className="wrapper">
        <div className="centerWrapper">
          <div className="title">
          Уважаемый, {this.userProps.username}!
          </div>
          <div className="subtitle">
          Сожалеем, но вы были заблокированы администратором!
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <div className="userWrapper">
        <h4>
          Добро Пожаловать,
        </h4>
        <h5>
          {this.userProps.username}
        </h5>
        <button className="button">
          <div className="contents">
            Сменить пароль
          </div>
        </button>
        <button className="button">
          <div className="contents">
            Выйти
          </div>
        </button>
      </div>
    </div>
  );
}

function Greeting(props) {
  if (users.length > 1) {
    return <UserLogged userProps={this.props} />;
  }
  return <UserLogin />;
}

export default class App extends React.Component {
  render() {
    return (<Greeting />);
  }
}
