<template>
  <!-- <my-profile class="profile" v-if="$store.state.user.user"></my-profile> -->
  <div class="wrap">
    <router-view></router-view>
  </div>
</template>

<script setup>
import router, { routes } from "./router/router";
import TopNavbar from "./components/TopNavbar.vue";
import store from "./store/store";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import { doc, getDoc } from "firebase/firestore";
import "firebase/compat/auth";
// import { ref } from "firebase/storage";
import {  ref, set } from "firebase/database";
import MyProfile from "./components/MyProfile.vue";
import "firebase/compat/firestore";
import { signOut } from "firebase/auth";
import {onBeforeUnmount } from 'vue'
import {  updateDoc } from "firebase/firestore";
import { getDatabase, onValue } from 'firebase/database';


import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { onMounted, watchEffect, watch } from "vue";
import { getFirestore, collection } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  signInWithRedirect,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvHKL-VuejWaJoRvmhOPOvIeOpSk0frOA",
  authDomain: "vue-chat-dd5cd.firebaseapp.com",
  projectId: "vue-chat-dd5cd",
  storageBucket: "vue-chat-dd5cd.appspot.com",
  messagingSenderId: "261289183633",
  appId: "1:261289183633:web:a4ec3e3621cf0deecf7230",
  measurementId: "G-FCV2NMR8XK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  // No popupRedirectResolver defined
});

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit

// const auths = getAuth();
// signOut(auths).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });
const db = getFirestore(app);

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    async function checkNeccessaryData() {
      console.log("v action");
      const docRef = doc(db, "usersLinksToChat", user.uid);
      const docSnap = await getDoc(docRef);

   

      if (!docSnap.exists()) {
        console.log("cc action");
        await setDoc(doc(db, "usersLinksToChat", user.uid), {
          //
        });
      }

      const prewuserSnapRef = doc(db, "usersPrew", user.uid);
      const prewuserSnap = await getDoc(prewuserSnapRef);

      if (!prewuserSnap.exists()) {
        console.log("cpu action");
        await setDoc(doc(db, "usersPrew", user.uid), {
          uid: user.uid,
          photoURl: `https://robohash.org/${user.uid}.png`,
          displayName: user.displayName,
          email: user.email,
        });
      }
    }

    checkNeccessaryData();

    console.log(user, "USER");
    store.commit("user/setUser", user);
    store.commit("user/setAuthData", auth);
    store.commit("user/setAuth", true);
    store.commit("user/setDb", db);
    router.push({ name: window.location.hash.replace("#/", "") });
    // window.location.hash.replace('#/', '')
  } else {
    console.log("NOO :(");
  }
});

const firestore = firebase.firestore();

const storage = getStorage(app);

onMounted(() => {
  store.commit("user/setFirestore", firestore);
  store.commit("user/setStorage", storage);
  store.commit("user/setCustomStorageRef", ref);
  // console.log(auth.currentUser,store.state.user.isAuth, 'APPP')
});

store.commit("user/setFireBase", firebase);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);




// const firestoreDb = firebase.firestore();
// const oldRealTimeDb = getDatabase(app);


// const usersRef = firestoreDb.collection('users'); // Get a reference to the Users collection;
// // const onlineRef = oldRealTimeDb.ref('.info/connected'); // Get a reference to the list of connections
// const onlineRef  = ref(oldRealTimeDb, '.info/connected');

const userId = '5SEC8Idp9mPbOD4C0kEQSPMfDdA2'




const firestoreDb = getFirestore(app);
const realTimeDb = getDatabase(app);

const userDocRef = doc(firestoreDb, "usersPrew", userId);

const onlineRef = ref(realTimeDb, ".info/connected");
const userStatusRef = ref(realTimeDb, `/status/${userId}`);

onValue(onlineRef, (snapshot) => {
  if (snapshot.val() === true) {
    onDisconnect(userStatusRef).set(false).then(() => {
      // Set the online key of the user's document to true
      updateDoc(userDocRef, { online: 'true' });

      // Let's also create a key in our real-time database
      // The value is set to 'online'
      set(userStatusRef, true);
    });

    // Set the online key of the user's document to true immediately
    updateDoc(userDocRef, { online: 'true' });
  } else {
    // Set the online key of the user's document to false
    updateDoc(userDocRef, { online: 'false'});

    // Let's also update the key in our real-time database
    // The value is set to 'offline'
    set(userStatusRef, 'false');
  }
});




</script>

<style>
.profile {
  position: absolute;
  top: 0%;
  right: 0%;
}

.bloor {
  position: fixed;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  background-color: #15151500;
  width: 100%;
  height: 100%;
  display: flex;
}
.profile-container-hidden {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  min-width: 500px;
  transform: translateX(-100%);
  background-color: rgba(0, 0, 0, 0);
}
.profile-container {
  min-width: 500px;
  transform: translateX(0%);
  background-color: black;
}

p {
  margin: 0px;
}

.wrap {
  padding: 0px;
  border: 0px;
  margin: 0px;
}
* {
  margin: 0px;
  bottom: 0px;
  padding: 0px;
}
input {
  outline: none;
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

*:focus {
  outline: none;
}

textarea:focus,
input:focus {
  outline: none;
}

button {
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  /* Corrects inability to style clickable `input` types in iOS */
  -webkit-appearance: none;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

#app {
  padding: 0px;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color: rgb(17, 17, 17);
  min-height: 100vh;
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

</style>
