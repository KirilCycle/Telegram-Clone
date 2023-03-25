<template>
  <div class="wrap">
    <router-view></router-view>
    <TransitionGroup name="nav" tag="div">
    <top-navbar v-if="store.state.user.isAuth && store.state.user.navbarVisible"></top-navbar>
    </TransitionGroup>
  </div>
</template>

<script setup>
import router,  { routes, } from "./router/router";
import TopNavbar from "./components/TopNavbar.vue";
import store from "./store/store";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {  signOut } from "firebase/auth";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { onMounted, watchEffect, ref, watch, } from "vue";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } from "firebase/auth";
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

// const auths = getAuth();
// signOut(auths).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user, 'USER')
    store.commit("user/setUser", user);
    store.commit("user/setAuthData", auth);
    store.commit("user/setAuth", true);
    store.commit("user/setDb", db);
    router.push({ name:  window.location.hash.replace('#/', '')});
    // window.location.hash.replace('#/', '')
    
  } else {
    console.log('NOO :(')
  }
});


const firestore = firebase.firestore();

const db = getFirestore(app);



onMounted(() => {
  store.commit("user/setFirestore", firestore);

  // console.log(auth.currentUser,store.state.user.isAuth, 'APPP')
});


store.commit("user/setFireBase", firebase);

// the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
// Initialize Firebase
// Initialize Cloud Firestore and get a reference to the service
</script>

<style>

.nav-enter-active{
  transform: translateY(0px);
}
.nav-leave-active {
  transition: all 0.5s ease;
}
.nav-enter-from,
.nav-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}


.wrap {
}
* {
  margin: 0px;
  bottom: 0px;
  padding: 0px;
}
input{
  outline: none;
  border:none;
  background-image:none;
  background-color:transparent;
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
}
</style>
