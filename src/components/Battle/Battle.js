import React from 'react';
import './Battle.scss';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  CardTitle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Bosses from '../Bosses/Bosses';
import BattleTeam from '../BattleTeam/BattleTeam';
import bossRequests from '../../helpers/data/bossRequests';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';
import userRequests from '../../helpers/data/userRequests';
import attackModifierData from '../../helpers/data/attackModifierData';
import attack from '../../helpers/sound/smack.wav';
import battleSound from '../../helpers/sound/battleMusic.wav';

const backgroundImage1 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/arenabackground.jpg?alt=media&token=974afe8c-48e8-4557-8188-cab74373b9fb';
const backgroundImage2 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/CaveBackground.jpg?alt=media&token=657c7ec4-0feb-49ef-8e58-454465fa5039';
const backgroundImage3 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/cityBackground.jpg?alt=media&token=0ee865bc-cf81-445d-831b-61a5d269178d';
const backgroundImage4 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/snowback.jpg?alt=media&token=4d18742e-a49c-43ea-bd4a-6f69fc27dbfb';
const backgroundImage5 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/background.jpg?alt=media&token=a98d1540-f28e-4af2-a7ef-384a9b42bef8';
const backgroundImage6 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/jirenBackground.jpg?alt=media&token=2f31a8cb-96ce-40b8-b0d5-ff610b5babc6';
const backgroundImage7 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/namekback.png?alt=media&token=bbf77652-5394-4f5b-bf7c-6071dbeb3b80';
const backgroundImage8 = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/swampBackground.jpg?alt=media&token=a6656138-7b5a-407f-bdf7-f70ee07e05a5';
const defaultUrl = 'https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/redback1.png?alt=media&token=c0dcc8fc-a09c-4164-b34f-16de54990649';

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
      teamCritBonus: 0,
      backgroundUrl: defaultUrl,
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
        let teamCritBonus = 0;
        battleTeam.forEach((character) => {
          teamHP += character.hitPoints;
          teamAP += character.attackPoints;
          teamCritChance += character.critChance;
          teamCritBonus += character.critBonus;
        });
        this.setState({
          teamHP,
          teamAP,
          maxTeamHP: teamHP,
          teamCritChance,
          teamCritBonus,
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
      teamCritBonus,
    } = this.state;
    let newTeamHP = 0;
    let newBossHP = 0;
    let teamAttack = 0;
    const randomCrit = Math.floor((Math.random() * 100) + 1);
    if (teamCritChance >= randomCrit) {
      const teamCritModifier = teamCritBonus + attackModifierData[4].attackMultiplier;
      teamAttack = teamAP * teamCritModifier;
      newBossHP = Math.round(bossHP - teamAttack);
    } else {
      const randomizer = Math.floor((Math.random() * 3) + 1);
      teamAttack = teamAP * attackModifierData[randomizer].attackMultiplier;
      newBossHP = Math.round(bossHP - teamAttack);
    }
    this.setState({ bossHP: newBossHP });
    if (newBossHP > 0) {
      const random = Math.floor((Math.random() * 4) + 1);
      const bossAttack = battleBoss.attackPoints * attackModifierData[random].attackMultiplier;
      newTeamHP = Math.round(teamHP - bossAttack);
      this.setState({ teamHP: newTeamHP });
    } else if (newBossHP <= 0) {
      this.setState({ modal: true });
      this.addRewards();
    }
    if (newTeamHP <= 0) {
      this.setState({ modal: true });
    }
    const attackSound = new Audio(attack);
    attackSound.play();
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
    }).catch(error => console.error('error on getFirebaseUserId', error));
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
    this.setState({ backgroundUrl: '' });
    window.location.assign('https://anime-showdown.firebaseapp.com/characters');
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
            backdrop={false}
          >
            <ModalHeader className='d-flex justify-content-center winHeader'>You Won!</ModalHeader>
            <ModalBody>
              <strong>
              <p className='d-flex justify-content-center'>Here are your rewards!</p>
              <p className='d-flex justify-content-center'>Level Up Tokens: {levelUpTokenRewards}</p>
              <p className='d-flex justify-content-center'>Character Tokens: {characterTokenRewards}</p>
              </strong>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-center'>
              <Button onClick={this.reload} className="btn-success ok">OK</Button>
            </ModalFooter>
          </Modal>
        );
      }
      if (teamHP <= 0) {
        return (
          <Modal
            isOpen={this.state.modal}
            className='loseModal'
            backdrop={false}
          >
            <ModalHeader className='d-flex justify-content-center'>You Lost!</ModalHeader>
            <ModalBody className='d-flex justify-content-center'>
            <strong>
              <p>You get no rewards.</p>
            </strong>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-center'>
              <Button className="btn-danger ok" onClick={this.reload}>OK</Button>
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
          <Row>
            <Col className='col-5 mt-3 teamCol'>
              <div className='d-flex flex-wrap battleTeam'>{battleTeamComponents}</div>
            </Col>
            <Col className='col-4'></Col>
            <Col className='col-3 bossCol'>
              <img className='bossImage' src={battleBoss.imageUrl} alt="Card img"/>
            </Col>
          </Row>
          <Row className='battleHP ml-5 d-flex justify-content-between'>
            <Card className='teamHPCol bg-dark'>
              <CardTitle>Team HP: {teamHP}/{maxTeamHP}</CardTitle>
              <progress className='m-2' id="teamHitPoints" value={teamHP} max={maxTeamHP}></progress>
            </Card>
            <Button onClick={this.attackBoss} id=' attackButton' className='btn-danger attackButton'>Attack!</Button>
           <Card className='bossHPCol bg-dark ml-5'>
            <CardTitle className='bossHP'>Boss HP: {bossHP}/{battleBoss.hitPoints}</CardTitle>
            <progress className='m-2' id="bossHitPoints" value={bossHP} max={battleBoss.hitPoints}></progress>
          </Card>
          </Row>
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
        <div>
          <audio ref='audio_tag' src={battleSound} loop autoPlay/>
        </div>
      </div>
    );
  }
}

export default Battle;
