import React from 'react';
import './Characters.scss';
import CharacterItem from '../CharacterItem/CharacterItem';
import characterRequests from '../../helpers/data/characterRequests';
import authRequests from '../../helpers/data/authRequests';

class Characters extends React.Component {
  state = {
    characters: [],
  }

  componentDidMount() {
    const uid = authRequests.getCurrentUid();
    characterRequests.getSavedCharacters(uid)
      .then((characters) => {
        this.setState({ characters });
      }).catch(error => console.error('error with getSavedCharacters', error));
  }

  deleteCharacter = (uid) => {
    characterRequests.deleteSavedCharacter(uid)
      .then(() => {
        characterRequests.getSavedCharacters(uid)
          .then((characters) => {
            this.setState({ characters });
          }).catch(error => console.error('error with getSavedCharacters', error));
      })
      .catch(error => console.error('error on deleteCharacter', error));
  }

  render() {
    const { characters } = this.state;
    const characterItemComponents = characters.map(character => (
      <CharacterItem
        character={character}
        key={character.id}
        deleteCharacter={this.deleteCharacter}
      />
    ));
    return (
      <div className="characters col">
        <h2>Characters</h2>
        <div className='d-flex flex-wrap'>{characterItemComponents}</div>
      </div>
    );
  }
}

export default Characters;
