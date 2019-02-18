import React from 'react';
import {
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import characterShape from '../../helpers/props/characterShape';
import healModifierData from '../../helpers/data/healModifierData';
import './BattleTeam.scss';


class BattleTeam extends React.Component {
  state = {
    disableHeal: false,
  }

  static propTypes = {
    teamCharacter: characterShape,
    teamHP: PropTypes.number,
    maxTeamHP: PropTypes.number,
  }

  healTeam = () => {
    const {
      teamCharacter,
      teamHP,
      maxTeamHP,
      passHealedHP,
    } = this.props;
    this.setState({ disableHeal: true });
    const random = Math.floor((Math.random() * 5) + 1);
    let teamHeal = teamCharacter.healBonus * healModifierData[random].healMultiplier;
    teamHeal = Math.round(teamHeal);
    const newTeamHP = teamHeal + teamHP;
    if (newTeamHP > maxTeamHP) {
      passHealedHP(maxTeamHP);
    } else {
      passHealedHP(newTeamHP);
    }
  }

  render() {
    const { disableHeal } = this.state;
    const { teamCharacter } = this.props;
    const makeHealButton = () => {
      if (teamCharacter.class === 'Healer') {
        return (
         <Button
            onClick={this.healTeam}
            disabled={disableHeal}
            className='btn btn-success healButton'>
            Heal!
          </Button>
        );
      }
      return <span></span>;
    };
    return (
      <div className='m-1'>
        <img className="teamImage" src={teamCharacter.imageUrl} alt="Card img"/>
        <div className='mt-1'>{makeHealButton()}</div>
    </div>
    );
  }
}

export default BattleTeam;
