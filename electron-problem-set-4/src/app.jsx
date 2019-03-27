import React from 'react';
import uniqid from 'uniqid';

const NUMBER_OF_OBJECTS = 4;
const UserNames = ['Admin', 'Andrey', 'Boris', 'Vladimir', 'Gennady', 'Dmitri', 'Evgeny'];
const NUMBER_OF_USERS = UserNames.length;
const RU = { // object with russian locale
  DEFAULT_WELCOME: 'Добро пожаловать в дискреционную модель ПБ!',
  USER_NOT_FOUND: 'Пользователь в системе не найден!',
  REQUIREMENTS_NOT_MET: 'Условия на пароль не выполнены.',
  READ: 'Чтение',
  WRITE: 'Запись',
  TRANSFER: 'Передача прав',
  BANNED: 'Запрет',
  FULL: 'Полный доступ',
  LOGIN: 'Войти',
  LOGOUT: 'Выйти',
  USERNAME: 'имя пользователя',
  SUCCESSFUL_LOGIN: 'Вы успешно вошли!',
  SUCCESSFUL_LOGOUT: 'Вы успешно вышли!',
  CHOOSE_PERMISSION: 'Выберите разрешение: ',
  SELECT_DEFAULT: 'Выберите разрешение',
  CHOOSE_OBJECT: 'Выберие объект: ',
  PROCEED_LOGIN: 'Пожалуйста, войдите.',
  SUCCESSFUL_OPERATION: 'Операция выполнена успешно.',
  UNSUCCESSFUL_OPERATION: 'В доступе отказано.',
  SELECT_USER: 'Выберите пользователя: ',
  UNSUCCESSFUL_OPERATION_SAME_USER: 'Невозможно переназначить себе права.',
  UNSUCCESSFUL_OPERATION_ADMIN: 'Невозможно назначить права администратору.',
  translateText(text) {
    if (!text) {
      return;
    }
    const keys = Object.keys(this);
    let translatedText = '';
    for (let word of text) {
      for (let key of keys) {
        if (key === word) { //key is stored in uppercase as each word for permission
          translatedText += this[key];
        }
      }
      translatedText += ', ';
    }
    return translatedText.slice(0, translatedText.length - 2);
  },
};

const UserObject = (name, permissions) => ({ name: name, permissions: permissions });
const Permissions = ['READ', 'WRITE', 'TRANSFER'];
const getRandomPermission = (numberOfObjs, isAdmin=false) => {
  // Randomizing permission for each object for each user as per the task's requirement
  if (isAdmin) {
    return Array(numberOfObjs).fill(Array(1).fill('FULL'));
  }
  /*
    To handle a case if we have randomed N + 1,
    which is considered a ban for a file (object)
    Method below does not care if duplicates are possible
  */
  const permissions = [];
  for (let i = 0; i < numberOfObjs; i++) {
    const timesToRandomForObject = Math.floor(Math.random() * Math.floor(Permissions.length) + 1);
    let permission = [];
    for (let j = 0; j < timesToRandomForObject; j++) {
      const rndPermission = Math.floor(Math.random() * Math.floor(Permissions.length + 1));
      if (rndPermission === Permissions.length) {
        permission = ['BANNED'];
        break;
      }
      permission.push(Permissions[rndPermission]);
    }
    // before pushing array, one needs to remove the duplicates
    permission = [...new Set(permission)];
    permissions.push(permission);
  }
  return permissions;
};

const initUsers = () => {
  const usersInit = [];
  for (let id = 0; id < NUMBER_OF_USERS; id++) {
    const permission = id === 0
    ? getRandomPermission(NUMBER_OF_OBJECTS, true)
    : getRandomPermission(NUMBER_OF_OBJECTS);
    usersInit.push(UserObject(UserNames[id], permission));
  }
  return usersInit;
};

const FieldBox = (props) => (
  <div className="wrappingDiv">
    <h5 className="textHeader">{props.fieldName}</h5>
    <div className="inputWrapper">
      <input
        type={props.type}
        className="inputDefault"
        onChange={props.handler}
        value={props.value}
      />
      <Button
        text={props.text}
        handler={props.handleButton}
      />
    </div>

  </div>
);

const Button = (props) => (
  <button className="button" onClick={props.handler}>
    <div className="contents">
      {props.text}
    </div>
  </button>
);

const Text = (props) => {
  let { text } = props;
  text = typeof(text) !== "string" ? RU.translateText(text) : text;
  return (
  <div className={props.class}>
    {text}
  </div>
)};

const TableRow = (props) => (
  <div className="gridRow">
    <Text class={'textHeader'} text={props.row} />
  </div>
);

const TableColumn = (props) => (
  <div className="gridColumn">
    <TableRow row={props.columns.name} />
    {props.columns.permissions.map(column => (
      <TableRow
        row={column}
        key={uniqid()}
      />))}
  </div>
);

const TableHeader = (props) => {
  const header = ['Субъект / Объект', 'Объект 1', 'Объект 2', 'Объект 3', 'Объект 4'];
  return (
    <div className="gridColumn">
      {header.map(column => <TableRow row={column} key={header.indexOf(column)} />)}
    </div>
  );
};

const TableComponent = (props) => (
  <div className="table">
    <TableHeader />
    {Object.keys(props.users).map(id => <TableColumn columns={props.users[id]} key={id} />)}
  </div>
);

