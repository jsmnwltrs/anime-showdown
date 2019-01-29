import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getBosses = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/bosses.json`)
    .then((res) => {
      const bossData = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          bossData.push(res.data[key]);
        });
      }
      resolve(bossData);
    })
    .catch((error) => {
      reject(error);
    });
});

const getSingleBoss = bossId => axios.get(`${firebaseUrl}/bosses/${bossId}.json`);

export default { getBosses, getSingleBoss };
