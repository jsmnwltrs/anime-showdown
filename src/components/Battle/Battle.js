import React from 'react';
import './Battle.scss';
import Bosses from '../Bosses/Bosses';

class Battle extends React.Component {
  render() {
    return (
      <div>
        <h2>Choose a Boss!</h2>
        <Bosses />
      </div>
    );
  }
}

export default Battle;
