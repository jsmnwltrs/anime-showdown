import React, { Component } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
       <Button className='btn btn-success'>
         Help
       </Button>
       <button className='btn btn-dark'>Hello</button>
      </div>
    );
  }
}

export default App;
