export const chatModule = {
  state: () => ({
    replyMsgRef: null,
    replyTarget: null,
    chatId: null,
    selectedUser: null,
    query: null,
    chatSettings: {},
    chatIdList: [],
    chatsCount: 0,
    chatContainerRef: null,
    wasObserved: null,
  }),
  getters: {
    getReplyTarget(state) {
      return state.replyTarget;
    },
    getWasObserved(state) {
      return state.wasObserved;
    },
    getChatIdList(state) {
      return state.chatIdList;
    },
    getReplyMsgRef(state) {
      return state.replyMsgRef;
    },
    getChatsCount(state) {
      return state.chatsCount;
    },
    getQuery(state) {
      return state.query;
    },
    getChatId(state) {
      return state.chatId;
    },
    getChatId(state) {
      return state.selectedUser;
    },
    getChatSettings(state) {
      return state.chatSettings;
    },
    getChatContainerRef(state) {
      return state.chatContainerRef;
    },
  },
  mutations: {
    setReplyTarget(state, target) {
      state.replyTarget = target;
    },
    setChatIdList(state, chats) {
      state.chatIdList = chats;
    },
    setWasObserved(state, bool) {
      state.wasObserved = bool;
    },
    setChatId(state, id) {
      state.chatId = id;
    },
    setQuery(state, q) {
      state.query = q;
    },
    setSelectedUser(state, selectedUser) {
      state.selectedUser = selectedUser;
    },
    setReplyMsgRef(state, ref) {
      state.replyMsgRef = ref;
    },
    setChatsCount(state, n) {
      state.chatsCount = n;
    },
    addUniqChatSettingsItem(state, item) {
      if (!state.chatSettings[item.id]) {
        state.chatSettings[item.id] = item;
      }
    },
    changeChatSettings(state, settings) {
    
      state.chatSettings[settings.id] = { ...state.chatSettings[id], ...data };
      console.log("EXECUTED", state.chatSettings[id], data);
    },
    setChatContainerRef(state, ref) {
      state.chatContainerRef = ref;
    },
    deleteChat(state, key) {
      console.log("was deleted ?", key);

      delete state.chatSettings[key];
    },
  },

  actions: {
    setReplyTarget({ commit, target }) {
      commit("setReplyTarget", target);
    },
    setChatIdList({ state, commit, chts }) {
      commit("setChatIdList", chts);
    },
    setSelectedUser({ state, commit, user }) {
      commit("setSelectedUser", user);
    },
    setChatId({ state, commit, id }) {
      commit("setChatId", id);
    },
    setQuery({ state, commit, q }) {
      commit("setQuery", q);
    },
    setReplyMsgRef({ state, commit, ref }) {
      commit("setReplyMsgRef", ref);
    },
    setChatsCount({ state, commit, n }) {
      commit("setChatsCount", n);
    },
    addUniqChatSettingsItem({ state, commit, item }) {
      commit("addUniqChatSettingsItem", item);
    },
    changeChatSettings({ state, commit,settings }) {
      commit("changeChatSettings",settings);
    },
    setChatContainerRef({ state, commit, ref }) {
      commit("setChatContainerRef", ref);
    },
  },
  namespaced: true,
};
