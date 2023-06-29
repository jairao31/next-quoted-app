// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbCb9m_Ojd7Z4fQci_EVLzyg3g78u9SS8",
    authDomain: "quoted-2df1c.firebaseapp.com",
    projectId: "quoted-2df1c",
    storageBucket: "quoted-2df1c.appspot.com",
    messagingSenderId: "578598575035",
    appId: "1:578598575035:web:87af394daba07508d1c29e",
    measurementId: "G-4XQ4QR3WFX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

export default firebase;
