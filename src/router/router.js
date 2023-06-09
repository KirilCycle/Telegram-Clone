/* eslint-disable */
import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store/store";
import { ref, watchEffect } from "vue";
import { async } from "@firebase/util";
import { setDoc } from "firebase/firestore";
import ChatsPage from "@/pages/ChatsPage";
import firebase from "firebase/compat/app";

// v9 compat packages are API compatible with v8 code
import { doc, getDoc } from "firebase/firestore";
import "firebase/compat/auth";
import { set } from "firebase/database";

import "firebase/compat/firestore";

function wordGenerator() {
  const words = [
    "Guffy",
    "Sniper",
    "Big",
    "Cold",
    "Master",
    "RockStar",
    "Dangerous",
    "Hot",
    "Sexy",
    "Nice",
    "Incredible",
    "Magistr",
    "Imortal",
  ];

  return words[Math.floor(Math.random() * 10) + 1];
}

async function setUserToStore(user, db) {
  console.log(user, "USER");
  store.commit("user/setUser", user);
  store.commit("user/setAuth", true);
  console.log("user setted");
}

export const routes = [
  {
    path: "/auth",
    name: "auth",
    component: () => import("@/pages/AuthPage.vue"),
  },
  {
    path: "/reg",
    name: "reg",
    component: () => import("@/pages/RegPage.vue"),
  },
  {
    path: "/fake",
    name: "fake",
    component: () => import("@/pages/FakeChat.vue"),
  },
  {
    path: "/",
    name: "chats",
    component:ChatsPage,
    beforeEnter: async (to, from) => {
      //i cant use transaction or bacth when user created 
      //so i need check it, and add in case connection was lost
      //Authentication not the same as usersPrew, two different users objects
      //i cant allow Authentication user object show to enother user during search or conversation, as this objects keep pasword, and other
      //private data
      
      const mainExecute = new Promise(function (resolve, reject) {
        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            async function checkNeccessaryData() {
              const docRef = doc(db, "usersLinksToChat", user.uid);
              const docSnap = await getDoc(docRef)

              if (!docSnap.exists()) {
                console.log("cc action");
                await setDoc(doc(db, "usersLinksToChat", user.uid), {
                  //
                }).catch((er) => reject(er));
              }

              const prewuserSnapRef = doc(db, "usersPrew", user.uid);
              const prewuserSnap = await getDoc(prewuserSnapRef);

              if (!prewuserSnap.exists()) {
                console.log("cpu action");
                await setDoc(doc(db, "usersPrew", user.uid), {
                  uid: user.uid,
                  photoURl: `https://robohash.org/${user.uid}.png`,
                  email: user.email,
                  username:
                    user.email.slice(0, user.email.indexOf("@")) +
                    wordGenerator(),
                })
                  .then((res) => setUserToStore(res))
                  .catch(() => reject(er));
              } else {
                setUserToStore(prewuserSnap.data(), db);
                resolve(true);
              }
            }

            checkNeccessaryData();
          } else {
            console.log("NOO :(");
            reject('no');
          }
        });
      });

      await mainExecute
        

        
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(process.env.BASE_URL),
});

// router.beforeEach(async (to,from ) => {
//     if (

//       // make sure the user is authenticated
//       !isAuthenticated &&
//       // ❗️ Avoid an infinite redirect
//       to.name !== 'auth' && to.name  !== 'reg'
//     ) {
//       // redirect the user to the login page
//       return { name:  from.name}
//     }
//   })

export default router;
