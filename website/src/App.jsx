import React from 'react';
import MyFirstReact from './test/myFirstReact';
import MyText from './test/MyText';

export default class App extends React.Component {



  render() {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-sm p-4 text-center">
          <h1 className="h3 mb-0">Mashariq WebChat</h1>
        </div>
        <MyFirstReact />
        <MyText myData="Hello World" isAdmin={true} />
        <MyText myData="Hello World" isAdmin={false} />
      </div>
    );
  }
}
