export const messageModule = {
  state: () => ({
    replyMsgRef: null,
    replyTarget: null,
    clickCoords: null,
    selectedMsgData: null,
    visible: false,
    querry: null,
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
    getQuerry(state) {
      return state.querry
    }
  },
  mutations: {
    setVisible(state, v) {
      state.visible = v;
    },
    setQuery(state, q) {
      state.querry = q 
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
    setQuery({state, commit, q}) {
      commit("setQuery", q);
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
