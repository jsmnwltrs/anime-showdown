import React from 'react';
import {
  Card,
  CardText,
  CardTitle,
  CardSubtitle,
  Button,
  Col,
  Row,
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

  showDeleteAlert = () => {
    const { showAlert, character } = this.props;
    showAlert(character.id);
  }

  addToTeamEvent = () => {
    const { addToTeam, character } = this.props;
    addToTeam(character.id);
  }

  render() {
    const { character, fullTeam } = this.props;
    const makeButton = () => {
      if (character.level === 10) {
        return <span></span>;
      }
      return (
        <Button className='btn' color="primary" title='level up' onClick={this.levelUpClick}><i className="far fa-arrow-alt-circle-up fa-2x"></i></Button>
      );
    };

    return (
      <div>
      <Card className='ml-2 mr-2 mt-3 mb-3'>
        <CardTitle><strong>{character.name}</strong></CardTitle>
        <div className='buttons d-flex justify-content-between mb-1'>
          <Button title='add to team' className='btn btn-success ml-1' disabled={fullTeam} onClick={this.addToTeamEvent}><i className="fas fa-users fa-2x"></i></Button>
          <div>{makeButton()}</div>
          <Button className='btn btn-danger mr-1' title='delete' id={character.id} onClick={this.showDeleteAlert}><i className="fas fa-trash-alt fa-2x"></i></Button>
        </div>
        <img className="cardImage" src={character.imageUrl} alt="Card img"/>
          <CardSubtitle className='mt-1'>Class: {character.class}</CardSubtitle>
          <CardSubtitle className='mt-1 mb-1'>Level: {character.level}</CardSubtitle>
          <Row>
            <Col><CardText title='hit points'><i className="fas fa-heart"></i> : {character.hitPoints}</CardText></Col>
            <Col><CardText title='heal tokens'><i className="fas fa-briefcase-medical"></i> : {character.healTokens}</CardText></Col>
          </Row>
          <Row>
            <Col><CardText title='attack points'><i className="fas fa-dumbbell"></i> : {character.attackPoints}</CardText></Col>
            <Col><CardText title='crit chance'><i className="fas fa-skull"></i> : {character.critChance}%</CardText></Col>
          </Row>
      </Card>
    </div>
    );
  }
}

export default CharacterItem;
