import React from 'react';
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
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

  removeFromTeamEvent = (e) => {
    const { removeFromTeam } = this.props;
    const characterId = e.target.id;
    removeFromTeam(characterId);
  }

  render() {
    const { onTeamCharacter } = this.props;
    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{onTeamCharacter.name}</CardTitle>
        <Button className='btn btn-danger' id={onTeamCharacter.id} onClick={this.removeFromTeamEvent}>Remove from Team</Button>
        <img className="cardImage" src={onTeamCharacter.imageUrl} alt="Card img"/>
        <CardBody>
          <CardSubtitle>Level: {onTeamCharacter.level}</CardSubtitle>
          <CardText>AP: {onTeamCharacter.attackPoints}</CardText>
          <CardText>HP: {onTeamCharacter.hitPoints}</CardText>
        </CardBody>
      </Card>
    </div>
    );
  }
}

export default OnTeamCharacterItem;
