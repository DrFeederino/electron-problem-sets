import React from 'react';

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
        onChange={e => props.handleValue(props.label, e.target.value, props.handler)}
        min="0"
      />
    </div>
  </div>
);

const Tasks = [
  {
    id: 0,
    data: {
      p: 10 ** (-4),
      v: 10 * 60 * 24,
      t: 5,
    },
    text: {
      description: 'Реализовать программу для генации  паролей. Должна формироваться случайная последовательность длины L из алфавита A.',
      lowerBound: '',
      alphabet: '',
      possibilities: '', // unlimited
      randomlyGeneratedPassword: '',
    },
  },
];

const description = {
  P: 'вероятность подбора пароля.\n',
  V: 'скорость перебора пароля.\n',
  T: 'максимальный срок действия пароля.\n',
  L: 'длина пароля.\n',
  'S = A(L)': 'число всевозможных паролей длины L.\n',
  'S*': 'нижняя граница числа всевозможных паролей.',
};

class TaskApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      data: props.data,
      text: props.text,
      ascii: {
        A: 97,
        Z: 122,
      },
      handleTasks: {
        0: () => {
          const { p, v, t } = this.state.data;
          let stepOne = Math.ceil((v * t) / p);
          let stepTwo = this.calculateL(stepOne);
          let stepThree = this.calculateResult(stepTwo);
          const text = this.state.text;
          text.lowerBound = `Нижняя граница S* : [V×T/P] = ${stepOne} паролей в сутки.`;
          text.alphabet = `A = ${this.state.ascii.Z - this.state.ascii.A + 1} (малые символы английского алфавита).`;
          text.possibilities = `S* ≤ S = AL, L = ${stepTwo}.`;
          text.randomlyGeneratedPassword = `Случайно сгенерированный пароль: T = t×v/m = ${stepThree}.`;
          this.setState({
            text: text,
          });
        },
      },
    };
    this.handleValue = this.handleValue.bind(this);
    this.calculateL = this.calculateL.bind(this);
    this.calculateResult = this.calculateResult.bind(this);
  }

  calculateResult(stepTwo) {
    let str = '';
    const { A, Z } = this.state.ascii;
    for (let i = 0, randomASCII = 0; i < stepTwo; i++) {
      randomASCII = Math.floor((Math.random() * (Z - A) + A));
      str += String.fromCharCode(randomASCII);
    }
    return str;
  }

  calculateL(stepOne) {
    const { A, Z } = this.state.ascii;
    const length = Z - A + 1;
    for (let i = 0, res = 0; i < stepOne; i++) {
      if (stepOne <= length ** i) {
        res = i - 1;
        return res;
      }
    }
  }

  handleValue(target, value, handler) {
    const data = this.state.data;
    data[target] = Number(value);
    this.setState({
      data: data,
    });
    handler();
  }

  render() {
    const formulas = Object.values(this.state.text).slice(1);
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
        <Description class="description" text={description} />
        {Object.keys(Tasks).map(taskID => (
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
