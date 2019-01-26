import React from 'react';
import './Locations.scss';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import LocationItem from '../LocationItem/LocationItem';
import locationRequests from '../../helpers/data/locationRequests';
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

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      locations: [],
      chosenCharacterId: '',
      chosenCharacter: defaultCharacter,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  componentDidMount() {
    this.setState({ chosenCharacter: defaultCharacter });
    locationRequests.getLocations()
      .then((locations) => {
        this.setState({ locations });
      }).catch(error => console.error('error with getLocations', error));
  }

  chooseRandomCharacter = (characterIds) => {
    const randomizer = Math.floor((Math.random() * 10) + 1);
    if (randomizer === 1) {
      this.setState({ chosenCharacterId: characterIds[0] });
    } else if (randomizer === 2) {
      this.setState({ chosenCharacterId: characterIds[1] });
    } else if (randomizer === 3) {
      this.setState({ chosenCharacterId: characterIds[2] });
    } else if (randomizer === 4) {
      this.setState({ chosenCharacterId: characterIds[3] });
    } else if (randomizer === 5) {
      this.setState({ chosenCharacterId: characterIds[4] });
    } else if (randomizer === 6) {
      this.setState({ chosenCharacterId: characterIds[5] });
    } else if (randomizer === 7) {
      this.setState({ chosenCharacterId: characterIds[6] });
    } else if (randomizer === 8) {
      this.setState({ chosenCharacterId: characterIds[7] });
    } else if (randomizer === 9) {
      this.setState({ chosenCharacterId: characterIds[8] });
    } else if (randomizer === 10) {
      this.setState({ chosenCharacterId: characterIds[9] });
    }
  }

  drawClickEvent = (e) => {
    const locationId = e.target.closest('.location').id;
    locationRequests.getCharacterIds(locationId)
      .then((characterIds) => {
        this.chooseRandomCharacter(characterIds);
        const { chosenCharacterId } = this.state;
        characterRequests.getSingleCharacter(chosenCharacterId)
          .then((character) => {
            const myCharacter = { ...this.state.chosenCharacter };
            myCharacter.uid = authRequests.getCurrentUid();
            myCharacter.name = character.data.name;
            myCharacter.imageUrl = character.data.imageUrl;
            myCharacter.attackPoints = character.data.attackPoints;
            myCharacter.hitPoints = character.data.hitPoints;
            this.setState({ chosenCharacter: myCharacter });
            characterRequests.addSavedCharacter(this.state.chosenCharacter)
              .then(() => {
                this.setState({ modal: true });
              })
              .catch(error => console.error('error on addSavedCharacter', error));
          })
          .catch(error => console.error('error on getSingleCharacter', error));
      })
      .catch(error => console.error('error on getCharacterIds', error));
  }


  render() {
    const { locations, chosenCharacter } = this.state;
    const locationItemComponents = locations.map(location => (
      <LocationItem
        location={location}
        key={location.id}
        drawClickEvent={this.drawClickEvent}
      />
    ));
    return (
      <div className="locations col">
        <h2>Locations</h2>
        <div className='d-flex flex-wrap'>{locationItemComponents}</div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{chosenCharacter.name}</ModalHeader>
          <ModalBody>
            <img src={chosenCharacter.imageUrl} alt='character img' />
          </ModalBody>
          <ModalFooter>
           <p>HP: {chosenCharacter.hitPoints}</p>
           <p>AP: {chosenCharacter.attackPoints}</p>
          </ModalFooter>
          <Button color="success" onClick={this.toggle}>OK</Button>
        </Modal>
      </div>
    );
  }
}

export default Locations;
