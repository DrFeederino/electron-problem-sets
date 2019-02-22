import React from 'react';
import { Motion, spring } from 'react-motion';

// To-Do:
// 1. Offload most of the stuff to different components for better structure
// 2. Blocking issues
// 3. Adding users
// 4. Testing
// 5. Styling

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
      users: [new User(0, 'admin', 'admin', false), new User(1, 'user', 'user', true)],
      username: '', // these two fields are for adding or logging in
      password: '',
      isLogged: false,
      user: undefined, // handles currently logged in user
      text: 'Пожалуйста, авторизуйтесь!',
      isChecked: false,
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
    for (let usr of this.state.users) {
      if (usr.username === this.state.username) {
        if (usr.password === this.state.password) {
          this.setState({
            isLogged: !this.state.isLogged,
            user: Object.assign({}, usr), // ???
            username: '',
            password: '',
          });
          return;
        }
        else {
          this.setState({
            text: 'Вы ввели неверный пароль!',
          });
          return;
        }
      }
      this.setState({
        text: 'Пользователь в системе не найден!',
      });
    }
  }

  handleUsername(e) {
    this.setState({ username: e.target.value });
  }

  handlePassword(e) {
    this.setState({ password: e.target.value }); // add filter and number of tries support
  }

  handleBlocking(id) { //needs fixing
    if (this.state.users[id].username !== 'admin') {
      let users = this.state.users;
      users[id].isBlocked = !users[id].isBlocked;
      //this.state.users[id].isBlocked = !this.state.users[id].isBlocked;
     /* this.setState(prevState => ({
        users: [...users],
        text: 'successfully blocked',
      }));*/
    }
  }

  handleLogout() {
    this.setState({
      isLogged: !this.state.isLogged,
      user: undefined,
      text: 'Пожалуйста, авторизуйтесь',
    });
  }

  checkUser() {
    for (let user of this.state.users) {
      if (user.username === this.state.username) {
        return true;
      }
    } return false;
  }

  handleAdding() {
    if (this.state.username && this.state.password) {
      let isRegistered = this.checkUser();
      if (isRegistered) {
        return;
      }
      const user = new User(this.state.users.length, this.state.username, this.state.password, false);
      this.setState(prevState => ({
        users: [...prevState.users, user],
      }));
    } // will check if user is not "there"
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
            Уважаемый, {this.state.user.username}!
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
              {this.state.user.username}
              {this.state.text}
            </h5>
            <div>
              {this.state.users.map(user => (
                <div
                  className="gridRow"
                  key={user.id}
                >
                  {user.id + 1}. {user.username} | {user.isBlocked ? '✓' : 'x'}
                  <input
                    type="checkbox"
                    onClick={this.handleBlocking(user.id)}
                    defaultChecked={this.state.users[user.id].isBlocked}
                  />
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
                <div>
                  Специальный фильтр для пароля: 
                  <input
                    type="checkbox"
                    defaultChecked={this.state.isChecked} // add onChange event behaviour
                  />
                </div>
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
