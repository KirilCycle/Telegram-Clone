import router from "@/router/router";


export const chatModule = {
  state: () => ({
     replyMsgRef: null
  }),
  getters: {
    getReplyMsgRef(state) {
    return state.replyMsgRef
    }, 
   
  },
  mutations: {
    setReplyMsgRef(state, ref) {
     state.replyMsgRef = ref
    },
   
  },

  actions: {

    setReplyMsgRef({state, commit, ref}) {
       commit('setReplyMsgRef', ref)
    },
   
  },
  namespaced: true,
};
