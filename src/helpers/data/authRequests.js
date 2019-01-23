import firebase from 'firebase/app';
import 'firebase/auth';

const createUser = (email, password) => new Promise((resolve, reject) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).then((data) => {
    resolve(data);
  }).catch(error => reject(error));
});

const authenticate = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password);
};

const logoutUser = () => firebase.auth().signOut();

const getCurrentUid = () => firebase.auth().currentUser.uid;

export default {
  authenticate,
  logoutUser,
  getCurrentUid,
  createUser,
};
