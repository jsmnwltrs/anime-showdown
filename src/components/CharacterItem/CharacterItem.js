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
    fullTeam: PropTypes.bool,
  }

  levelUpClick = () => {
    const { levelUpCharacter, character } = this.props;
    levelUpCharacter(character.id);
  }

  addToTeamEvent = () => {
    const { addToTeam, character } = this.props;
    addToTeam(character.id);
  }

  render() {
    const { character, showAlert, fullTeam } = this.props;
    const makeButton = () => {
      if (character.level === 10) {
        return <span></span>;
      }
      return (
        <Button className='btn btn-success' onClick={this.levelUpClick}>Level Up!</Button>
      );
    };

    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{character.name}</CardTitle>
        <Button className='btn btn-danger' id={character.id} onClick={showAlert}>X</Button>
        <div>{makeButton()}</div>
        <Button className='btn btn-success' disabled={fullTeam} onClick={this.addToTeamEvent}>Add to Team!</Button>
        <img className="cardImage" src={character.imageUrl} alt="Card img"/>
        <CardBody>
          <CardText>Class: {character.class}</CardText>
          <CardSubtitle>Level: {character.level}</CardSubtitle>
          <CardText>AP: {character.attackPoints}</CardText>
          <CardText>HP: {character.hitPoints}</CardText>
          <CardText>Crit Chance: {character.critChance}</CardText>
          <CardText>Heal Bonus: {character.healBonus}</CardText>
        </CardBody>
      </Card>
    </div>
    );
  }
}

export default CharacterItem;
