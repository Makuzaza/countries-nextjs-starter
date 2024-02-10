import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkR_mAA1BCaceThL4UAbqcRe2zMox92FM",
    authDomain: "my-register-22059.firebaseapp.com",
    projectId: "my-register-22059",
    storageBucket: "my-register-22059.appspot.com",
    messagingSenderId: "951338305202",
    appId: "1:951338305202:web:23887ea2264bff4c61abab",
    measurementId: "G-T364JMJ17J"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Here we get access to the project authentication
const auth = getAuth(app);
// Here we get access to the project database
const db = getFirestore(app);

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export const logout = () => {
  auth.signOut();
};

export { auth, db, registerWithEmailAndPassword };