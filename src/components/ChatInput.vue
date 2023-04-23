<template>
  <div @touchmove.prevent="() => {}" class="input-container">
    <div class="reply-border-wrap" v-if="select">
      <reply-message-border :selected="select"></reply-message-border>
    </div>

    <div class="content">
      <span>
        <selected-file-modal  @sendMsgWithFile="sendMsg"></selected-file-modal>

        <!-- @notready="messageisNotReady = true"
        :notready="messageisNotReady"
        @sendmesimg="sendMessage" -->
      </span>

      <input
        :value="
          $store.state.chat.chatsScrollPosition[$store.state.chat.chatId].v
        "
        v-on:input="(e) => textHndl(e.target.value)"
        placeholder="Write a message..."
      />

      <div class="send-btn-wrp">
        <transition name="bounce">
          <button class="send-btn" v-show="ableTosend" @click="send">
            <span class="material-symbols-outlined"> send </span>
          </button>
        </transition>

        <transition name="fade">
          <button>
            <span v-show="!ableTosend" class="material-symbols-outlined">
              keyboard_voice
            </span>
          </button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import ReplyMessageBorder from "./ReplyMessageBorder.vue";
import SelectedFileModal from "./SelectedFileModal.vue";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { updateDoc } from "@firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";

export default {
  components: { SelectedFileModal, ReplyMessageBorder },
  props: {
    sendMsg: Function,
    required: true,
  },

  data() {
    return {
      sendMsg: this.sendMsg,
      text: null,
    };
  },
  methods: {
    textHndl(v) {
      store.commit("chat/changeChatsScrollData", {
        id: store.state.chat.chatId,
        key: "v",
        data: v,
      });

      console.log("HANDLE TEXT", v);
    },

    async send() {
      if (store.state.message.forwardTarget) {
        const data = store.state.message.forwardTarget;

        const text = data.text;

        const db = firebase.firestore();

        const auth = getAuth();

        const message = {
          userName: this.$store.state.user.user.username,
          userId: auth.currentUser.uid,
          text,
          createdAt: Timestamp.now(),
          sender: data.sender,
        };

        message.userPhotoURl = this.$store.state.user.user.photoURL;

        if (data.source) {
          //   messageisNotReady.value = true;
          message.source = data.source;
        }

        const chatRefMsg = db
          .collection("chatMessages")
          .doc(store.state.chat.chatId)
          .collection("messages");

        console.log(chatRefMsg, "AS SEND");

        chatRefMsg.add(message).then((res) => console.log("res", res));

        const user1usersChatRef = doc(
          db,
          "usersLinksToChat",
          auth.currentUser.uid
        );
        const user2usersChatRef = doc(
          db,
          "usersLinksToChat",
          store.state.chat.chatId.replace(auth.currentUser.uid, "")
        );

        const lastMsgData = {
          text,
          createdAt: message.createdAt,
          from: message.userName,
        };

        await updateDoc(user1usersChatRef, {
          [store.state.chat.chatId]: {
            lastMsg: lastMsgData,
            id: store.state.chat.chatId,
          },
        });

        await updateDoc(user2usersChatRef, {
          [store.state.chat.chatId]: {
            lastMsg: lastMsgData,
            id: store.state.chat.chatId,
          },
        });
      }

      this.sendMsg(
        this.$store.state.chat.chatsScrollPosition[
          this.$store.state.chat.chatId
        ].v,
        null,
        store.state.message.replyTarget
      );
      this.$store.state.chat.chatsScrollPosition[
        this.$store.state.chat.chatId
      ].v = "";

      store.commit("message/setReplyMsgRef", null);
      store.commit("message/setReplyTarget", null);
      store.commit("message/setForwardTarget", null);
    },
  },
  computed: {
    select() {
      if (this.$store.state.message.replyTarget) {
        return true
      } else if (this.$store.state.message.forwardTarget) {
        return true;
      }
      return null;
    },

    ableTosend() {
      if (
        this.$store.state.chat.chatsScrollPosition[
          this.$store.state.chat.chatId
        ].v ||
        store.state.message.forwardTarget
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.1s;
}
.bounce-leave-active {
  animation: bounce-in 0.1s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.send-btn-wrp {
  position: relative;
  width: 50px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;

  .send-btn {
    width: 100%;
    height: 100%;

    span {
      color: $second;

      &:hover {
        color: $main;
      }
    }
  }

  button {
    position: absolute;
  }
  span {
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    width: 35px;
    height: 35px;
    color: gray;
    flex-shrink: 0;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

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
  max-height: 60px;
  &:after {
    content: "";
    display: none;
    position: absolute;
    right: -20px;
    bottom: 0px;
    width: 0;
    height: 0;

    border-top: 40px solid transparent;
    border-left: 20px solid $content-main;
    border-bottom: 0px solid transparent;
  }

  @media (min-width: 1800px) {
    &:after {
      display: block;
    }
    border-radius: 20px 20px 0px 20px;
    padding: 14px 10px 14px 20px;
  }

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
