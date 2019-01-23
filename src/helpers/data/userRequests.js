import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addUser = newUser => axios.post(`${firebaseUrl}/users.json`, newUser);

export default { addUser };
