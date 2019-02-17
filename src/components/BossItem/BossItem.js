import React from 'react';
import {
  Card,
  CardTitle,
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import bossShape from '../../helpers/props/bossShape';
import './BossItem.scss';


class LocationItem extends React.Component {
  static propTypes = {
    boss: bossShape,
    startBattleEvent: PropTypes.func,
  }

  startBattleClick = () => {
    const { boss, startBattleEvent } = this.props;
    startBattleEvent(boss.id);
  }

  render() {
    const { boss } = this.props;
    return (
      <div>
      <Card className='boss m-4 bg-dark'>
        <CardTitle className='bossName'>{boss.name}</CardTitle>
        <img className="boss-image" src={boss.imageUrl} alt="Card img"/>
        <p>Level: {boss.level}</p>
        <Button className='btn btn-danger' onClick={this.startBattleClick}>Start Battle!</Button>
      </Card>
    </div>
    );
  }
}

export default LocationItem;
