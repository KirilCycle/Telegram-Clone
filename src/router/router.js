/* eslint-disable */
import { createRouter, createWebHashHistory } from "vue-router";
import AuthPage from "@/pages/AuthPage";
import RegPage from "@/pages/RegPage";
import ChatPage from "@/pages/ChatPage";
import store from "@/store/store";
import GamePage from "@/pages/GamePage";
import ProfilePage from "@/pages/ProfilePage";
 
export const routes = [
  {
    path: "/",
    name: "auth",
    component: AuthPage,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    beforeEnter: (to, from) => {
      if (!store.state.user.isAuth) {
        console.log( store.state.user.user,'router');
        return false;
      } else {
        return true
      }

    },

  },
  {
    path:"/game",
    name:"game",
    component: GamePage,
    
  },
  {
    path: "/reg",
    name: "reg",
    component: RegPage,
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatPage,
    beforeEnter: (to, from) => {
      if (!store.state.user.isAuth) {
        console.log( store.state.user.user,'router');
        return false;
      } else {
        store.commit("user/setNavbar", true);
        return true

      }

    },
  },
];

export const loginnedRoutes = [
  {
    path: "/",
    name: "chat",
    component: ChatPage,
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
