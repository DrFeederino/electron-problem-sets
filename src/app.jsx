import React from 'react';
import { Motion, spring } from 'react-motion';

// To-Do:
// 2. Make a basic user registration and basic stuff with it

class User {
  constructor(id, username, password, isBlocked) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.isBlocked = isBlocked;
  }
}

class UserApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [new User(1, 'admin', 'admin', false), new User(2, 'user', 'user', false)],
      username: '',
      password: '',
      isLogged: false,
      user: undefined,
      text: 'Пожалуйста, авторизуйтесь!',
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAdding = this.handleAdding.bind(this);
    this.handleBlocking = this.handleBlocking.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    if (!this.state.username.length && !this.state.password) {
      return;
    }
    this.setState({
      username: this.state.username,
      password: this.state.password,
      //user: new User(users.length + 1, this.state.username, this.state.password), for admin only
    });
    this.state.users.forEach((user) => {
      if (this.state.username == user.username) {
        if (this.state.password == user.password)
          this.setState({
            isLogged: !this.state.isLogged,
            user: new User(this.state.users.length + 1, user.username, user.password, user.isAdmin, user.isBlocked), // Don't know why it doesn't copy user
            username: '',
            password: '',
          });
        this.setState({
          text: 'Вы ввели неверный пароль.',
        });
      }
      this.setState({
        text: 'Пользователь в системе не найден.',
      });
    });
  }

  handleUsername(e) {
    this.setState({ username: e.target.value });
  }

  handlePassword(e) {
    this.setState({ password: e.target.value }); // add filter and number of tries support
  }

  handleBlocking() {
    this.setState({
      //users: this.state.user.isBlocked,
    });
  }

  handleLogout() {
    this.setState({
      isLogged: false,
      user: undefined,
      text: 'Пожалуйста, авторизуйтесь',
    });
  }

  checkUser() {
    // to do
  }

  handleAdding(e) {
    checkUser(); // will check if user is not "there"
    this.setState({
      users: this.state.users.push(this.state.user),
    });
  }

  render() {
    // Render Logged in form for Admin and usual people
    if (!this.state.isLogged) {
      return (
        <div className="wrapper">
        <form className="authBox" onSubmit={this.handleLogin}>
          <div className="centerWrapper">
            <div className="title">
            Добро пожаловать!
            </div>
            <div className="subtitle">
              {this.state.text}
            </div>
            <div className="authBlock">
              <div className="outerIn">
                <h5 className="inHeading">имя пользователя</h5>
                <div className="inputWrapper">
                  <input
                    type="text"
                    name="имя пользователя"
                    id="usernameIn"
                    className="inputDefault"
                    onChange={this.handleUsername}
                    value={this.state.username}
                  />
                </div>
              </div>
              <div className="outerIn">
                <h5 className="inHeading">пароль</h5>
                <div className="inputWrapper">
                  <input
                    type="password"
                    name="пароль"
                    id="passwordIn"
                    className="inputDefault"
                    onChange={this.handlePassword}
                    value={this.state.password}
                  />
                </div>
              </div>
              <button className="button">
                <div
                  className="contents"
                >
                  Войти
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
      );
    }
    if (this.state.user.isBlocked) {
      return (
        <div className="wrapper">
          <div className="centerWrapper">
            <div className="title">
            Уважаемый, {this.state.username}!
            </div>
            <div className="subtitle">
            Сожалеем, но вы были заблокированы администратором!
            </div>
          </div>
        </div>
      );
    }
    if (this.state.user.username !== 'admin') {
      return (
        <div className="wrapper">
          <div className="userWrapper">
            <h4>
              Добро Пожаловать,
            </h4>
            <h5>
              {this.state.username}
            </h5>
            <button className="button">
              <div className="contents">
                Сменить пароль
              </div>
            </button>
            <button className="button" onClick={this.handleLogout} >
              <div className="contents">
                Выйти
              </div>
            </button>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="wrapper">
          <div className="userWrapper">
            <h4>
              Добро Пожаловать,
            </h4>
            <h5>
              {this.state.username}
            </h5>
            <div>
              {this.state.users.map(user => (
                <div 
                  className="gridRow"
                  key={user.id}
                >
                  {user.id}. {user.username} | {user.isBlocked ? '✓' : 'x'}
                  <input type="checkbox" checked={this.state.user.isBlocked} onChange={this.handleBlocking} />
                </div>
              ))}
            </div>
            <div className="addFields">
              <div className="outerIn">
                  <h5 className="inHeading">имя пользователя</h5>
                  <div className="inputWrapper">
                    <input
                      type="text"
                      name="имя пользователя"
                      id="usernameIn"
                      className="inputDefault"
                      onChange={this.handleUsername}
                      value={this.state.username}
                    />
                  </div>
                </div>
                <div className="outerIn">
                  <h5 className="inHeading">пароль</h5>
                  <div className="inputWrapper">
                    <input
                      type="password"
                      name="пароль"
                      id="passwordIn"
                      className="inputDefault"
                      onChange={this.handlePassword}
                      value={this.state.password}
                    />
                  </div>
                </div>
                <input type="checkbox" checked={false} onChange={this.handleBlocking} />
            </div>
            <button className="button" onClick={this.handleAdding}>
              <div className="contents">
                Добавить пользователя
              </div>
            </button>
            <button className="button" onClick={this.handleLogout} >
              <div className="contents">
                Выйти
              </div>
            </button>
          </div>
        </div>
      );
    }
  }
}

export default class App extends React.Component {
  render() {
    return <UserApp />;
  }
}
