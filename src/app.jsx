import React from 'react';
import { Motion, spring } from 'react-motion';
import { remote } from 'electron';


// To-Do:
// 1. Offload most of the stuff to different components for better structure
// 2. Testing - wip
// 3. Styling - wip

const RU = {
  DEFAULT_WELCOME: 'Пожалуйста, авторизуйтесь!',
  INCORRECT_PASSWORD: 'Вы ввели неверный пароль!',
  INCORRECT_PASSWORD_RETRY: 'Вы ввели неверный пароль! Количество оставшихся попыток ',
  BANNED_ACCOUNT: 'Учетная запись заблокирована. Обратитесь к Администратору.',
  PASSWORD_BAN: 'Вы были заблокированы, обратитесь к Администратору',
  USER_NOT_FOUND: 'Пользователь в системе не найден!',
}

class UserApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [{
        id: 0,
        username: 'admin',
        password: 'admin',
        count: 0,
        isBlocked: false,
      },
      {
        id: 1,
        username: 'user',
        password: 'user',
        count: 0,
        isBlocked: true,
      }],
      username: '', // these two fields are for adding or logging in
      password: '',
      isLogged: false,
      user: undefined, // handles currently logged in user
      text: RU['DEFAULT_WELCOME'],
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
          if (usr.count < 3 && !this.checkIfBlocked(usr)) {
            this.setState(prevState => ({
              isLogged: !this.state.isLogged,
              user: prevState.users.find(user => user.username === prevState.username), 
              username: '',
              password: '',
            }));
            const win = remote.getCurrentWindow();
            win.setSize(600, 800);
            return;
          } else {
            this.setState({
              text: RU['BANNED_ACCOUNT'],
            });
            return;
          }
        } else {
          const users = this.state.users;
          if (users[usr.id].count >= 3 && usr.id > 0) {
            users[usr.id].isBlocked = true;
            users[usr.id].count++;
            this.setState({
              users: [...users],
              text: RU['PASSWORD_BAN'],
            });
            return;
          }
          users[usr.id].count++;
          this.setState({
            users: [...users],
            text: usr.id > 0 ? RU['INCORRECT_PASSWORD_RETRY'] + (3 - users[usr.id].count) + '.' : RU['INCORRECT_PASSWORD'],
          });
          return;
        }
      }
    }
    this.setState({
      text: RU['USER_NOT_FOUND'],
    });
  }

  handleUsername(e) {
    e.preventDefault();
    this.setState({ username: e.target.value });
  }

  handlePassword(e) {
    e.preventDefault();
    this.setState({ password: e.target.value }); // add filter and number of tries support
  }

  handleBlocking(id) {
    if (id > 0) {
      const users = this.state.users;
      users[id].isBlocked = !users[id].isBlocked;
      if (!users[id].isBlocked) {
        users[id].count = 0;
      }
      this.setState({
        users: [...users],
      });
    }
    return;
  }

  handleLogout() {
    this.setState({
      isLogged: !this.state.isLogged,
      user: undefined,
      text: RU['DEFAULT_WELCOME'],
    });
    const win = remote.getCurrentWindow();
    win.setSize(500, 550);
  }

  checkUser() {
    for (let user of this.state.users) {
      if (user.username === this.state.username) {
        return true;
      }
    } return false;
  }

  checkIfBlocked(user) {
    if (user.isBlocked) {
      return true;
    } else { return false; }
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
        count: 0,
        isBlocked: false,
      };
      this.setState(prevState => ({
        users: [...prevState.users, user],
        username: '',
        password: '',
      }));
    }
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
    if (this.state.user.id !== 0) {
      return (
        <div className="wrapper">
          <div className="userWrapper">
            <div className='title'>
              Добро Пожаловать, {this.state.user.username}!
            </div>
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
    } else {
      return (
        <div className="wrapper">
          <div className="userWrapper">
            <div className="centerWrapper">
                <div className='title'>
                  Добро пожаловать, {this.state.user.username}
                </div>
            </div>
            <div className="table">
              <div className="gridColumn">
                <div className="gridRow">
                  <div className="inHeading">
                    ID 
                  </div>
                  <div className="inHeading">
                    Имя пользователя
                  </div>
                  <div className="inHeading">
                    Заблокирован?
                  </div>
                  <div className="inHeading">
                    Заблокировать
                  </div>
                </div>
              </div>
              <div className="gridColumn">
                {this.state.users.map(user => (
                  <div
                    className="gridRow"
                    key={user.id}
                  >
                    <div className="inHeading">
                      {user.id + 1}.
                    </div>
                    <div className="inHeading">
                      {user.username} 
                    </div>
                    <div className="inHeading">
                      {user.isBlocked ? 'Да' : 'Нет'}
                    </div>
                    <div className="inHeading">
                      <input
                        className="inHeading"
                        type="checkbox"
                        onChange={() => this.handleBlocking(user.id)}
                        // it gets called for each object that is created
                        defaultChecked={user.isBlocked}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="inHeading">
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
