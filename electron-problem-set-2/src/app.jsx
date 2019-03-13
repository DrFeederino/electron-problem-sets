import React from 'react';


const Task = (props) => (
  <div className="userWrapper">
    <Text class={'description'} text={props.givenTask.id} />
    <div>
      {props.description}
    </div>
    <div>
    </div>
  </div>
);

const Text = (props) => (
  <div className={props.class}>
    {props.text}
  </div>
);

const TaskResultText = (props) => (
  <div className={props.class}>
    {Object.keys(props.text).map(element => (
      <div key={element} className={props.subclass}>
        {props.text[element]}
      </div>))}
  </div>
);

const Description = (props) => (
  <div className={props.class}>
    {Object.keys(props.text).map(element => (
      <div key={element}>
        {element} - {props.text[element]}
      </div>))}
  </div>
);

const Input = (props) => (
  <div className="inputDiv">
    <label className="inputLabel">{props.label}</label>
    <div className="inputWrapper">
      <input
        className="inputTag"
        type="number"
        value={props.value}
        onChange={(e) => props.handleValue(props.label, e.target.value, props.handler)}
        min='0'
      />
    </div>
  </div>
);


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
          let {n, k, s, v, m} = this.state.data;
          let stepOne = n ** k;
          let stepTwo = (stepOne / s).toFixed(1);
          let stepThree = stepTwo * v / m;
          let daysStepTwo = stepTwo / this.state.secondsInDay;
          let daysStepThree = stepThree / this.state.secondsInDay;
          let result = Math.ceil(daysStepTwo + daysStepThree);
          const text = this.state.text;
          text.passwords = `Количества вариантов паролей: \nC = nk = ${stepOne}.`;
          text.time = `Время перебора всех паролей: \nt = C/s = ${stepTwo} сек ~ ${Math.ceil(daysStepTwo)} дней.`
          text.delayedTime = `С учётом пауз время перебора всех паролей: \nT = t×v/m = ${stepThree} сек ~ ${Math.ceil(daysStepThree)} дней.`;
          text.result = `Итоговое значение: \nTитог = t+T = ${result} дня (дней).`;
          this.setState({
            text: text,
          })
        },
        1: () => {
          let {t, s, n } = this.state.data;
          let stepOne = t * s * this.state.secondsInYear;
          let stepTwo = Math.log10(stepOne).toFixed(1);
          let result = Math.ceil(stepTwo);
          const text = this.state.text;
          text.alphabet = `Алфавит составляют символы: \nn = ${n}.`;
          text.possibleNumber = `Определим количество вариантов: \nС = t×s = ${stepOne}.`;
          text.passwordLength = `Длина пароля: \nk = lg C = ${stepTwo}.`;
          text.result = `Длина пароля должна быть не менее  символов ${result}.`;
          this.setState({
            text: text,
          })
        },
        2: () => {
          let {s, t, k} =  this.state.data;
          let stepOne = ((t * s * this.state.secondsInYear) ** ( 1 / k)).toFixed(1);
          let result = Math.ceil(stepOne);
          const text = this.state.text;
          text.possibleNumber = `Количества вариантов паролей: \nC = k√t×s = ${stepOne}.`;
          text.result = `Количество символов алфавита должно быть не меньше ${result}.`;
          this.setState({
            text: text,
          })
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
