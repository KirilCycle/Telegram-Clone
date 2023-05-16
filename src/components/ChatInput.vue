<template>
  <div @touchmove.prevent="() => {}" class="input-container">
    <div class="reply-border-wrap" v-if="select">
      <reply-message-border :selected="select"></reply-message-border>
    </div>

    <div class="content">
      <span>
        <selected-file-modal @sendMsgWithFile="sendMsg"></selected-file-modal>
      </span>

      <input
        :value="
          $store.state.chat.chatSettings[$store.state.chat.chatId].v
        "
        v-on:input="(e) => textHndl(e.target.value)"
        placeholder="Write a message..."
      />

      <div class="send-btn-wrp">
        <transition>
          <button class="send-btn" v-show="ableTosend" @click="send">
            <span class="material-symbols-outlined"> send </span>
          </button>
        </transition>

        <transition>
          <button @mousedown="startRecording" @mouseup="sendRecording">
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

import { ref } from "vue";
import { getStorage, ref as storageRef } from "firebase/storage";
import { getDatabase, ref as databaseRef, push } from "firebase/database";

export default {
  components: { SelectedFileModal, ReplyMessageBorder },
  props: {
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
        v:v
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
        this.$store.state.chat.chatSettings[
          this.$store.state.chat.chatId
        ].v,
        null,
        store.state.message.replyTarget
      );
      this.$store.state.chat.chatSettings[
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
        return true;
      } else if (this.$store.state.message.forwardTarget) {
        return true;
      }
      return null;
    },

    ableTosend() {
      if (
        this.$store.state.chat.chatSettings[
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
  setup(props) {
    const recording = ref(null);
    const recordingUrl = ref(null);

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

            
            const storageRef = ref(storage, 'recordings/' + Date.now() + '.webm');
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
      sendRecording,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

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
      width: 90%;
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
