export const chatModule = {
  state: () => ({
    replyMsgRef: null,
    replyTarget: null,
    chatId: null,
    selectedUser: null,
    querry: null,
    chatsScrollPosition: {},
    chatIdList: [],
    chatsCount: 0,
  }),
  getters: {
    getReplyTarget(state) {
      return state.replyTarget;
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
    getQuerry(state) {
      return state.querry;
    },
    getChatId(state) {
      return state.chatId;
    },
    getChatId(state) {
      return state.selectedUser;
    },
    getChatsScrollPosition(state) {
      return state.chatsScrollPosition;
    },
  },
  mutations: {
    setReplyTarget(state, target) {
      state.replyTarget = target;
    },
    setChatIdList(state, chats) {
      state.chatIdList = chats;
    },
    setChatId(state, id) {
      state.chatId = id;
    },
    setQuerry(state, q) {
      state.querry = q;
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
    addUniqChatItem(state, item) {
      if (!state.chatsScrollPosition[item.id]) {
        state.chatsScrollPosition[item.id] = item;
      }
    },
    changeChatsScrollData(state, data) {
      
      state.chatsScrollPosition[data.id][data.key] = data.data

     
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
    setQuerry({ state, commit, q }) {
      commit("setQuerry", q);
    },
    setReplyMsgRef({ state, commit, ref }) {
      commit("setReplyMsgRef", ref);
    },
    setChatsCount({ state, commit, n }) {
      commit("setChatsCount", n);
    },
    addUniqChatItem({ state, commit, item }) {
      commit("addUniqChatItem", item);
    },
    changeChatsScrollData({ state, commit, data }) {
      commit("changeChatsScrollData", data);
    },
  },
  namespaced: true,
};
