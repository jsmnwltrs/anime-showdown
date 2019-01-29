import React from 'react';
import './Bosses.scss';
import bossRequests from '../../helpers/data/bossRequests';
import BossItem from '../BossItem/BossItem';

class Bosses extends React.Component {
  state = {
    bosses: [],
  }

  componentDidMount() {
    bossRequests.getBosses()
      .then((bosses) => {
        this.setState({ bosses });
      })
      .catch(error => console.error('error on getBosses', error));
  }

  render() {
    const { bosses } = this.state;
    const bossItemComponents = bosses.map(boss => (
      <BossItem
        boss={boss}
        key={boss.id}
      />
    ));
    return (
      <div className='bosses'>
      <div className='d-flex flex-wrap'>{bossItemComponents}</div>
      </div>
    );
  }
}

export default Bosses;
