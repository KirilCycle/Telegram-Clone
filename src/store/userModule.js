import axios from "axios";
import router from "@/router/router";

export const userModule = {
  state: () => ({
   isAuth: false,
   key: '',
  }),
  getters: {
       getAuth(state) {
        return state.isAuth 
    },
    getKey(state) {
        return state.key
    }
  },
  mutations: {
    setAuth(state,bool) {
      state.isAuth = bool;
    },
  },

  actions: {

      setAuth({state, commit}) {
           commit('setAuth', true);
      },

      setKey({state, commit}) {
        commit('getKey', commit)
      }


   },
   namespaced: true
};
