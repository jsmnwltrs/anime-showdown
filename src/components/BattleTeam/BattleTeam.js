import React from 'react';
import {
  Card,
  CardTitle,
} from 'reactstrap';
import characterShape from '../../helpers/props/characterShape';
import './BattleTeam.scss';


class BattleTeam extends React.Component {
  static propTypes = {
    teamCharacter: characterShape,
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
    const { teamCharacter } = this.props;
    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{teamCharacter.name}</CardTitle>
        <img className="cardImage" src={teamCharacter.imageUrl} alt="Card img"/>
      </Card>
    </div>
    );
  }
}

export default BattleTeam;
