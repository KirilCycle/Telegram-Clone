/* eslint-disable */
import { createRouter, createWebHashHistory } from "vue-router";
import AuthPage from "@/pages/AuthPage";
import RegPage from "@/pages/RegPage";
import ChatPage from "@/pages/ChatPage";
import store from "@/store/store";

const isAuthenticated = true
export const routes = [
  {
    path: "/auth",
    name: "auth",
    component: AuthPage,
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
      if (!isAuthenticated) {
        return false;
      } else {
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

console.log(isAuthenticated, "RES");

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
