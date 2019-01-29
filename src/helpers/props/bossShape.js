import PropTypes from 'prop-types';

const bossShape = PropTypes.shape({
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  hitPoints: PropTypes.number,
  attackPoints: PropTypes.number,
  level: PropTypes.number,
  characterTokenReward: PropTypes.number,
  levelTokenReward: PropTypes.number,
});

export default bossShape;
