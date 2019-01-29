import React from 'react';
import {
  Card,
  CardTitle,
} from 'reactstrap';
import bossShape from '../../helpers/props/bossShape';
import './BossItem.scss';


class LocationItem extends React.Component {
  static propTypes = {
    boss: bossShape,
  }

  render() {
    const { boss } = this.props;
    return (
      <div>
      <Card className='location mr-4'>
        <CardTitle>{boss.name}</CardTitle>
        <img className="cardImage" src={boss.imageUrl} alt="Card img"/>
      </Card>
    </div>
    );
  }
}

export default LocationItem;
