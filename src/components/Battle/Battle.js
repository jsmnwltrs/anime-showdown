import React from 'react';
import './Battle.scss';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import Bosses from '../Bosses/Bosses';
import BattleTeam from '../BattleTeam/BattleTeam';
import bossRequests from '../../helpers/data/bossRequests';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      battleBoss: {},
      bossHP: 0,
      battleTeam: [],
      teamHP: 0,
      maxTeamHP: 0,
      teamAP: 0,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
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
    let newTeamHP = 0;
    const newBossHP = bossHP - teamAP;
    this.setState({ bossHP: newBossHP });
    if (newBossHP > 0) {
      newTeamHP = teamHP - battleBoss.hitPoints;
      this.setState({ teamHP: newTeamHP });
    } else if (newBossHP <= 0) {
      this.setState({ modal: true });
    }
    if (newTeamHP <= 0) {
      this.setState({ modal: true });
    }
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

    const makeModal = () => {
      if (bossHP <= 0) {
        return (
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>You Won!</ModalHeader>
            <ModalBody>
              Here are your rewards!
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle} tag={RRNavLink} to='/characters'>OK</Button>
            </ModalFooter>
          </Modal>
        );
      }
      if (teamHP <= 0) {
        return (
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>You Lost!</ModalHeader>
            <ModalBody>
              You get no rewards.
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle} tag={RRNavLink} to='/characters'>OK</Button>
            </ModalFooter>
          </Modal>
        );
      }
      return <div></div>;
    };

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
          <div>{makeModal()}</div>
        </div>
      </div>
    );
  }
}

export default Battle;
