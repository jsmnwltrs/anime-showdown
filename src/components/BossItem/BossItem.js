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
      <Card className='boss mr-4'>
        <CardTitle>{boss.name}</CardTitle>
        <img className="boss-image" src={boss.imageUrl} alt="Card img"/>
        <Button className='btn btn-danger' onClick={this.startBattleClick}>Start Battle!</Button>
      </Card>
    </div>
    );
  }
}

export default LocationItem;
