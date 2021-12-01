import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBa-2iHuSjI8XC_9raGehaxBoodRl_8yyM",
    authDomain: "whatsapp-web-clone-6798b.firebaseapp.com",
    projectId: "whatsapp-web-clone-6798b",
    storageBucket: "whatsapp-web-clone-6798b.appspot.com",
    messagingSenderId: "988637450968",
    appId: "1:988637450968:web:16c91e4ac22c7e31acfdad"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;