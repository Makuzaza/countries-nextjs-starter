import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getFavourites } from "../store/favouritesSlice";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
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

export const getNameOfUser = async (user) => {
  if (user) {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const name = doc.data().name;
      console.log("name from getNameOfuser: ", name);
      return name;
    });
  } else {
    return null;
  }
};

export const addFavouriteToFirebase = async (uid, name) => {
  try {
    await addDoc(collection(db, `users/${uid}/favourites`), { name });
    console.log("Favourite added to Firebase database");
  } catch (err) {
    console.error("Error adding favourite to Firebase database: ", err);
  }
};

export const removeFavouriteFromFirebase = async (uid, name) => {
  console.log("Name: ", name);
  try {
    if (!name) {
      console.error(
        "Error removing favourite from Firebase database: name parameter is undefined"
      );
      return;
    }
    const q = query(
      collection(db, `users/${uid}/favourites`),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log("Favourite removed from Firebase database");
    });
  } catch (err) {
    console.error("Error removing favourite from Firebase database: ", err);
  }
};

export const clearFavouritesFromFirebase = async (uid) => {
  try {
    const q = query(collection(db, `users/${uid}/favourites`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log("Favourites removed from Firebase database");
    });
  } catch (err) {
    console.error("Error removing favourites from Firebase database: ", err);
  }
};

export const getFavouritesFromSource = () => async (dispatch) => {
  const user = auth.currentUser;
  if (user) {
    const q = await getDocs(collection(db, `users/${user.uid}/favourites`));
    const favourites = q.docs.map((doc) => doc.data().name);
    dispatch(getFavourites(favourites));
  }
};

export { auth, db, registerWithEmailAndPassword };