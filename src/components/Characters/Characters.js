import React from 'react';
import { Button, Alert } from 'reactstrap';
import './Characters.scss';
import CharacterItem from '../CharacterItem/CharacterItem';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';

const defaultCharacter = {
  name: '',
  imageUrl: '',
  hitPoints: 0,
  attackPoints: 0,
  level: 0,
  onTeam: false,
  uid: '',
};

class Characters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      characters: [],
      characterId: '',
      levelUpCharacter: defaultCharacter,
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({ visible: false });
  }


showAlert = (e) => {
  e.preventDefault();
  this.setState({ visible: true });
  const characterId = e.target.id;
  this.setState({ characterId });
}

hideAlert = (e) => {
  e.preventDefault();
  this.setState({ visible: false });
  this.setState({ characterId: '' });
}

componentDidMount() {
  this.setState({ characterId: '' });
  this.setState({ levelUpCharacter: defaultCharacter });
  const uid = authRequests.getCurrentUid();
  characterRequests.getSavedCharacters(uid)
    .then((characters) => {
      this.setState({ characters });
    }).catch(error => console.error('error with getSavedCharacters', error));
}

  deleteCharacter = () => {
    const { characterId } = this.state;
    characterRequests.deleteSavedCharacter(characterId)
      .then(() => {
        this.setState({ characterId: '' });
        this.setState({ visible: false });
        const uid = authRequests.getCurrentUid();
        characterRequests.getSavedCharacters(uid)
          .then((characters) => {
            this.setState({ characters });
          }).catch(error => console.error('error with getSavedCharacters', error));
      })
      .catch(error => console.error('error on deleteCharacter', error));
  }

  levelUpCharacter = (characterId) => {
    characterRequests.getSingleSavedCharacter(characterId)
      .then((result) => {
        const characterObject = result.data;
        this.setState({ levelUpCharacter: characterObject });
        const myCharacter = { ...this.state.levelUpCharacter };
        if (characterObject.level === 0) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 1) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 2) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 3) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 4) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 5) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 6) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 7) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 8) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        } else if (characterObject.level === 9) {
          myCharacter.level = characterObject.level + 1;
          myCharacter.hitPoints = characterObject.hitPoints + 1;
          myCharacter.attackPoints = characterObject.attackPoints + 1;
        }
        this.setState({ levelUpCharacter: myCharacter });
        const { levelUpCharacter } = this.state;
        characterRequests.updateSavedCharacter(characterId, levelUpCharacter)
          .then(() => {
            this.setState({ levelUpCharacter: defaultCharacter });
            const uid = authRequests.getCurrentUid();
            characterRequests.getSavedCharacters(uid)
              .then((characters) => {
                this.setState({ characters });
              }).catch(error => console.error('error with getSavedCharacters', error));
          })
          .catch(error => console.error('error on updateSavedCharacter', error));
      })
      .catch(error => console.error('error on getSingleSavedCharacter', error));
  }

  render() {
    const { characters } = this.state;
    const characterItemComponents = characters.map(character => (
      <CharacterItem
        showAlert={this.showAlert}
        character={character}
        key={character.id}
        deleteCharacter={this.deleteCharacter}
        levelUpCharacter={this.levelUpCharacter}
      />
    ));
    return (
      <div className="characters col">
        <h2>Characters</h2>
        <div className='d-flex flex-wrap'>{characterItemComponents}</div>
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
          Are you sure you want to delete this Character?
          <Button className='btn btn-danger' onClick={this.deleteCharacter}>Yes</Button>
          <Button className='btn btn-success' onClick={this.hideAlert}>No</Button>
        </Alert>
      </div>
    );
  }
}

export default Characters;
