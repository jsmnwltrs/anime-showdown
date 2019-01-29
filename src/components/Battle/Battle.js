import React from 'react';
import './Battle.scss';
import { Button } from 'reactstrap';
import Bosses from '../Bosses/Bosses';
import BattleTeam from '../BattleTeam/BattleTeam';
import bossRequests from '../../helpers/data/bossRequests';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';

class Battle extends React.Component {
  state = {
    battleBoss: {},
    bossHP: 0,
    battleTeam: [],
    teamHP: 0,
    maxTeamHP: 0,
    teamAP: 0,
  }

  componentDidMount() {
    const uid = authRequests.getCurrentUid();
    characterRequests.getOnTeamCharacters(uid)
      .then((battleTeam) => {
        this.setState({ battleTeam });
        let teamHP = 0;
        let teamAP = 0;
        battleTeam.forEach((character) => {
          teamHP += character.hitPoints;
          teamAP += character.attackPoints;
        });
        this.setState({ teamHP, teamAP, maxTeamHP: teamHP });
      })
      .catch(error => console.error('error on getSavedCharacters', error));
  }

  startBattle = (bossId) => {
    bossRequests.getSingleBoss(bossId)
      .then((res) => {
        const battleBoss = res.data;
        const bossHP = battleBoss.hitPoints;
        this.setState({ battleBoss });
        this.setState({ bossHP });
      })
      .catch(error => console.error('error on getSingleBoss', error));
  }

  attackBoss = () => {
    const {
      battleBoss,
      bossHP,
      teamAP,
      teamHP,
    } = this.state;
    const newBossHP = bossHP - teamAP;
    this.setState({ bossHP: newBossHP });
    const newTeamHP = teamHP - battleBoss.hitPoints;
    this.setState({ teamHP: newTeamHP });
  }

  render() {
    const {
      battleBoss,
      bossHP,
      battleTeam,
      teamHP,
      maxTeamHP,
    } = this.state;
    const battleTeamComponents = battleTeam.map(teamCharacter => (
      <BattleTeam
        showAlert={this.showAlert}
        key={teamCharacter.id}
        teamCharacter = {teamCharacter}
      />
    ));
    return (
      <div>
        <Bosses startBattle={this.startBattle} />
        <div className='bossBattle'>
          <h2>{battleBoss.name}</h2>
          <img src={battleBoss.imageUrl} alt="Card img"/>
          <p>Boss HP</p>
          <progress id="bossHitPoints" value={bossHP} max={battleBoss.hitPoints}></progress>
          <div className='d-flex flex-wrap'>{battleTeamComponents}</div>
          <p>Team HP</p>
          <progress id="teamHitPoints" value={teamHP} max={maxTeamHP}></progress>
          <Button onClick={this.attackBoss} className='btn btn-danger'>Attack!</Button>
        </div>
      </div>
    );
  }
}

export default Battle;
