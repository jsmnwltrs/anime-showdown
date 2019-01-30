import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addUser = newUser => axios.post(`${firebaseUrl}/users.json`, newUser);

const getFirebaseUserId = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const firebaseId = Object.keys(res.data);
      resolve(firebaseId);
    })
    .catch(error => reject(error));
});

const getUserObject = firebaseId => axios.get(`${firebaseUrl}/users/${firebaseId}.json`);

const patchLevelToken = (firebaseId, levelUpTokens) => axios.patch(`${firebaseUrl}/users/${firebaseId}.json`, { levelUpTokens });

const patchCharacterToken = (firebaseId, characterTokens) => axios.patch(`${firebaseUrl}/users/${firebaseId}.json`, { characterTokens });

export default {
  addUser,
  getFirebaseUserId,
  getUserObject,
  patchLevelToken,
  patchCharacterToken,
};
