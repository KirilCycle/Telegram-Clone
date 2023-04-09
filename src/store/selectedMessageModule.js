export const messageModule = {
  state: () => ({
    replyMsgRef: null,
    replyTarget: null,
    clickCoords: null,
    selectedMsgData: null,
    visible: false,
  }),
  getters: {
    getReplyTarget(state) {
      return state.replyTarget;
    },
    setVisible(state) {
      return state.visible;
    },
    getReplyMsgRef(state) {
      return state.replyMsgRef;
    },

    getClickCoords(state) {
      return state.clickCoords;
    },
    getSelectedMsgItem(state) {
      return state.selectedMsgData;
    },
  },
  mutations: {
    setVisible(state, v) {
      state.visible = v;
    },
    setReplyTarget(state, target) {
      state.replyTarget = target;
    },
    setReplyMsgRef(state, ref) {
      state.replyMsgRef = ref;
    },
    setClickCoords(state, coords) {
      state.coords = coords;
    },
    setSelectdMsg(state, data) {
      state.selectedMsgData = data;
    },
  },

  actions: {
    setVisible({ state, commit, v }) {
      commit("setVisible", v);
    },
    setSelectdMsg({ state, commit, data }) {
      commit("setSelectdMsg", data);
    },
    setReplyTarget({ state, commit, target }) {
      commit("setReplyTarget", target);
    },
    setReplyMsgRef({ state, commit, ref }) {
      commit("setReplyMsgRef", ref);
    },

    setClickCoords({ state, commit, coords }) {
      commit("setClickCoords", coords);
    },
  },
  namespaced: true,
};
