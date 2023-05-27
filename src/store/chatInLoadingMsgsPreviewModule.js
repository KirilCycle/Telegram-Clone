export const chatLoadingPreviewModule = {
    state: () => ({
      msgs: [],
    }),
    getters: {
      getMsg(state) {
        return state.msgs;
      },
    },
    mutations: {
      setNextLoadingMsg(state, msg) {
        state.msgs.push(msg);
      },
      removeLoadingMsg(state, id) {
        state.msgs = state.msgs.filter((msg) => msg.id !== id)
      }
    },
  
    actions: {
        setNextLoadingMsg({ commit, msg }) {
        commit("setNextLoadingMsg", msg);
      },

      removeLoadingMsg({ commit, id }) {
        commit("removeLoadingMsg", id);
      },

    },
    namespaced: true,
  };
  