export const chatAdditionalDataManageModule = {
  state: () => ({
    chatContainerRef: null,
    chatKey: "h",
    scrollBottomData: {
      isBottom: null,
    },
  }),
  getters: {
    getChatKey(state) {
      return state.chatKey;
    },
    getChatContainerRef(state) {
      return state.chatContainerRef;
    },
    getChatsCount(state) {
      return state.chatsCount;
    },
  },
  mutations: {
    setScrollBottomData(state, data) {
      state.scrollBottomData = { ...state.scrollBottomData, ...data };
    },
    setChatKey(state, key) {
      state.chatKey = key;
    },

    setChatContainerRef(state, ref) {
      state.chatContainerRef = ref;
    },
  },

  actions: {
    setScrollBottomData({ commit, data }) {
      commit("setScrollBottomData", data);
    },
    setChatKey({ commit, id }) {
      commit("setChatKey", id);
    },
    setChatContainerRef({ state, commit, ref }) {
      commit("setChatContainerRef", ref);
    },
  },
  namespaced: true,
};
