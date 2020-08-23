import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBiSmA1TwyXcwIRQ2-TJ0oIMXT5ui-jUWk",
    authDomain: "instagram-clone-react-356fd.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-356fd.firebaseio.com",
    projectId: "instagram-clone-react-356fd",
    storageBucket: "instagram-clone-react-356fd.appspot.com",
    messagingSenderId: "731837687819",
    appId: "1:731837687819:web:2d6326411eecb9b772ff0e",
    measurementId: "G-B4XLDRRG8H"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};