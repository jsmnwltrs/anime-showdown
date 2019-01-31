import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import './Characters.scss';
import levelUpData from '../../helpers/data/levelUpData';
import OnTeamCharacterItem from '../OnTeamCharacterItem/OnTeamCharacterItem';
import CharacterItem from '../CharacterItem/CharacterItem';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';
import userRequests from '../../helpers/data/userRequests';

const defaultCharacter = {
  name: '',
  imageUrl: '',
  hitPoints: 0,
  attackPoints: 0,
  level: 0,
  onTeam: false,
  uid: '',
  fullTeam: false,
};

class Characters extends React.Component {
  static propTypes = {
    setLevelTokens: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      tokenModal: false,
      characters: [],
      onTeamCharacters: [],
      characterId: '',
      levelUpCharacter: defaultCharacter,
      levelUpToken: 0,
      noTeam: true,
    };

    this.toggle = this.toggle.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  modalToggle() {
    this.setState({
      tokenModal: !this.state.tokenModal,
    });
  }

  componentDidMount() {
    this.setState({ levelUpCharacter: defaultCharacter, characterId: '' });
    const uid = authRequests.getCurrentUid();
    userRequests.getFirebaseUserId(uid).then((firebaseId) => {
      userRequests.getUserObject(firebaseId)
        .then((user) => {
          const levelUpToken = user.data.levelUpTokens;
          this.setState({ levelUpToken });
        })
        .catch(error => console.error('error on getUserObject', error));
    }).catch(error => console.error('error on getFirebaseUserId', error));
    characterRequests.getSavedCharacters(uid)
      .then((characters) => {
        const charactersNotOnTeam = characters.filter(x => x.onTeam === false);
        this.setState({ characters: charactersNotOnTeam });
        const charactersOnTeam = characters.filter(x => x.onTeam === true);
        this.setState({ onTeamCharacters: charactersOnTeam });
        if (this.state.onTeamCharacters.length === 0) {
          this.setState({ noTeam: true });
        } else if (this.state.onTeamCharacters.length !== 0) {
          this.setState({ noTeam: false });
        }
        if (this.state.onTeamCharacters.length === 4) {
          this.setState({ fullTeam: true });
        }
      }).catch(error => console.error('error with getSavedCharacters', error));
  }

showAlert = (e) => {
  e.preventDefault();
  this.setState({ modal: true });
  const characterId = e.target.id;
  this.setState({ characterId });
}

hideAlert = (e) => {
  e.preventDefault();
  this.setState({ modal: false });
  this.setState({ characterId: '' });
}

  deleteCharacter = () => {
    const { characterId } = this.state;
    characterRequests.deleteSavedCharacter(characterId)
      .then(() => {
        this.setState({ characterId: '' });
        this.setState({ modal: false });
        const uid = authRequests.getCurrentUid();
        characterRequests.getSavedCharacters(uid)
          .then((characters) => {
            const charactersNotOnTeam = characters.filter(x => x.onTeam === false);
            this.setState({ characters: charactersNotOnTeam });
            const charactersOnTeam = characters.filter(x => x.onTeam === true);
            this.setState({ onTeamCharacters: charactersOnTeam });
          }).catch(error => console.error('error with getSavedCharacters', error));
      })
      .catch(error => console.error('error on deleteCharacter', error));
  }

  addToTeam = (characterId) => {
    const trueValue = true;
    characterRequests.patchOnTeam(characterId, trueValue).then(() => {
      const uid = authRequests.getCurrentUid();
      characterRequests.getSavedCharacters(uid)
        .then((characters) => {
          const charactersNotOnTeam = characters.filter(x => x.onTeam === false);
          this.setState({ characters: charactersNotOnTeam });
          const charactersOnTeam = characters.filter(x => x.onTeam === true);
          this.setState({ onTeamCharacters: charactersOnTeam, noTeam: false });
          const { onTeamCharacters } = this.state;
          if (onTeamCharacters.length === 4) {
            this.setState({ fullTeam: true });
          }
        }).catch(error => console.error('error with getSavedCharacters', error));
    }).catch(error => console.error('error on patchOnTeam', error));
  }

