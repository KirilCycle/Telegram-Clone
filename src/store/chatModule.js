import router from "@/router/router";

export const chatModule = {
  state: () => ({
    replyMsgRef: null,
    text: null,
    from: null,
    chatId: null,
    selectedUser: null,
    querry: null,
    chatIdList: [],
  }),
  getters: {
    getChatIdList(state) {
       return state.chatIdList;
    },
    getReplyMsgRef(state) {
      return state.replyMsgRef;
    },
    getText(state) {
      return state.text;
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
    getFrom(state) {
      return state.from;
    },
  },
  mutations: {
    setChatIdList(state, chats) {
      state.chatIdList = chats
    },
    setChatId(state,id) {
     state.chatId = id
    },
    setQuerry(state,q) {
      state.querry= q
     },
    setSelectedUser(state,selectedUser) {
      state.selectedUser = selectedUser
     },
    setReplyMsgRef(state, ref) {
      state.replyMsgRef = ref;
    },
    setText(state, txt) {
      state.text = txt;
    },
    setFrom(state, from) {
      state.from = from;
    },
  },

  actions: {
    setChatIdList({state,commit,chts}) {
      commit('setChatIdList',chts)
    },
    setSelectedUser({state,commit,user}) {
     commit('setSelectedUser',user)
    },
    setChatId({state, commit,id }) {
      commit("setChatId", id)
    },
    setQuerry({state, commit,q }) {
      commit("setQuerry", q)
    },
    setReplyMsgRef({ state, commit, ref }) {
      commit("setReplyMsgRef", ref);
    },
    setText({ state, commit, txt }) {
      commit("setText", txt);
    },
    setFrom({ state, commit, from }) {
      commit("setFrom", from);
    },
  },
  namespaced: true,
};
