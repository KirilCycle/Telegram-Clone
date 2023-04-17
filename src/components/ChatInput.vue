<template>
  <div @touchmove.prevent="() => {}" class="input-container">
    <div class="reply-border-wrap" v-if="$store.state.message.replyTarget">
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
        this.sendMsg(this.value, null, store.state.message.replyTarget);
        this.value = "";
      } else {
        this.sendMsg(text, img);
        this.value = "";
      }

      store.commit("message/setReplyMsgRef", null);
      store.commit("message/setReplyTarget", null);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.reply-border-wrap {
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 100%;
  background: $content-main;
}
.input-container {
  width: 100%;
  padding: 0px 10px 0px 6px;
  height: 100%;
  display: flex;

  background: $content-main;
  position: relative;

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
      color: $text-main;
    }

    @media (min-width: 1700px) {
      input {
        padding-left: 15px;

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
      color: $second;
      flex-shrink: 0;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */

      &:hover {
      }
    }
  }
}

.dark .input-container {
  background: $content-main-l;
  .content {
    input {
      color: $text-main-l;
    }
  }

  
}
</style>
