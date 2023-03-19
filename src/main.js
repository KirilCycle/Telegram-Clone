import { createApp, ref,onUnmounted } from "vue";
import App from "./App.vue";
import router from "./router/router";
/* eslint-disable */
import store from "./store/store";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";

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

export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  // No popupRedirectResolver defined
});
export const firestore = firebase.firestore();

export const messagesColection = firestore.collection('messages')

export const messagesQuery = messagesColection.orderBy('createdAt', 'desc').limit(200)

export async function useChat() {
  const messages = ref([])
  const unsubscribe = messagesQuery.onSnapshot(snapshot => {
    messages.value = snapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .reverse()
  })
  onUnmounted(() => {
    unsubscribe
  })

  console.log(messages)

  const sendMessage = text => {
   
      // const {photoURL, uid, displayName} = store.state.user.value
      messagesColection.add({
        // userName: displayName,
        // userId: uid,
        // userPhotoURl: photoURL,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    
  }
  


  return {messages, sendMessage}
  
}

createApp(App).use(store).use(router).mount("#app");
