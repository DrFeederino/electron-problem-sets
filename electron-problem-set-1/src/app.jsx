import React from 'react';
import { remote } from 'electron';

const RU = {
  DEFAULT_WELCOME: 'Пожалуйста, авторизуйтесь!',
  INCORRECT_PASSWORD: 'Вы ввели неверный пароль!',
  INCORRECT_PASSWORD_RETRY: 'Вы ввели неверный пароль!\n Количество оставшихся попыток ',
  BANNED_ACCOUNT: 'Учетная запись заблокирована.\n Обратитесь к Администратору.',
  PASSWORD_BAN: 'Вы были заблокированы,\n обратитесь к Администратору.',
  USER_NOT_FOUND: 'Пользователь в системе не найден!',
  SPECIAL_PASSWORD: 'Введены ограничения на пароль.\n Обязательно наличие строчных и прописных букв,\n а также знаков препинания.',
  REQUIREMENTS_NOT_MET: 'Условия на пароль не выполнены.',
  PASSWORD_CHANGED: 'Пароль успешно изменён.',
  PASSWORD_NOT_CHANGED: 'Пароль не был изменён.',
}

const Text = (props) => (
  <div className={props.class}>
    {props.text}
  </div>
);

const FieldBox = (props) => (
  <div className="outerIn">
    <h5 className="inHeading">{props.fieldName}</h5>
    <div className="inputWrapper">
      <input
        type={props.type}
        id={props.fieldID}
        className="inputDefault"
        onChange={props.handler}
        value={props.value}
      />
    </div>
  </div>
);

const AuthBlock = (props) => (
  <div className="authBlock">
    <FieldBox
      fieldName="имя пользователя"
      fieldID="usernameIn"
      handler={props.handleUsername}
      value={props.username}
      type="text"
    />
    <FieldBox
      fieldName="пароль"
      fieldID="passwordIn"
      handler={props.handlePassword}
      value={props.password}
      type="password"
    />
    <Button text="Войти" />
  </div>
);

const LoginWrapper = (props) => (
  <div className="wrapper">
    <form className="authBox" onSubmit={props.handleLogin}>
      <div className="centerWrapper">
        <Text class="title" text="Добро пожаловать!" />
        <Text class={props.text.includes("блок") ? "subtitle warning" : "subtitle"} text={props.text} />
        <AuthBlock
          username={props.username}
          password={props.password}
          handleUsername={props.handleUsername}
          handlePassword={props.handlePassword}
        />
      </div>
    </form>
  </div>
);

const UserPanel = (props) => (
  <div className="wrapper">
    <div className="wrapperLogged">
      <Text class="title" text={"Добро пожаловать, " + props.user.username + "!"} />
      <Text class="subtitle" text={props.text} />
      <FieldBox
        fieldName="пароль"
        fieldID="passwordIn"
        value={props.password}
        handler={props.handlePassword}
        type="password"
      />
      <Button
        text="Сменить пароль"
        handler={() => props.handleChangePassword(props.user, props.password)}
      />
      <Button
        text="Выйти"
        handler={props.handleLogout}
      />
    </div>
  </div>
);

const TableRow = (props) => {
  if (props.row.handler) {
    return (
      <div className="gridRow">
        <input
          className="inHeading"
          type="checkbox"
          onChange={props.row.handler}
          defaultChecked={props.row.checked}
        />
      </div>);
  }
  return (
    <div className="gridRow">
      <div className="inHeading">
        {props.row}
      </div>
    </div>);
}

const TableColumn = (props) => (
  <div className="gridColumn">
    {props.columns.map(column => 
      <TableRow row={column} key={props.columns.indexOf(column)} />
    )}
  </div>
);

const TableHeader = (props) => {
  const header = ['ID', 'Имя пользователя', 'Заблокирован?', 'Особый пароль', 'Заблокировать'];
  return (
    <div className="gridColumn">
      {header.map(column => <TableRow row={column} key={header.indexOf(column)}/>)}
    </div>
  );
}

const Table = (props) => (
  <div className="table">
    <TableHeader />
    {Object.keys(props.users).map(id => <TableColumn columns={props.users[id]} key={id}/>)}
  </div>
);

const Button = (props) => (
  <button className="button" onClick={props.handler}>
    <div className="contents">
      {props.text}
    </div>
  </button>
);

const AddUser = (props) => (
  <div className="addFields">
    <FieldBox
      fieldName="имя пользователя"
      fieldID="usernameIn"
      handler={props.handleUsername}
      value={props.username}
      type="text"
    />
    <FieldBox
      fieldName="пароль"
      fieldID="passwordIn"
      handler={props.handlePassword}
      value={props.password}
      type="text"
    />
    <div className="inHeading">
        Специальный фильтр для пароля: 
      <input
        type="checkbox"
        defaultChecked={props.isSpecial}
        onChange={() => props.handleSpecial()}
      />
    </div>
    <Button
      text="Добавить пользователя"
      handler={props.handleAdding} 
    />
  </div>
);

