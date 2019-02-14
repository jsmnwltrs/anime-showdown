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
import attackModifierData from '../../helpers/data/attackModifierData';

const backgroundImage1 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/arenabackground.jpg?alt=media&token=974afe8c-48e8-4557-8188-cab74373b9fb';
const backgroundImage2 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/CaveBackground.jpg?alt=media&token=657c7ec4-0feb-49ef-8e58-454465fa5039';
const backgroundImage3 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/cityBackground.jpg?alt=media&token=0ee865bc-cf81-445d-831b-61a5d269178d';
const backgroundImage4 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/crocodileBackground.jpg?alt=media&token=a2e8933a-5ddd-422e-a8e5-6dcb1d9ef9ef';
const backgroundImage5 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/background.jpg?alt=media&token=a98d1540-f28e-4af2-a7ef-384a9b42bef8';
const backgroundImage6 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/jirenBackground.jpg?alt=media&token=2f31a8cb-96ce-40b8-b0d5-ff610b5babc6';
const backgroundImage7 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/namekback.png?alt=media&token=bbf77652-5394-4f5b-bf7c-6071dbeb3b80';
const backgroundImage8 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/swampBackground.jpg?alt=media&token=a6656138-7b5a-407f-bdf7-f70ee07e05a5';

class Battle extends React.Component {
  static propTypes = {
    setLevelTokens: PropTypes.func,
    hideNavbar: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      backgroundModal: false,
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
      teamCritChance: 0,
      backgroundUrl: '',
    };

    this.toggleBackground = this.toggle.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggleBackground() {
    this.setState({
      backgroundModal: !this.state.backgroundModal,
    });
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
        let teamCritChance = 0;
        battleTeam.forEach((character) => {
          teamHP += character.hitPoints;
          teamAP += character.attackPoints;
          teamCritChance += character.critChance;
        });
        this.setState({
          teamHP,
          teamAP,
          maxTeamHP: teamHP,
          teamCritChance,
        });
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
          backgroundModal: true,
          backgroundUrl: '',
        });
      })
      .catch(error => console.error('error on getSingleBoss', error));
  }

  passHealedHP = (healedHP) => {
    this.setState({ teamHP: healedHP });
  }

  attackBoss = () => {
    const {
      battleBoss,
      bossHP,
      teamAP,
      teamHP,
      teamCritChance,
    } = this.state;
    let newTeamHP = 0;
    let newBossHP = 0;
    let teamAttack = 0;
    const randomCrit = Math.floor((Math.random() * 100) + 1);
    if (teamCritChance >= randomCrit) {
      teamAttack = teamAP * attackModifierData[5].attackMultiplier;
      newBossHP = bossHP - teamAttack;
    } else {
      const randomizer = Math.floor((Math.random() * 4) + 1);
      teamAttack = teamAP * attackModifierData[randomizer].attackMultiplier;
      newBossHP = bossHP - teamAttack;
    }
    this.setState({ bossHP: newBossHP });
    if (newBossHP > 0) {
      const random = Math.floor((Math.random() * 5) + 1);
      const bossAttack = battleBoss.attackPoints * attackModifierData[random].attackMultiplier;
      newTeamHP = teamHP - bossAttack;
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

  changeBackground = (e) => {
    const newBackgroundUrl = e.target.id;
    this.setState({
      backgroundUrl: newBackgroundUrl,
      startBattle: true,
      backgroundModal: false,
    });
    this.props.hideNavbar();
  }

  reload = () => {
    window.location.reload();
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
      backgroundUrl,
    } = this.state;
    document.body.style.backgroundImage = 'url(' + backgroundUrl + ')';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.maxHeight = '700px';
    document.body.style.maxWidth = '1800px';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    const battleTeamComponents = battleTeam.map(teamCharacter => (
      <BattleTeam
        showAlert={this.showAlert}
        key={teamCharacter.id}
        teamCharacter = {teamCharacter}
        teamHP = {teamHP}
        maxTeamHP = {maxTeamHP}
        passHealedHP = {this.passHealedHP}
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
              <Button onClick={this.reload} color="secondary" tag={RRNavLink} to='/characters'>OK</Button>
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
              <Button color="secondary" onClick={this.reload} tag={RRNavLink} to='/characters'>OK</Button>
            </ModalFooter>
          </Modal>
        );
      }
      return <div></div>;
    };

    const makeBackgroundModal = () => (
      <Modal
      isOpen={this.state.backgroundModal}
      className={this.props.className}
      backdrop={false}
      >
        <ModalHeader>Choose Location</ModalHeader>
        <ModalBody>
          <img onClick={this.changeBackground} id={backgroundImage1} className='backImage' src={backgroundImage1} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage2} className='backImage' src={backgroundImage2} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage3} className='backImage' src={backgroundImage3} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage4} className='backImage' src={backgroundImage4} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage5} className='backImage' src={backgroundImage5} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage6} className='backImage' src={backgroundImage6} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage7} className='backImage' src={backgroundImage7} alt='background img'/>
          <img onClick={this.changeBackground} id={backgroundImage8} className='backImage' src={backgroundImage8} alt='background img'/>
        </ModalBody>
    </Modal>
    );

    const makeBattle = () => {
      if (this.state.startBattle) {
        return (
          <div className='bossBattle'>
          <img className='boss-image' src={battleBoss.imageUrl} alt="Card img"/>
          <p>Boss HP: {bossHP}/{battleBoss.hitPoints}</p>
          <progress id="bossHitPoints" value={bossHP} max={battleBoss.hitPoints}></progress>
          <div className='d-flex flex-wrap'>{battleTeamComponents}</div>
          <p>Team HP: {teamHP}/{maxTeamHP}</p>
          <progress id="teamHitPoints" value={teamHP} max={maxTeamHP}></progress>
          <Button onClick={this.attackBoss} className='btn btn-danger'>Attack!</Button>
        </div>
        );
      }
      return <div></div>;
    };

    return (
      <div>
        <Bosses startBattleBool={this.state.startBattle} startBattle={this.startBattle} />
        <div>{makeBattle()}</div>
        <div>{makeModal()}</div>
        <div>{makeBackgroundModal()}</div>
      </div>
    );
  }
}

export default Battle;
