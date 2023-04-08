export const messageModule = {
  state: () => ({
    replyMsgRef: null,
    replyTarget: null,
    clickCoords: null 
  }),
  getters: {
    getReplyTarget(state) {
      return state.replyTarget;
    },
     getReplyMsgRef(state) {
      return state.replyMsgRef;
    },

    getClickCoords(state) {
      return state.clickCoords
    }

  },
  mutations: {
    setReplyTarget(state, target) {
      state.replyTarget = target;
    },
        setReplyMsgRef(state, ref) {
      state.replyMsgRef = ref;
    },
    setClickCoords(state, coords) {
     state.coords = coords
    }
  },

  actions: {
    setReplyTarget({ state,commit, target }) {
      commit("setReplyTarget", target);
    },
     setReplyMsgRef({ state, commit, ref }) {
      commit("setReplyMsgRef", ref);
    },

    setClickCoords({ state, commit, coords }) {
      commit("setClickCoords",coords)
    },


  },
  namespaced: true,
};
