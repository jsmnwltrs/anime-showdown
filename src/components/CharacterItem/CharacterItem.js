import React from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from 'reactstrap';
import characterShape from '../../helpers/props/characterShape';
import './CharacterItem.scss';

class CharacterItem extends React.Component {
  static propTypes = {
    character: characterShape,
  }

  render() {
    const { character } = this.props;
    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{character.name}</CardTitle>
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
