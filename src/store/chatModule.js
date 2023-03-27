import router from "@/router/router";

export const chatModule = {
  state: () => ({
    replyMsgRef: null,
    text: null,
    from: null,
  }),
  getters: {
    getReplyMsgRef(state) {
      return state.replyMsgRef;
    },
    getText(state) {
      return state.text;
    },
    getFrom(state) {
      return state.from;
    },
  },
  mutations: {
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