const IDComponent = (props) => {
  return (
    <div className="IDComponentWrapper">
      <TableComponent users={props.users} />
      <FieldBox
        fieldName={RU.USERNAME}
        handler={props.handler}
        value={props.value}
        type="type"
        text={props.isLogged ? RU.LOGOUT : RU.LOGIN}
        handleButton={props.handleLogin}
      />
    </div>
  );
};

const SelectorComponent = (props) => (
  <div className="SelectorWrapper">
    <label className="textHeader" htmlFor={props.kind}>{props.text}</label>
    <select id="props.kind" onChange={props.handleOption}>
      <option value="" disabled>{RU.SELECT_DEFAULT}</option>
      {props.arr.map(item => <option key={item} value={item}>{item}</option>)}
    </select>
  </div>
);

const PermissionComponent = (props) => {
  const ObjectsText = [];
  for (let i = 0; i < NUMBER_OF_OBJECTS; i++) {
    ObjectsText.push("Объект " + (i + 1));
  }
  const PermissionsText = [];
  for (let i = 0; i < Permissions.length; i++) {
    PermissionsText.push(RU[Permissions[i]]);
  }
  if (props.isLogged) {
    return (
      <div className="PermissionWrapper">
        <Text text={props.username} />
        <SelectorComponent
          kind="permission-selector"
          arr={PermissionsText}
          text={RU.CHOOSE_PERMISSION}
          handleOption={props.handleOptionPermission}
        />
        {props.permission === 'TRANSFER' &&
          <SelectorComponent
            kind="user-selector"
            arr={UserNames}
            text={RU.SELECT_USER}
            handleOption={props.handleUser}
          />
        }
        <SelectorComponent
          kind="object-selection"
          arr={ObjectsText}
          text={RU.CHOOSE_OBJECT}
          handleOption={props.handleOptionObject}
        />
        <Button
          text="Совершить операцию"
          handler={props.handlePermissions}
        />
      </div>
    );
  } else { return (<Text class="title" text={RU.PROCEED_LOGIN} />); }
};

class DACApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users, //this will hold an array of users with their permissions
      objsCount: props.objsCount,
      usersCount: props.usersCount,
      text: '',
      username: '',
      loggedUsername: '',
      isLogged: false,
      targetUser: '',
      object: null,
      permission: null,
    };
    this.handleIdentifcation = this.handleIdentifcation.bind(this);
    this.handlePermissions = this.handlePermissions.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handleOptionObject = this.handleOptionObject.bind(this);
    this.handleOptionPermission = this.handleOptionPermission.bind(this);
    this.handleUser = this.handleUser.bind(this);
  }

  handleUser(e) {
    this.setState({
      targetUser: e.target.value,
    });
  }

  handleIdentifcation() {
    const INIT_VAL = 0;
    if (this.state.isLogged || this.state.users.find(user => user.name === this.state.username)) {
      this.setState(prevState => ({
        isLogged: !prevState.isLogged,
        username: '',
        text: prevState.isLogged ? RU.SUCCESSFUL_LOGOUT : RU.SUCCESSFUL_LOGIN,
        object: INIT_VAL,
        permission: Permissions[INIT_VAL],
        loggedUsername: prevState.username,
        targetUser: UserNames[INIT_VAL],
      }));
    } else {
      this.setState({
        text: RU.USER_NOT_FOUND,
      });
    }
  }

  handleOptionObject(e) {
    const object = e.target.value.charAt(e.target.value.length - 1) - 1;
    this.setState({
      object: object,
    });
  }

  handleOptionPermission(e) {
    const permission = Object.keys(RU).find(id => RU[id] === e.target.value);
    this.setState({
      permission: permission,
    });
  }

  handleUsername(e) {
    this.setState({ username: e.target.value });
  }

  handlePermissions() { 
    const { permission, object, loggedUsername, targetUser } = this.state;
    const userPermissions = this.state.users.find(userObj => userObj.name === loggedUsername).permissions;
    if (targetUser === loggedUsername) {
      this.setState({
        text: RU.UNSUCCESSFUL_OPERATION_SAME_USER,
      });
      return false;
    }
    if (targetUser === UserNames[0]) {
      this.setState({
        text: RU.UNSUCCESSFUL_OPERATION_ADMIN,
      });
      return false;
    }
    for (let perm of userPermissions[object]) {
      if (perm === 'FULL' || perm === permission) {
        const users = this.state.users;
        for (let user of users) {
          if (user.name === targetUser) {
            user.permissions[object] = userPermissions[object];
            this.setState({
              users: [...users],
              text: RU.SUCCESSFUL_OPERATION,
            });
            return true;
          }
        }
      }
    }
  }

  render() {
    return (
      <div className="DACWrapper">
        <Text class="title" text={RU.DEFAULT_WELCOME} />
        <IDComponent
          users={this.state.users}
          handleLogin={this.handleIdentifcation}
          value={this.state.username}
          handler={this.handleUsername}
          isLogged={this.state.isLogged}
        />
        <Text class="title" text={this.state.text} />
        <PermissionComponent
          users={this.state.users}
          handlePermissions={this.handlePermissions}
          isLogged={this.state.isLogged}
          handleOptionObject={this.handleOptionObject}
          handleOptionPermission={this.handleOptionPermission}
          permission={this.state.permission}
          handleUser={this.handleUser}
        />
      </div>);
  }
}

export default class App extends React.Component {
  render() {
    const users = initUsers();
    return (
      <DACApp
        users={users}
        objsCount={NUMBER_OF_OBJECTS}
        usersCount={NUMBER_OF_USERS}
      />);
  }
}