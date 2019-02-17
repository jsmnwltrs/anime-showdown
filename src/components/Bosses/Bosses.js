import React from 'react';
import './Bosses.scss';
import PropTypes from 'prop-types';
import bossRequests from '../../helpers/data/bossRequests';
import BossItem from '../BossItem/BossItem';

class Bosses extends React.Component {
  state = {
    bosses: [],
    levelUpTokenRewards: 0,
    characterTokenRewards: 0,
  }

  static propTypes = {
    startBattle: PropTypes.func,
    startBattleBool: PropTypes.bool,
  }

  startBattleEvent = (bossId) => {
    this.props.startBattle(bossId);
    this.setState({ bossHeader: '', bosses: [] });
  }

  componentDidMount() {
    bossRequests.getBosses()
      .then((bosses) => {
        const sortedBosses = bosses.sort((a, b) => a.level - b.level);
        this.setState({ bosses: sortedBosses });
      })
      .catch(error => console.error('error on getBosses', error));
  }

  render() {
    const { bosses } = this.state;
    const bossItemComponents = bosses.map(boss => (
      <BossItem
        boss={boss}
        key={boss.id}
        startBattleEvent={this.startBattleEvent}
      />
    ));
    return (
      <div className='bosses'>
      <div className='d-flex flex-wrap justify-content-center'>{bossItemComponents}</div>
      </div>
    );
  }
}

export default Bosses;
