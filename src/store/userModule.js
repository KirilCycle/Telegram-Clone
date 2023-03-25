import router from "@/router/router";


export const userModule = {
  state: () => ({
    isAuth: false,
    key: "",
    user: null,
    auth: {},
    firestore: {},
    firebase: {},
    db: {},
    navbarVisible: true,
    storage: null,
    customStorageRef: null
  }),
  getters: {
    getCustomStorageRef(state) {
    return state.customStorageRef
    }, 
     
    getAuth(state) {
      return state.storage;
    },
    getStorage(state) {
      return state.isAuth;
    },
    getNavbarVisible(state) {
      return state.navbarVisible;
    },
    getKey(state) {
      return state.key;
    },
    getUser(state) {
      return state.user;
    },
    getDb(state) {
      return state.db
    }
  },
  mutations: {
    setCustomStorageRef(state, ref) {
     state.customStorageRef = ref
    },
    setStorage(state, storage) {
      state.storage = storage;
    },
    setNavbar(state, bool) {
      state.navbarVisible = bool;
    },
    setAuth(state, bool) {
      state.isAuth = bool;
    },
    setUser(state, user) {
      state.user = user;
    },
    setFirestore(state, setup) {
      state.firestore = setup;
    },
    setAuthData(state, setup) {
      state.auth = setup;
    },
    setFireBase(state, setup) {
      state.ffirebase = setup;
    },
    setDb(state,db) {
      state.db = db
    }
  },

  actions: {

    setCustomStorageRef({state, commit, ref}) {
       commit('setCustomStorageRef', ref)
    },
    setStorage({state, commit, storage}) {
      commit("setStorage",storage)
    },
    setDb({state, commit, db}){
      commit("setDb",db)
    },

    setNavbarVisible({state, commit, bool}){
         commit('setNavbar', bool)
    },

    setAuth({ state, commit }) {
      commit("setAuth", true);
      router.push({ name: "chat" });
    },

    setKey({ state, commit }) {
      commit("getKey", commit);
    },

    setUser({ state, commit, user }) {
      commit("setUser", user);
    },

    setFirestore({ state, commit, setup }) {
      commit("setFirestore", setup);
    },
    setAuthData({ state, commit, setup }) {
      commit("setAuthData", setup);
    },
    setFireBase({ state, commit, setup }) {
      commit("setFireBase", setup);
    },
  },
  namespaced: true,
};
