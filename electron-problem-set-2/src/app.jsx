import React from 'react';
/* TO DO:
  1. Remove NestedText component as it repeats Text component
  2. Resolve handlers for each exercise
  3. Think of a workaround for no support for spread object operator
*/
const Task = (props) => {
  return (
    <div className="userWrapper">
      <Text className="title" text={props.givenTask.id} />
      <div>
        {props.description}
      </div>
      <div>

      </div>
    </div>
  );
};

const Text = (props) => {
  return (
    <div className={props.class}>
      {props.text}
    </div>);
};

const NestedText = (props) => {
  return (
    <div className={props.class}>
      {Object.keys(props.text).map(element => (
        <div key={element}>
          {element} - {props.text[element]}
        </div>))}
    </div>
  );
}

const Input = (props) => {
  return(
    <div>
      <label>{props.label}</label>
      <input type="number" value={props.value} onChange={() => props.handleValue(props.label, props.value)} />
    </div>
   );
}

const Tasks = {
  FirstTask: {
    data: {  
      n: 50,
      k: 7,
      s: 500,
      m: 0,
      v: 3,
    },
    text: {
      description: `Определить время перебора всех паролей с параметрами`,
      passwords: `Количества вариантов паролей: C = nk = `,
      time: `Время перебора всех паролей: t = C/s = `,
      delayedTime: `С учётом пауз время перебора всех паролей: T = t×v/m = `,
      total: `Итоговое значение: Tитог = t+T = `
    },
  },
  SecondTask: {
    data: {
    n: 50,
    t: 30,
    s: 200,
    },
    text: {
      description: `Определить минимальную длину пароля ,состоящего из 150 символов и время перебора которого не меньше 30 лет`,
      alphabet: `Алфавит составляют символы: n = `, //${value}
      possibleNumber: `Определим количество вариантов : С = t×s = `,
      passwordLength: `Длина пароля : k = lg C= `,
      calculated: `Длина пароля должна быть не менее  символов`,
    },
  },
  ThirdTask:{
    data: {
      k: 6,
      t: 30,
      s: 200,
    },
    text: {
      description: `Определить количество символов алфавита n ,пароль состоит из 6 символов,время перебора не меньше 30 лет`,
      possibleNumber: `Количества вариантов паролей : C = k√t×s = `,
      calculated: `Количество символов алфавита должно быть не меньше `,
    },
  },
};

const description = {
  n: "количество символов в алфавите\n",
  k:"длина пароля\n",
  s: "скорость перебора паролей в секунду\n",
  m: "число неправильно введённых паролей\n",
  v: "пауза после неправильно введённых паролей в секунду\n",
  t: "время перебора всех паролей (без пауз)",
};

class TaskApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      text: props.text,
    };
    this.handleValue = this.handleValue.bind(this);
    this.handleFirstTask = this.handleFirstTask.bind(this);
  }

  handleValue(target, value) {
    console.warn(target + value);
    this.setState(prevState => ({
      data: {
        [target]: value,
      },
    }));
  }
  /* 
    passwords: `Количества вариантов паролей: C = nk = `,
    time: `Время перебора всех паролей: t = C/s = `,
    delayedTime: `С учётом пауз время перебора всех паролей: T = t×v/m = `,
    total: `Итоговое значение: Tитог = t+T = `
  */
  handleFirstTask() {
    let value = this.state.data.n ** this.state.data.k;
    this.setState(prevState => ({
      text: {
        description: prevState.text.description,
        passwords: prevState.text.passwords + `${pswrds}`,
        time: prevState.text.time + `${time}`,
        delayedTime: prevState.text.time + `${0}`,
        total: prevState.text.total + `${0}`,
      }
    }));
  }

  render() {
    return(
      <div className="taskWrapper">
        <Text className="subtitle" text={this.state.text.description} />
        {Object.keys(this.state.data).map(element => (
          <Input
            key={element + this.state.data[element]}
            label={element}
            value={this.state.data[element]}
            handleValue={this.handleValue}
          />))}
      <NestedText className="subtitle" text={this.state.text} />
      </div>);
  }
}

export default class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Text className="title" text="Лабораторная работа №2" />
        <NestedText class="description" text={description}/>
        {Object.keys(Tasks).map(taskID =>(
          <TaskApp
            key={taskID}
            data={Tasks[taskID].data}
            text={Tasks[taskID].text}
          />))}
      </div>
    );
  }
}