const AdminPanel = (props) => (
  <div className="wrapper">
    <div className="wrapperLogged">
      <Text class="title" text={"Добро пожаловать, " + props.admin.username + "!"} />
      <Text class="subtitle" text={props.text} />
      <Table users={props.users} />
      <AddUser
        username={props.username}
        password={props.password}
        handleUsername={props.handleUsername}
        handlePassword={props.handlePassword}
        handleAdding={props.handleAdding}
        isSpecial={props.isSpecial}
        handleSpecial={props.handleSpecial}
      />
      <Button
        text="Сменить пароль"
        handler={() => props.handleChangePassword(props.admin, props.password)} // No requirements for Admin
      />
      <Button
        text="Выйти"
        handler={props.handleLogout}
      />
    </div>
</div>
);

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
        isSpecial: false,
      },
      {
        id: 1,
        username: 'user',
        password: 'user',
        count: 0,
        isBlocked: true,
        isSpecial: true,
      }],
      username: '', // these two fields are for adding or logging in
      password: '',
      isLogged: false,
      user: undefined, // handles currently logged in user
      text: RU.DEFAULT_WELCOME,
      isSpecial: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAdding = this.handleAdding.bind(this);
    this.handleBlocking = this.handleBlocking.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSpecificity = this.handleSpecificity.bind(this);
    this.handleSpecial = this.handleSpecial.bind(this);
  }

  getUsers(){
    let users = [];
    this.state.users.map(user => {
      users.push([
        user.id + 1,
        user.username,
        user.isBlocked ? 'Да' : 'Нет',
        {
          checked: user.isSpecial,
          handler: () => this.handleSpecificity(user.id)
        },
        {
          checked: user.isBlocked,
          handler: () => this.handleBlocking(user.id),
        }]);
    });
    return users;
  }

  handleLogin(e) {
    e.preventDefault();
    if (!this.state.username.length && !this.state.password) {
      return;
    }
    for (let user of this.state.users) {
      if (user.username === this.state.username) {
        if (user.password === this.state.password) {
          if (!user.isBlocked) {
            this.setState(prevState => ({
              isLogged: !this.state.isLogged,
              user: user, 
              username: '',
              password: '',
              text: '',
            }));
            const win = remote.getCurrentWindow();
            win.setSize(600, 850);
            return;
          } else {
            this.setState({
              text: RU.BANNED_ACCOUNT,
            });
            return;
          }
        } else {
          ++user.count;
          if (user.count >= 3 && user.id > 0) {
            user.isBlocked = user.isBlocked ? true : !user.isBlocked;
            this.setState({
              text: RU.PASSWORD_BAN,
            });
            return;
          }
          this.setState({
            text: user.id > 0 ? RU.INCORRECT_PASSWORD_RETRY + (3 - user.count) + '.' : RU.INCORRECT_PASSWORD,
          });
          return;
        }
      }
    }
    this.setState({
      text: RU.USER_NOT_FOUND,
    });
  }

  handleUsername(e) {
    this.setState({ username: e.target.value });
  }

  handlePassword(e) {
    this.setState({ password: e.target.value }); // add filter and number of tries support
  }

  handleSpecial() {
    this.setState(prevState => ({
      isSpecial: !prevState.isSpecial,
    }));
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
      username: '',
      password: '',
      text: RU.DEFAULT_WELCOME,
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

  handleAdding() {
    if (this.state.username && this.state.password) {
      let isRegistered = this.checkUser();
      if (isRegistered) {
        this.setState({
          text: RU.USER_REGISTERED,
        })
        return;
      }
      const user = {
        id: this.state.users.length, 
        username: this.state.username, 
        password: this.state.password,
        count: 0,
        isBlocked: false,
        isSpecial: this.state.isSpecial,
      };
      this.setState(prevState => ({
        users: [...prevState.users, user],
        username: '',
        password: '',
        isSpecial: false,
        text: '',
      }));
    }
  }

  handleSpecificity(id) {
    const users = this.state.users;
    users[id].isSpecial = !users[id].isSpecial;
  }

  handleChangePassword(user, password) {
    const re = /[A-Z]+[a-z]+[;,\.!\?\-:]+/;
    const users = this.state.users;
    if (user.isSpecial) {
      if (!re.test(password)) {
        this.setState({
          text: RU.REQUIREMENTS_NOT_MET,
          password: '',
        });
        return;
      } else {
        users[user.id].password = password;
        this.setState({
          text: RU.PASSWORD_CHANGED,
          password: '',
        });
        return;
      }
    }
    if (password) {
      users[user.id].password = password;
      this.setState({
        text: RU.PASSWORD_CHANGED,
        password: '', //doopsie
      });
    } else {
      this.setState({
        text: RU.PASSWORD_NOT_CHANGED, 
      });
    }
    return;
  }

  render() {
    // Render Logged in form for Admin and usual people
    if (!this.state.isLogged) {
      return (
        <LoginWrapper
          handleLogin={this.handleLogin}
          text={this.state.text}
          username={this.state.username}
          password={this.state.password}
          handleUsername={this.handleUsername}
          handlePassword={this.handlePassword}
        />);
    }
    if (this.state.user.id !== 0) {
      return (
        <UserPanel
          user={this.state.user}
          password={this.state.password}
          text={this.state.text}
          handlePassword={this.handlePassword}
          handleChangePassword={this.handleChangePassword}
          handleLogout={this.handleLogout}
        />);
    } else {
      let users = this.getUsers();
      return (
        <AdminPanel
          admin={this.state.user}
          users={users}
          text={this.state.text}
          handleBlocking={this.handleBlocking}
          username={this.state.username}
          password={this.state.password}
          isSpecial={this.state.isSpecial}
          handleUsername={this.handleUsername}
          handlePassword={this.handlePassword}
          handleAdding={this.handleAdding}
          handleChangePassword={this.handleChangePassword}
          handleLogout={this.handleLogout}
          handleSpecificity={this.handleSpecificity}
          handleSpecial={this.handleSpecial}
        />);
    }
  }
}

export default class App extends React.Component {
  render() {
    return <UserApp />;
  }
}
