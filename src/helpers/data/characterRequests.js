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


export default { getSavedCharacters };
