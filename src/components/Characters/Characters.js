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

  render() {
    const { characters } = this.state;
    const characterItemComponents = characters.map(character => (
      <CharacterItem
        character={character}
        key={character.id}
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
