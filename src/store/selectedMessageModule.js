export const messageModule = {
  state: () => ({
    replyMsgRef: null,
  }),
  getters: {
    getReplyTarget(state) {
      return state.replyTarget;
    },
  },
  mutations: {
    setReplyTarget(state, target) {
      state.replyTarget = target;
    },
  },

  actions: {
    setReplyTarget({ commit, target }) {
      commit("setReplyTarget", target);
    },
  },
  namespaced: true,
};
