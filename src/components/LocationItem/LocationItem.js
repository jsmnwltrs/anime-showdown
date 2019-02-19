import React from 'react';
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
      <div className=''>
      <div onClick={drawClickEvent} id={location.id} className='location mr-4'>
        <h3 className='locationName'>{location.name}</h3>
        <img className="locationImage" src={location.imageUrl} alt="Card img"/>
      </div>
    </div>
    );
  }
}

export default LocationItem;
