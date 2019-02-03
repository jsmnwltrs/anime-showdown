import PropTypes from 'prop-types';

const characterShape = PropTypes.shape({
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  hitPoints: PropTypes.number,
  attackPoints: PropTypes.number,
  level: PropTypes.number,
  onTeam: PropTypes.bool,
  uid: PropTypes.string,
  critChance: PropTypes.number,
  healBonus: PropTypes.number,
  healTokens: PropTypes.number,
  class: PropTypes.string,
});

export default characterShape;
