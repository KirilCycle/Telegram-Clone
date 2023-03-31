<template>
  <message-item v-for="it in chat.messages" :key="it.uid"></message-item>
  <div class="chat" v-for="it in chat.messages" :key="it.uid">
    {{ it.text }}
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";

export default {
  components: { ChatInput, MessageItem },
  props: {
    chatId: Array,
    sendMsg: Function,
    required: true,
  },

  data() {
    return {
      sendMsg: this.sendMsg,
    };
  },

  setup(props) {
    const db = firebase.firestore();

    const chat = ref("");

    const slectedChatRef = db.collection("chats");

    console.log(props.chatId, "TEST");

    //  <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>

    watchEffect(() => {
      slectedChatRef.doc(store.state.chat.chatId).onSnapshot((doc) => {
        if (doc.exists) {
          // Do something with the document data
          chat.value = doc.data();

          console.log(chat.value, "cht but isnt list juct cht");
        } else {
          console.log("No such document!");
        }
      });
    });

    return {
      chat,
    };
  },
};
</script>

<style lang="scss" scoped>
nav {
  width: 100%;
  padding: 5px;
  height: 5%;
  display: flex;
  flex-direction: row;
  background-color: #1d1e2a;
}

.chat {
  width: 100%;
}
</style>
