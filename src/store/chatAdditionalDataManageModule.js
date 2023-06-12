export const chatAdditionalDataManageModule = {
  state: () => ({
    chatContainerRef: null,
    chatScrollWayRef: null,
    chatKey: "h",
    scrollBottomData: {
      isBottom: null,
    },
  }),
  getters: {
    getChatKey(state) {
      return state.chatKey;
    },
    getChatScrollWayRef(state) {
      return state.chatScrollWayRef;
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
    setChatScrollWayRef(state, ref) {
      state.chatScrollWayRef = ref;
    },
    setChatContainerRef(state, ref) {
      state.chatContainerRef = ref;
    },
  },

  actions: {
    setScrollBottomData({ commit, data }) {
      commit("setScrollBottomData", data);
    },
    setChatScrollWayRef({ commit, data }) {
      commit("setChatScrollWayRef", data);
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
