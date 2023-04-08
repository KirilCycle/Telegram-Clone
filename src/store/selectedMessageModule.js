export const messageModule = {
  state: () => ({
    replyMsgRef: null,
     replyTarget: null, 
  }),
  getters: {
    getReplyTarget(state) {
      return state.replyTarget;
    },
     getReplyMsgRef(state) {
      return state.replyMsgRef;
    },
  },
  mutations: {
    setReplyTarget(state, target) {
      state.replyTarget = target;
    },
        setReplyMsgRef(state, ref) {
      state.replyMsgRef = ref;
    },
  },

  actions: {
    setReplyTarget({ state,commit, target }) {
      commit("setReplyTarget", target);
    },
     setReplyMsgRef({ state, commit, ref }) {
      commit("setReplyMsgRef", ref);
    },
  },
  namespaced: true,
};
