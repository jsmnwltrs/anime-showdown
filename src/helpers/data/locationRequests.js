import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getLocations = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/locations.json`)
    .then((res) => {
      const locationData = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          locationData.push(res.data[key]);
        });
      }
      resolve(locationData);
    })
    .catch((error) => {
      reject(error);
    });
});

const getCharacterIds = locationId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/characterLocations.json?orderBy="locationId"&equalTo="${locationId}"`)
    .then((res) => {
      const characterIds = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          const filteredId = res.data[key].characterId;
          characterIds.push(filteredId);
        });
      }
      resolve(characterIds);
    })
    .catch(error => reject(error));
});

export default { getLocations, getCharacterIds };
