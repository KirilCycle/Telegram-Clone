/* eslint-disable */
import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store/store";
import { ref } from "vue";
import { async } from "@firebase/util";
import ChatsPage from "@/pages/ChatsPage";
import firebase from "firebase/compat/app";

const isAuthed = ref(store.state.user.user);

export const routes = [
  {
    path: "/",
    name: "auth",
    component: () => import("@/pages/AuthPage.vue"),
    beforeEnter: async (to, from) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
        
        } else {
          
        }
      });

      console.log("before");
    },
  },
  {
    path: "/reg",
    name: "reg",
    component: () => import("@/pages/RegPage.vue"),
  },
  {
    path: "/chats",
    name: "chats",
    component: ChatsPage,
    beforeEnter: async (to, from) => {
      if (!(await store.state.user.user)) {
        console.log(store.state.user.user, "router", isAuthed.value);
        return false;
      } else {
        return true;
      }
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
