import React from 'react';
import {
  Card,
  CardTitle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import locationShape from '../../helpers/props/locationShape';
import './LocationItem.scss';


class LocationItem extends React.Component {
  static propTypes = {
    location: locationShape,
    drawClickEvent: PropTypes.func,
  }

  render() {
    const { location, drawClickEvent } = this.props;
    return (
      <div>
      <Card onClick={drawClickEvent} id={location.id} className='location mr-4'>
        <CardTitle>{location.name}</CardTitle>
        <img className="cardImage" src={location.imageUrl} alt="Card img"/>
      </Card>
    </div>
    );
  }
}

export default LocationItem;
