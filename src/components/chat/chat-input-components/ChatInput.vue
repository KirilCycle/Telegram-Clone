<template>
  <div @touchmove.prevent="() => {}" class="input-container-main-wrap">
    <div class="content">
      <div class="reply-border-wrap" v-if="select">
        <reply-message-border :selected="select"></reply-message-border>
        <div class="send-btn-wrp-fake"></div>
      </div>

      <button class="file-select">
        <selected-file-modal></selected-file-modal>
      </button>

      <input
         @keydown.enter="send"
        :value="$store.state.chat.chatSettings[$store.state.chat.chatId].v"
        v-on:input="(e) => textHndl(e.target.value)"
        placeholder="Message"
      />
    </div>

    <div class="send-btn-wrp">
      <button class="send-btn" v-show="ableTosend" @click="send">
        <span class="material-symbols-outlined"> send </span>
      </button>

      <button v-show="!ableTosend" class="send-btn">
        <span class="material-symbols-outlined"> keyboard_voice </span>
      </button>

      <transition name="fade">
        <button
          ref="scrollBottom"
          @click="scrollToBottom"
          class="scroll-bottom"
          v-show="!$store.state.chat.scrollBottomData.isBottom"
        >
          <span class="material-symbols-outlined"> arrow_downward </span>
        </button>
      </transition>
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

import { ref } from "vue";
import { getStorage, ref as storageRef } from "firebase/storage";
import { getDatabase, ref as databaseRef, push } from "firebase/database";

export default {
  components: { SelectedFileModal, ReplyMessageBorder },
  props: {
    isFoundedUser: Boolean,
    sendMsg: Function,
    required: true,
  },

  data() {
    return {
      text: null,
    };
  },
  methods: {
    textHndl(v) {
      store.commit("chat/changeChatSettings", {
        id: store.state.chat.chatId,
        v: v,
      });
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
        this.$store.state.chat.chatSettings[this.$store.state.chat.chatId].v,
        null,
        store.state.message.replyTarget,
        this.$store.state.chat.chatId
      );
      this.$store.state.chat.chatSettings[this.$store.state.chat.chatId].v = "";

      store.commit("message/setReplyMsgRef", null);
      store.commit("message/setReplyTarget", null);
      store.commit("message/setForwardTarget", null);
    },
  },
  computed: {
    select() {
      if (this.$store.state.message.replyTarget) {
        return true;
      } else if (this.$store.state.message.forwardTarget) {
        return true;
      }
      return null;
    },

    ableTosend() {
      if (
        this.$store.state.chat.chatSettings[this.$store.state.chat.chatId].v ||
        store.state.message.forwardTarget
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  setup(props) {
    const recording = ref(null);
    const recordingUrl = ref(null);
    const scrollBottom = ref(null);

    function scrollToBottom() {
      setTimeout(() => {
        store.state.chat.scrollBottomData.bottomRef.scrollIntoView({
          block: "start",
          inline: "start",
          behavior: "smooth",
        });
      });
    }

    async function startRecording() {
      if (navigator.mediaDevices) {
        console.log("start");
        // recording.value = new MediaRecorder(
        //   navigator.mediaDevices.getUserMedia({ audio: true })
        // );
        // recording.value.start();

        const constraints = { audio: true };
        let chunks = [];

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log("recorder started");

          setTimeout(async () => {
            mediaRecorder.stop();
            console.log(mediaRecorder.state, "S");

            const storageRef = ref(
              storage,
              "recordings/" + Date.now() + ".webm"
            );
            console.log(blob, "AAAUDIO");

            chunks = [];
            const audioURL = URL.createObjectURL(blob);

            const snapshot = await storageRef.put(blob);

            console.log("recorder stopped", audioURL);

            mediaRecorder.ondataavailable = (e) => {
              chunks.push(e.data);
            };
          }, 3000);
        });
      }
    }

    async function sendRecording() {
      console.log("end");
      // recording.value.stop();
      // recording.value.ondataavailable = (event) => {
      //   const blob = event.data;
      //   const storage = getStorage();
      //   const storageRef = ref(storage, "recordings/" + Date.now() + ".webm");
      //   storageRef.put(blob).then((snapshot) => {
      //     recordingUrl.value = snapshot.ref.getDownloadURL();
      //   });
      // };
    }




    return {
      startRecording,
      scrollToBottom,
      sendRecording,
      scrollBottom,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

%btn-pattern {
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 27.5px;
}

%main-wrap-pattern {
  width: 70%;
}
.send-btn-wrp-fake {
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 27.5px;
  right: -59px;
}

.send-btn-wrp {
  @extend %btn-pattern;
  right: -59px;
  color: white;

  .scroll-bottom {
    @extend %btn-pattern;
    bottom: 75px;
    color: $second;
    background-color: $content-main-dark;

    &:hover {
      background-color: $hover;
    }
  }

  .send-btn {
    @extend %btn-pattern;
    background-color: $second;
    &:hover {
      background-color: $main;
    }

    span {
      font-size: 2rem;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}

.dark .scroll-bottom {
  background-color: $content-main-l;
  &:hover {
    background-color: $content-main-l;
    color: $main;
  }
}
.c {
  padding: 0px 10px 0px 6px;
  padding: 0px 10px 0px 6px;
}

.reply-border-wrap {
  width: 100%;
  height: 55px;
  position: absolute;
  box-sizing: border-box;
  bottom: 100%;
  display: flex;
  flex-direction: row;
}

.input-container-main-wrap {
  @extend %main-wrap-pattern;
  max-width: 1100px;
  position: relative;
  margin: 0% auto;
  height: 55px;
  display: flex;
  flex-direction: row;
  max-height: 60px;
  justify-content: center;
  bottom: 0;
  align-items: center;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  z-index: 5;

  span {
    font-size: 1.9rem;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    cursor: pointer;
  }

  .content {
    user-select: none; /* supported by Chrome and Opera */
    width: 100%;
    background-color: $content-main-dark;
    border-radius: 20px 20px 0px 20px;
    justify-content: center;
    position: relative;
    align-items: center;
    flex-direction: row;
    display: flex;
    height: 100%;

    &:after {
      content: "";
      display: inline;
      position: absolute;
      right: -15px;
      bottom: 0px;
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-left: 16px solid $content-main-dark;
      border-bottom: 0px solid transparent;
    }

    .file-select {
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      height: 35px;
      width: 35px;
      flex-shrink: 0;
      user-select: none; /* Standard syntax */
      border-radius: inherit;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      margin-left: 10px;
    }

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
        width: 100%;
      }
    }
  }
}

.dark .input-container-main-wrap {
  .content {
    background-color: $content-main-l;

    &:after {
      border-left: 18px solid $content-main-l;
    }
    input {
      color: $text-main-l;
    }
  }
}

@media (max-width: 1270px) {
  %main-wrap-pattern {
    width: 90%;
  }

  %btn-pattern {
    position: static;
  }
  .send-btn-wrp {
    margin-left: 10px;
    .scroll-bottom {
      position: absolute;
    }
  }
}

@media (max-width: 500px) {
  %main-wrap-pattern {
    width: 100%;
  }

  .input-container-main-wrap {
    height: 48px;
  }

  %btn-pattern {
    height: 48px;
    width: 48px;
  }
}
</style>
