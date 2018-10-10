import firebase from 'firebase';

  const config = {
   apiKey: "AIzaSyDVALuvtcQllCUjgkDG7T-8OdWHQKJ3b0U",
    authDomain: "filetestnew.firebaseapp.com",
    databaseURL: "https://filetestnew.firebaseio.com",
    projectId: "filetestnew",
    storageBucket: "filetestnew.appspot.com",
    messagingSenderId: "712952157291"
  };
  firebase.initializeApp(config);
  export const ref = firebase.database().ref()
  export const auth = firebase.auth();
  export const provider = new firebase.auth.FacebookAuthProvider();
  export const provider2 = new firebase.auth.GoogleAuthProvider();
  export default firebase;
  // // gsutil cors set cors.json gs:"filetestnew.appspot.com"
  // Run gsutil cors set cors.json gs://"filetestnew.appspot.com"