  removeFromTeam = (characterId) => {
    const falseValue = false;
    characterRequests.patchOnTeam(characterId, falseValue).then(() => {
      const uid = authRequests.getCurrentUid();
      characterRequests.getSavedCharacters(uid)
        .then((characters) => {
          const charactersNotOnTeam = characters.filter(x => x.onTeam === false);
          this.setState({ characters: charactersNotOnTeam });
          const charactersOnTeam = characters.filter(x => x.onTeam === true);
          this.setState({ onTeamCharacters: charactersOnTeam, fullTeam: false });
          const { onTeamCharacters } = this.state;
          if (onTeamCharacters.length === 0) {
            this.setState({ noTeam: true });
          }
        }).catch(error => console.error('error with getSavedCharacters', error));
    }).catch(error => console.error('error on patchOnTeam', error));
  }

  levelUpCharacter = (characterId) => {
    const { levelUpToken } = this.state;
    if (levelUpToken > 0) {
      const newTokenAmount = levelUpToken - 1;
      this.setState({ levelUpToken: newTokenAmount });
      const uid = authRequests.getCurrentUid();
      userRequests.getFirebaseUserId(uid).then((firebaseId) => {
        userRequests.patchLevelToken(firebaseId, newTokenAmount)
          .then(() => {
            this.props.setLevelTokens(newTokenAmount);
          })
          .catch(error => console.error('error on patchLevelToken', error));
      }).catch(error => console.error('error on getFirebaseUserId', error));
      characterRequests.getSingleSavedCharacter(characterId)
        .then((result) => {
          const characterObject = result.data;
          this.setState({ levelUpCharacter: characterObject });
          const myCharacter = { ...this.state.levelUpCharacter };
          const key = characterObject.level;
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + levelUpData[key].hitPoints;
          myCharacter.attackPoints = characterObject.attackPoints + levelUpData[key].attackPoints;
          this.setState({ levelUpCharacter: myCharacter });
          const { levelUpCharacter } = this.state;
          characterRequests.updateSavedCharacter(characterId, levelUpCharacter)
            .then(() => {
              this.setState({ levelUpCharacter: defaultCharacter });
              characterRequests.getSavedCharacters(uid)
                .then((characters) => {
                  const charactersNotOnTeam = characters.filter(x => x.onTeam === false);
                  this.setState({ characters: charactersNotOnTeam });
                  const charactersOnTeam = characters.filter(x => x.onTeam === true);
                  this.setState({ onTeamCharacters: charactersOnTeam });
                }).catch(error => console.error('error with getSavedCharacters', error));
            })
            .catch(error => console.error('error on updateSavedCharacter', error));
        })
        .catch(error => console.error('error on getSingleSavedCharacter', error));
    } else {
      this.setState({ tokenModal: true });
    }
  }

  render() {
    const {
      characters,
      onTeamCharacters,
      fullTeam,
      noTeam,
    } = this.state;
    const characterItemComponents = characters.map(character => (
      <CharacterItem
        showAlert={this.showAlert}
        character={character}
        key={character.id}
        fullTeam = {fullTeam}
        deleteCharacter={this.deleteCharacter}
        levelUpCharacter={this.levelUpCharacter}
        addToTeam = {this.addToTeam}
      />
    ));
    const onTeamCharacterItemComponents = onTeamCharacters.map(onTeamCharacter => (
      <OnTeamCharacterItem
        onTeamCharacter={onTeamCharacter}
        key={onTeamCharacter.id}
        removeFromTeam={this.removeFromTeam}
      />
    ));
    const buildModals = () => (
    <div>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>
        Are you sure you want to delete this Character?
        </ModalHeader>
        <ModalFooter>
          <Button className='btn btn-danger' onClick={this.deleteCharacter}>Yes</Button>
          <Button className='btn btn-success' onClick={this.hideAlert}>No</Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={this.state.tokenModal}
        toggle={this.modalToggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.modalToggle}>
        You have no more tokens to level up your Characters.
        </ModalHeader>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalToggle}>OK</Button>
        </ModalFooter>
      </Modal>
    </div>
    );
    return (
      <div className="characters col">
        <h2>Characters</h2>
        <div className='onTeamCharacters d-flex flex-wrap'>{onTeamCharacterItemComponents}</div>
        <Button className='btn btn-danger' disabled={noTeam} tag={RRNavLink} to='/battle'>Battle!</Button>
        <div className='savedCharacters d-flex flex-wrap'>{characterItemComponents}</div>
        <div>{buildModals()}</div>
      </div>
    );
  }
}

export default Characters;
