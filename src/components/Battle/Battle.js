import React from 'react';
import './Battle.scss';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import Bosses from '../Bosses/Bosses';
import BattleTeam from '../BattleTeam/BattleTeam';
import bossRequests from '../../helpers/data/bossRequests';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';
import userRequests from '../../helpers/data/userRequests';

class Battle extends React.Component {
  static propTypes = {
    setLevelTokens: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      startBattle: false,
      battleBoss: {},
      bossHP: 0,
      battleTeam: [],
      teamHP: 0,
      maxTeamHP: 0,
      teamAP: 0,
      currentLevelUpTokens: 0,
      currentCharacterTokens: 0,
      levelUpTokenRewards: 0,
      characterTokenRewards: 0,
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
    userRequests.getFirebaseUserId(uid).then((firebaseId) => {
      userRequests.getUserObject(firebaseId)
        .then((userObject) => {
          const currentLevelUpTokens = userObject.data.levelUpTokens;
          const currentCharacterTokens = userObject.data.characterTokens;
          this.setState({ currentLevelUpTokens, currentCharacterTokens });
        })
        .catch(error => console.error('error on getUserObject', error));
    }).catch(error => console.error('error on getFirebaseUserId', error));
  }

  startBattle = (bossId) => {
    bossRequests.getSingleBoss(bossId)
      .then((res) => {
        const battleBoss = res.data;
        const bossHP = battleBoss.hitPoints;
        const levelUpTokenRewards = battleBoss.levelTokenReward;
        const characterTokenRewards = battleBoss.characterTokenReward;
        this.setState({
          battleBoss,
          bossHP,
          characterTokenRewards,
          levelUpTokenRewards,
          startBattle: true,
        });
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
      this.addRewards();
    }
    if (newTeamHP <= 0) {
      this.setState({ modal: true });
    }
  }

  addRewards = () => {
    const {
      levelUpTokenRewards,
      currentLevelUpTokens,
      currentCharacterTokens,
      characterTokenRewards,
    } = this.state;
    const { setLevelTokens, setCharacterTokens } = this.props;
    const newLevelTokenValue = currentLevelUpTokens + levelUpTokenRewards;
    const newCharacterTokenValue = currentCharacterTokens + characterTokenRewards;
    const uid = authRequests.getCurrentUid();
    userRequests.getFirebaseUserId(uid).then((firebaseId) => {
      userRequests.patchLevelToken(firebaseId, newLevelTokenValue)
        .then(() => {
          setLevelTokens(newLevelTokenValue);
        })
        .catch(error => console.error('error on patchLevelToken', error));
      userRequests.patchCharacterToken(firebaseId, newCharacterTokenValue)
        .then(() => {
          setCharacterTokens(newCharacterTokenValue);
        })
        .catch(error => console.error('error on patchCharacterToken', error));
    }).catch(error => console.error('erro ron getFirebaseUserId', error));
  }

  render() {
    const {
      battleBoss,
      bossHP,
      battleTeam,
      teamHP,
      maxTeamHP,
      levelUpTokenRewards,
      characterTokenRewards,
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
          <Modal
            isOpen={this.state.modal}
            className={this.props.className}
            backdrop={false}
          >
            <ModalHeader>You Won!</ModalHeader>
            <ModalBody>
              Here are your rewards!
              <p>Level Up Tokens: {levelUpTokenRewards}</p>
              <p>Character Tokens: {characterTokenRewards}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" tag={RRNavLink} to='/characters'>OK</Button>
            </ModalFooter>
          </Modal>
        );
      }
      if (teamHP <= 0) {
        return (
          <Modal
            isOpen={this.state.modal}
            className={this.props.className}
            backdrop={false}
          >
            <ModalHeader>You Lost!</ModalHeader>
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

    const makeBattle = () => {
      if (this.state.startBattle) {
        return (
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
        );
      }
      return <div></div>;
    };

    return (
      <div>
        <Bosses startBattle={this.startBattle} />
        <div>{makeBattle()}</div>
        <div>{makeModal()}</div>
      </div>
    );
  }
}

export default Battle;
