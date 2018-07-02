import firebase from 'firebase';

  const config = {
    apiKey: "AIzaSyBvnADLOdavvIGW3gKrOEdsF9vwTo5z0kU",
    authDomain: "lingdrone-intern.firebaseapp.com",
    databaseURL: "https://lingdrone-intern.firebaseio.com",
    projectId: "lingdrone-intern",
    storageBucket: "lingdrone-intern.appspot.com",
    messagingSenderId: "368870928255"
  };
  firebase.initializeApp(config);
  export const ref = firebase.database().ref()
  export const auth = firebase.auth();
  export const provider = new firebase.auth.FacebookAuthProvider();
  export const provider2 = new firebase.auth.GoogleAuthProvider();
  export default firebase;