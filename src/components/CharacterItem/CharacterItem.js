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
import './CharacterItem.scss';


class CharacterItem extends React.Component {
  static propTypes = {
    character: characterShape,
    showAlert: PropTypes.func,
    levelUpCharacter: PropTypes.func,
    addToTeam: PropTypes.func,
  }

  levelUpClick = (e) => {
    const { levelUpCharacter } = this.props;
    const characterId = e.target.id;
    levelUpCharacter(characterId);
  }

  addToTeamEvent = (e) => {
    const { addToTeam } = this.props;
    const characterId = e.target.id;
    addToTeam(characterId);
  }

  render() {
    const { character, showAlert } = this.props;
    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{character.name}</CardTitle>
        <Button className='btn btn-danger' id={character.id} onClick={showAlert}>X</Button>
        <Button className='btn btn-success' id={character.id} onClick={this.levelUpClick}>Level Up!</Button>
        <Button className='btn btn-success' id={character.id} onClick={this.addToTeamEvent}>Add to Team!</Button>
        <img className="cardImage" src={character.imageUrl} alt="Card img"/>
        <CardBody>
          <CardSubtitle>Level: {character.level}</CardSubtitle>
          <CardText>AP: {character.attackPoints}</CardText>
          <CardText>HP: {character.hitPoints}</CardText>
        </CardBody>
      </Card>
    </div>
    );
  }
}

export default CharacterItem;
