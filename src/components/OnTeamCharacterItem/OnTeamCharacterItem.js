import React from 'react';
import {
  Card,
  CardText,
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import characterShape from '../../helpers/props/characterShape';
import './OnTeamCharacterItem.scss';


class OnTeamCharacterItem extends React.Component {
  static propTypes = {
    onTeamCharacter: characterShape,
    removeFromTeam: PropTypes.func,
  }

  removeFromTeamEvent = () => {
    const { removeFromTeam, onTeamCharacter } = this.props;
    removeFromTeam(onTeamCharacter.id);
  }

  render() {
    const { onTeamCharacter } = this.props;
    return (
      <div>
      <Card className='m-2'>
        <Button className='btn btn-danger' title='remove from team' onClick={this.removeFromTeamEvent}><i className="fas fa-user-slash fa-2x"></i></Button>
        <img className="cardImage" src={onTeamCharacter.imageUrl} alt="Card img"/>
        <CardText>Level: {onTeamCharacter.level}</CardText>
      </Card>
    </div>
    );
  }
}

export default OnTeamCharacterItem;
