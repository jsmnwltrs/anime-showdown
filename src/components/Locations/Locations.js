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
import userRequests from '../../helpers/data/userRequests';

const defaultCharacter = {
  name: '',
  imageUrl: '',
  hitPoints: 0,
  attackPoints: 0,
  level: 0,
  onTeam: false,
  uid: '',
  critChance: 0,
  healBonus: 0,
};

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      tokenModal: false,
      locations: [],
      chosenCharacterId: '',
      chosenCharacter: defaultCharacter,
      characterToken: 0,
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
    this.setState({ chosenCharacter: defaultCharacter });
    locationRequests.getLocations()
      .then((locations) => {
        this.setState({ locations });
      }).catch(error => console.error('error with getLocations', error));
    const uid = authRequests.getCurrentUid();
    userRequests.getFirebaseUserId(uid).then((firebaseId) => {
      userRequests.getUserObject(firebaseId)
        .then((user) => {
          const characterToken = user.data.characterTokens;
          this.setState({ characterToken });
        })
        .catch(error => console.error('error on getUserObject', error));
    }).catch(error => console.error('error on getFirebaseUserId', error));
  }

  chooseRandomCharacter = (characterIds) => {
    const randomizer = Math.floor((Math.random() * 10) + 1);
    const key = randomizer - 1;
    const chosenCharacter = characterIds[key];
    this.setState({ chosenCharacterId: chosenCharacter });
  }

  drawClickEvent = (e) => {
    const { characterToken } = this.state;
    if (characterToken > 0) {
      const newTokenAmount = characterToken - 1;
      this.setState({ characterToken: newTokenAmount });
      const uid = authRequests.getCurrentUid();
      userRequests.getFirebaseUserId(uid).then((firebaseId) => {
        userRequests.patchCharacterToken(firebaseId, newTokenAmount)
          .then(() => {
            this.props.setCharacterTokens(newTokenAmount);
          })
          .catch(error => console.error('error on patchCharacterToken', error));
      }).catch(error => console.error('erro ron getFirebaseUserId', error));
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
              myCharacter.critChance = character.data.critChance;
              myCharacter.healBonus = character.data.healBonus;
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
    } else {
      this.setState({ tokenModal: true });
    }
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
           <p>Crit Chance: {chosenCharacter.critChance}</p>
           <p>Heal Bonus: {chosenCharacter.healBonus}</p>
          </ModalFooter>
          <Button color="success" onClick={this.toggle}>OK</Button>
        </Modal>
        <Modal
            isOpen={this.state.tokenModal}
            toggle={this.modalToggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.modalToggle}>
            You have no more tokens to draw Characters.
            </ModalHeader>
            <ModalFooter>
              <Button color="secondary" onClick={this.modalToggle}>OK</Button>
            </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Locations;
