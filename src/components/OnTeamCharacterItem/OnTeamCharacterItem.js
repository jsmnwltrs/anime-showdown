import React from 'react';
import {
  Card,
  CardText,
  CardBody,
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
      <Card className='mr-4'>
        <Button className='btn btn-danger' onClick={this.removeFromTeamEvent}>Remove from Team</Button>
        <img className="cardImage" src={onTeamCharacter.imageUrl} alt="Card img"/>
        <CardBody>
          <CardText>Class: {onTeamCharacter.class}</CardText>
          <CardText>Level: {onTeamCharacter.level}</CardText>
        </CardBody>
      </Card>
    </div>
    );
  }
}

export default OnTeamCharacterItem;
