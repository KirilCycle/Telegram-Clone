import axios from "axios";
import router from "@/router/router";


export const userModule = {
  state: () => ({
   isAuth: false,
   key: '',
   user: {},
   firebaseSetup: {
     auth: {},
     firestore: {}
   }
  }),
  getters: {
       getAuth(state) {
        return state.isAuth 
      },
      getKey(state) {
        return state.key
      },
      getUser(state) {
        return state.user
      }
  },
  mutations: {
    setAuth(state,bool) {
      state.isAuth = bool;
    },
    setUser(state, user) {
        state.user = user
    },
    setFirebaseSetup( state, setup) {
      state.firebaseSetup = setup
    }
  },

  actions: {

      setAuth({state, commit}) {
           commit('setAuth', true);
      },

      setKey({state, commit}) {
        commit('getKey', commit)
      },

      setUser({state, commit,user}) {
        commit('setUser', user)
      },

      setFirebaseSetup({state, commit, setup}) {
         commit('setFirebaseSetup', setup)
      }


   },
   namespaced: true
};
