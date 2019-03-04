import React from 'react';

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
    <div>
      {props.text}
    </div>);
};

const NestedText = (props) => {
  return (
    <div>
      {Object.keys(props.text).map((key, index) => (
        <div key={key}>
          {key} - {props.text[key]}
        </div>
      ))}
    </div>
  );
}

const firstTask = {
  "id": 1,
  "n": 50,
  "k": 7,
  "s": 500,
  "m": 0,
  "v": 3,
};

const secondTask = {
  "id": 2,
  "n": 50,
  "t": 30,
  "s": 200,
};

const thirdTask = {
  "id": 3,
  "k": 6,
  "t": 30,
  "s": 200,
};

const description = {
  "n": "количество символов в алфавите\n",
  "k":"длина пароля\n",
  "s": "скорость перебора паролей в секунду\n",
  "m": "число неправильно введённых паролей\n",
  "v": "пауза после неправильно введённых паролей в секунду\n",
  "t": "время перебора всех паролей (без пауз)",
};

export default class App extends React.Component {
  render() {
    return (
    <div className="wrapper">
      <Text className="title" text="Лабораторная работа №2" />
      <NestedText className="subtitle" text={description} />
      <Task givenTask={firstTask} />
      <Task givenTask={secondTask} />
      <Task givenTask={thirdTask} />
    </div>);
  }
}
