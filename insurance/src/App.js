import React, { Component } from 'react';
import './App.css';
import MButton from './components/Button';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Insurance</h1>
        </header>
        <MButton />
      </div>
    );
  }
}

export default App;
