import React from 'react';

/* TO DO:
  1. Styling
  2. Resolve handlers for each exercise
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

const TaskResultText = (props) => {
  return (
    <div className={props.class}>
      {Object.keys(props.text).map(element => (
        <div key={element}>
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
    <div>
      <label>{props.label}</label>
      <input type="number" value={props.value} onChange={(e) => props.handleValue(props.label, e.target.value, props.handler)} />
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
      passwords: `Количества вариантов паролей: C = nk = `,
      time: `Время перебора всех паролей: t = C/s = `,
      delayedTime: `С учётом пауз время перебора всех паролей: T = t×v/m = `,
      total: `Итоговое значение: Tитог = t+T = `
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
      description: `Определить минимальную длину пароля ,состоящего из 150 символов и время перебора которого не меньше 30 лет`,
      alphabet: `Алфавит составляют символы: n = `,
      possibleNumber: `Определим количество вариантов: С = t×s = `,
      passwordLength: `Длина пароля: k = lg C= `,
      calculated: `Длина пароля должна быть не менее  символов`,
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
      description: `Определить количество символов алфавита n ,пароль состоит из 6 символов,время перебора не меньше 30 лет`,
      possibleNumber: `Количества вариантов паролей: C = k√t×s = `,
      calculated: `Количество символов алфавита должно быть не меньше `,
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
          let stepTwo = stepOne / this.state.data.s;
          let stepThree = stepTwo * this.state.data.v / this.state.data.m;
          let result = (stepTwo + stepThree) / this.state.secondsInDay;
          this.setState(prevState => ({
            text: {
              description: prevState.text.description,
              passwords: prevState.text.passwords + `${stepOne}`,
              time: prevState.text.time + `${stepTwo} сек ~ ${Math.ceil(stepTwo / this.state.secondsInDay)} дней` ,
              delayedTime: prevState.text.time + `${stepThree} сек ~ ${Math.ceil(stepThree / this.state.secondsInDay)} дней`,
              total: prevState.text.total + `${result} дня (дней)`,
            }
          }));
        },
        1: () => {
          let stepOne = this.state.t * this.state.s * this.state.secondsInYear;
          let stepTwo = Math.log10(stepOne);
          let result = Math.ceil(stepTwo);
          const text = this.state.text;
          text.alphabet += `${this.state.n}`;
          text.possibleNumber += `${stepOne}`;
          text.passwordLength += `${stepTwo}`;
          text.calculated += `${result}`;
        },
        2: () => {
          return;
        }
      }
    };
    this.handleValue = this.handleValue.bind(this);
  }

  handleValue(target, value, handler) {
    const data = this.state.data;
    data[target] = Number(value);
    handler();
  }

  render() {
    return(
      <div className="taskWrapper">
        <Text className="subtitle" text={this.state.text.description} />
        {Object.keys(this.state.data).map(element => (
          <Input
            key={element}
            label={element}
            value={this.state.data[element]}
            handleValue={this.handleValue}
            handler={this.state.handleTasks[this.state.id]}
          />))}
      <TaskResultText className="subtitle" text={this.state.text} />
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
