<template>
  <div @touchmove.prevent="() => {}" class="input-container">
    <div  v-if="$store.state.chat.replyMsgRef">
      <reply-message-border></reply-message-border>
    </div>

    <div class="content">
      <span>
        <selected-file-modal @sendmesimg="sendMsg"></selected-file-modal>

        <!-- @notready="messageisNotReady = true"
        :notready="messageisNotReady"
        @sendmesimg="sendMessage" -->
      </span>

      <input v-model="value" placeholder="Write a message..." />

      <span class="material-symbols-outlined"> keyboard_voice </span>
      <button @click="send">
        <span class="material-symbols-outlined"> send </span>
      </button>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import ReplyMessageBorder from "./ReplyMessageBorder.vue";
import SelectedFileModal from "./SelectedFileModal.vue";
export default {
  components: { SelectedFileModal, ReplyMessageBorder },
  props: {
    sendMsg: Function,
    required: true,
  },

  data() {
    return {
      value: "",
      sendMsg: this.sendMsg,
    };
  },
  methods: {
    send(text, img) {
      if (!img) {
        this.sendMsg(this.value, null, store.state.chat.replyTarget);
        this.value = "";
      } else {
        this.sendMsg(text, img);
        this.value = "";
      }

      store.commit("chat/setReplyMsgRef", null);
      store.commit("chat/setReplyTarget", null);
    },
  },
};
</script>

<style lang="scss" scoped>
$custom-c2: rgb(32, 32, 32);
.input-container {
  width: 100%;
  padding: 0px 10px 0px 6px;
  
  height: 100%;
  display: flex;

  /*
  position: relative;
*/
  justify-content: center;
  align-items: center;
  flex-direction: column;
  bottom: 0;
  align-items: center;
  box-sizing: border-box;

  span {
    font-size: 1.9rem;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    cursor: pointer;
  }

  .content {
    user-select: none; /* supported by Chrome and Opera */

    box-sizing: border-box;
    width: 100%;

    justify-content: center;
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    display: flex;
    height: 100%;

    input {
      width: 100%;
      height: 100%;
      max-height: 50px;
      font-size: 1rem;
      color: white;
    }

    @media (min-width: 1700px) {
      input {
        padding-left: 15px;
        background-color:rgb(39, 39, 39);
        border-radius: 10px;
        width: 90%;
      }
    }

    button {
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      width: 35px;
      height: 35px;
      color: rgb(68, 134, 255);
      flex-shrink: 0;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */

      &:hover {
      }
    }
  }
}
</style>
