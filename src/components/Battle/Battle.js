import React from 'react';
import './Battle.scss';
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
  }

  componentDidMount() {
    const uid = authRequests.getCurrentUid();
    characterRequests.getOnTeamCharacters(uid)
      .then((battleTeam) => {
        this.setState({ battleTeam });
        let teamHP = 0;
        battleTeam.forEach((character) => {
          teamHP += character.hitPoints;
        });
        this.setState({ teamHP });
        this.setState({ maxTeamHP: teamHP });
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
        </div>
      </div>
    );
  }
}

export default Battle;
