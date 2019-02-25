import React from 'react';
import { Motion, spring } from 'react-motion';

// To-Do:
// 1. Offload most of the stuff to different components for better structure
// 4. Testing - wip
// 5. Styling - wip

class UserApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [{
              id: 0, 
              username: 'admin',
              password: 'admin',
              isBlocked: false
            }, 
              {
              id: 1,
              username: 'user', 
              password: 'user', 
              isBlocked: true,
            }
          ],
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
          this.setState(prevState => ({
            isLogged: !this.state.isLogged,
            user: prevState.users.find(user => user.username === prevState.username), 
            username: '',
            password: '',
          }));
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
    console.warn(id);
    if (id > 0) {
        let users = this.state.users;
        users[id].isBlocked = !users[id].isBlocked;
        this.setState({
          users: [...users]
        })
      };
      return;
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
      const user = {
        id: this.state.users.length, 
        username: this.state.username, 
        password: this.state.password, 
        isBlocked: false
      };
      this.setState(prevState => ({
        users: [...prevState.users, user],
        username: '',
        password: '',
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
            <button className="button" onClick={this.handleLogout} >
              <div className="contents">
                Выйти
              </div>
            </button>
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
              {this.state.user.username}
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
            <div className="loginTitle">
                <h4>
                  Добро пожаловать, {this.state.user.username}
                </h4>
            </div>
            <div className="gridColumn">
            <div className="gridwRow">
              <div>
                ID 
              </div>
              <div>
                Имя пользователя
              </div>
              <div>
                Заблокирован?
              </div>
              <div>
                Заблокировать
              </div>
            </div>
              {this.state.users.map(user => (
                <div
                  className="gridRow"
                  key={user.id}
                >
                  <div>
                    {user.id + 1}.
                  </div>
                  <div>
                    {user.username} 
                  </div>
                  <div>
                    {user.isBlocked ? '✓' : 'x'}
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      onChange={() => this.handleBlocking(user.id)}
                      // it gets called for each object that is created
                      defaultChecked={user.isBlocked}
                    />
                  </div>
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
                <button className="button" onClick={this.handleAdding}>
                <div className="contents">
                  Добавить пользователя
                </div>
            </button>
            </div>
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
