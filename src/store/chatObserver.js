export const chatModule = {
    state: () => ({
      lastMsgRef: null,
    }),
    getters: {
      getLastMsgRef(state) {
        return state.replyTarget;
      },
    },
    mutations: {
      setLastMsgRef(state, target) {
        state.replyTarget = target;
      },
    },
  
    actions: {
      setLastMsgRef({ commit, target }) {
        commit("setLastMsgRef", target);
      },
    },
    namespaced: true,
  };
  