export const chatAdditionalDataManageModule = {
  state: () => ({
    chatContainerRef: null,
    chatScrollWayRef: null,
    chatKey: "defautlFirstStartKey",
    chatGettingMsgsSettings: null,
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
    getChatGettingMsgsSettings(state) {
      return state.chatGettingMsgsSettings;
    },
  },
  mutations: {
    setScrollBottomData(state, data) {
      state.scrollBottomData = { ...state.scrollBottomData, ...data };
    },
    setChatKey(state, key) {
      state.chatKey = key;
    },
    setChatGettingMsgsSettings(state, data) {
      state.chatGettingMsgsSettings = data;
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
    setChatGettingMsgsSettings({ commit, data }) {
      commit("setChatGettingMsgsSettings", data);
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
