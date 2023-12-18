import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADwJeVr5f0KE8aHuThJavkDY2Z5AR9bOE",
  authDomain: "user-management-82455.firebaseapp.com",
  projectId: "user-management-82455",
  storageBucket: "user-management-82455.appspot.com",
  messagingSenderId: "865463982543",
  appId: "1:865463982543:web:8f7b67d3689703704adaba",
  measurementId: "G-KK1HCCD0QH"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
