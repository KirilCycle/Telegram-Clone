export const chatAdditionalDataManageModule = {
    state: () => ({
      chatContainerRef: null,
      wasObserved: null,
      chatKey: "h",
      chatsCount: 0,
      scrollBottomData: {
        isBottom: null,
      },
    }),
    getters: {

      getChatKey(state) {
        return state.chatKey;
      },
      getWasObserved(state) {
        return state.wasObserved;
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

      setChatsCount(state, number) {
        state.chatsCount = number;
      },
      setChatKey(state, key) {
        state.chatKey = key;
      },
      setWasObserved(state, bool) {
        state.wasObserved = bool;
      },
      setChatsCount(state, n) {
        state.chatsCount = n;
      },
      setChatContainerRef(state, ref) {
        state.chatContainerRef = ref;
      },
    },
  
    actions: {
      setReplyTarget({ commit, target }) {
        commit("setReplyTarget", target);
      },
      setScrollBottomData({ commit, data }) {
        commit("setScrollBottomData", data);
      },
      setChatKey({ commit, id }) {
        commit("setChatKey", id);
      },

      setChatsCount({ state, commit, n }) {
        commit("setChatsCount", n);
      },
      setChatContainerRef({ state, commit, ref }) {
        commit("setChatContainerRef", ref);
      },
    },
    namespaced: true,
  };
  