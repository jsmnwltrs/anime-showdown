import React from 'react';
import {
  Card,
  CardTitle,
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import characterShape from '../../helpers/props/characterShape';
import healModifierData from '../../helpers/data/healModifierData';
import './BattleTeam.scss';


class BattleTeam extends React.Component {
  state = {
    disableHeal: false,
    healTokens: 0,
  }

  static propTypes = {
    teamCharacter: characterShape,
    teamHP: PropTypes.number,
    maxTeamHP: PropTypes.number,
  }

  componentDidMount() {
    const { teamCharacter } = this.props;
    const healTokenAmount = teamCharacter.healTokens;
    this.setState({ healTokens: healTokenAmount });
  }

  levelUpClick = () => {
    const { levelUpCharacter, character } = this.props;
    levelUpCharacter(character.id);
  }

  addToTeamEvent = () => {
    const { addToTeam, character } = this.props;
    addToTeam(character.id);
  }

  healTeam = () => {
    const { healTokens } = this.state;
    const {
      teamCharacter,
      teamHP,
      maxTeamHP,
      passHealedHP,
    } = this.props;
    const newHealTokenAmount = healTokens - 1;
    this.setState({ healTokens: newHealTokenAmount });
    if (newHealTokenAmount === 0) {
      this.setState({ disableHeal: true });
    }
    const random = Math.floor((Math.random() * 5) + 1);
    const teamHeal = teamCharacter.healBonus * healModifierData[random].healMultiplier;
    const newTeamHP = teamHeal + teamHP;
    if (newTeamHP > maxTeamHP) {
      passHealedHP(maxTeamHP);
    } else {
      passHealedHP(newTeamHP);
    }
  }

  render() {
    const { disableHeal, healTokens } = this.state;
    const { teamCharacter } = this.props;
    const makeHealButton = () => {
      if (teamCharacter.class === 'Healer') {
        return (
         <Button
            onClick={this.healTeam}
            disabled={disableHeal}
            className='btn btn-success'>
            Heal! <span>{healTokens}</span>
          </Button>
        );
      }
      return <span></span>;
    };
    return (
      <div>
      <Card className='mr-4'>
        <CardTitle>{teamCharacter.name}</CardTitle>
        <img className="cardImage" src={teamCharacter.imageUrl} alt="Card img"/>
        <div>{makeHealButton()}</div>
      </Card>
    </div>
    );
  }
}

export default BattleTeam;
