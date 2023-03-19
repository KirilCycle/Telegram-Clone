<template>
  <div class="wrap">
    <router-view></router-view>
  </div>
</template>

<script setup >
import router from "./router/router";
import store from "./store/store";


import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { onMounted } from "vue";

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
 const firestore = firebase.firestore();

 onMounted(() => {
   store.commit('user/setFirestore',firestore)
   store.commit('user/setAuthData',auth)
  //  store.commit('user/setFireBase',firebase)
  })


</script>

<style>
.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #191919;
}
* {
  margin: 0px;
  bottom: 0px;

  padding: 0px;
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
</style>
