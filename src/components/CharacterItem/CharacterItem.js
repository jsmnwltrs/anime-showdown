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
    deleteCharacter: PropTypes.func,
  }

  deleteEvent = (e) => {
    e.preventDefault();
    const { deleteCharacter, character } = this.props;
    deleteCharacter(character.id);
  }

  render() {
    const { character } = this.props;
    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{character.name}</CardTitle>
        <Button className='btn btn-danger' onClick={this.deleteEvent}>X</Button>
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
