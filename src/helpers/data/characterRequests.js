import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getSavedCharacters = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/savedCharacters.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const characterData = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          characterData.push(res.data[key]);
        });
      }
      resolve(characterData);
    })
    .catch((error) => {
      reject(error);
    });
});

const getSingleCharacter = characterId => axios.get(`${firebaseUrl}/characters/${characterId}.json`);

const getSingleSavedCharacter = characterId => axios.get(`${firebaseUrl}/savedCharacters/${characterId}.json`);

const deleteSavedCharacter = characterId => axios.delete(`${firebaseUrl}/savedCharacters/${characterId}.json`);

const addSavedCharacter = characterObject => axios.post(`${firebaseUrl}/savedCharacters.json`, characterObject);

const updateSavedCharacter = (characterId, characterObject) => axios.put(`${firebaseUrl}/savedCharacters/${characterId}.json`, characterObject);


export default {
  getSavedCharacters,
  deleteSavedCharacter,
  getSingleCharacter,
  getSingleSavedCharacter,
  addSavedCharacter,
  updateSavedCharacter,
};
