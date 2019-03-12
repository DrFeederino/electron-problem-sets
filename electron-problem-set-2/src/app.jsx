import React from 'react';


const Task = (props) => {
  return (
    <div className="userWrapper">
      <Text class={'description'} text={props.givenTask.id} />
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

const TaskResultText = (props) => {
  return (
    <div className={props.class}>
      {Object.keys(props.text).map(element => (
        <div key={element} className={props.subclass}>
          {props.text[element]}
        </div>))}
    </div>
  );
}

const Description = (props) => {
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
    <div className="inputDiv">
      <label className="inputLabel">{props.label}</label>
      <div className="inputWrapper">
        <input
          className="inputTag"
          type="number"
          value={props.value}
          onChange={(e) => props.handleValue(props.label, e.target.value, props.handler)}
        />
      </div>
    </div>
   );
}

const Tasks = [
  {
    id: 0,
    data: {  
      n: 50,
      k: 7,
      s: 500,
      m: 0,
      v: 3,
    },
    text: {
      description: `Определить время перебора всех паролей с параметрами`,
      passwords: ``,
      time: ``,
      delayedTime: ``,
      result: ``
    },
  },
  {
    id: 1,
    data: {
    n: 50,
    t: 30,
    s: 200,
    },
    text: {
      description: `Определить минимальную длину пароля, состоящего из 150 символов и время перебора которого не меньше 30 лет.`,
      alphabet: ``,
      possibleNumber: ``,
      passwordLength: ``,
      result: ``,
    },
  },
  {
    id: 2,
    data: {
      k: 6,
      t: 30,
      s: 200,
    },
    text: {
      description: `Определить количество символов алфавита n ,пароль состоит из 6 символов,время перебора не меньше 30 лет.`,
      possibleNumber: ``,
      result: ``,
    },
  },
];

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
      id: props.id,
      data: props.data,
      text: props.text,
      secondsInDay: 86400, // 60 x 60 x 24
      secondsInYear: 31536000, // 60 x 60 x 25 x 365
      handleTasks: {
        0: () => {
          let stepOne = this.state.data.n ** this.state.data.k;
          let stepTwo = (stepOne / this.state.data.s).toFixed(1);
          let stepThree = stepTwo * this.state.data.v / this.state.data.m;
          let result = (stepTwo + stepThree) / this.state.secondsInDay;
          const text = this.state.text;
          text.passwords = `Количества вариантов паролей: C = nk = ${stepOne}.`;
          text.time = `Время перебора всех паролей: t = C/s = ${stepTwo} сек ~ ${Math.ceil(stepTwo / this.state.secondsInDay)} дней.`
          text.delayedTime = `С учётом пауз время перебора всех паролей: T = t×v/m = ${stepThree} сек ~ ${Math.ceil(stepThree / this.state.secondsInDay)} дней.`;
          text.result = `Итоговое значение: Tитог = t+T = ${result} дня (дней).`;
        },
        1: () => {
          let stepOne = this.state.data.t * this.state.data.s * this.state.secondsInYear;
          let stepTwo = Math.log10(stepOne).toFixed(1);
          let result = Math.ceil(stepTwo);
          const text = this.state.text;
          text.alphabet = `Алфавит составляют символы: n = ${this.state.data.n}.`;
          text.possibleNumber = `Определим количество вариантов: С = t×s = ${stepOne}.`;
          text.passwordLength = `Длина пароля: k = lg C = ${stepTwo}.`;
          text.result = `Длина пароля должна быть не менее  символов ${result}.`;
        },
        2: () => {
          let { s, t, k} =  this.state.data;
          let stepOne = ((t * s * this.state.secondsInYear) ** ( 1 / k)).toFixed(1);
          let result = Math.ceil(stepOne);
          const text = this.state.text;
          text.possibleNumber = `Количества вариантов паролей: C = k√t×s = ${stepOne}.`;
          text.result = `Количество символов алфавита должно быть не меньше ${result}.`;
        }
      }
    };
    this.handleValue = this.handleValue.bind(this);
  }

  handleValue(target, value, handler) {
    let data = this.state.data;
    data[target] = Number(value);
    this.setState({
      data: data,
    })
    handler();
  }

  render() {
    let formulas = Object.values(this.state.text).slice(1);
    return (
      <div className="taskWrapper">
        <Text class={'title'} text={this.state.text.description} />
        {Object.keys(this.state.data).map(element => (
          <Input
            key={element}
            label={element}
            value={this.state.data[element]}
            handleValue={this.handleValue}
            handler={this.state.handleTasks[this.state.id]}
          />))}
      <TaskResultText class={'subtitle'} subclass={'contents'} text={formulas} />
      </div>);
  }
}

export default class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Description class="description" text={description}/>
        {Object.keys(Tasks).map(taskID =>(
          <TaskApp
            key={taskID}
            id={Tasks[taskID].id}
            data={Tasks[taskID].data}
            text={Tasks[taskID].text}
          />))}
      </div>
    );
  }
}
