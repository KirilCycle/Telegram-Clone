<template>
  <div class="wrp">
    <message-item
      :removeMessage="deleteMessage"
      v-for="it in chat.messages"
      :key="it.id"
      :message="it"
      :isMy="it.userId.includes(firstPartOfmyId)"
    ></message-item>
   
  </div>
  <div class="bottom" ref="bottom">
    <div v-desapeared="disableAutoScroll"></div>
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
      firstPartOfmyId: store.state.user.user.uid.slice(0, 10),
    };
  },
  methods: {
    async deleteMessage(chatId, messageId) {
      const db = firebase.firestore();

      try {
        const chatRef = doc(db, "chatMessages", chatId);

        await updateDoc(chatRef, {
          messages: firebase.firestore.FieldValue.arrayRemove(messageId),
        });

        console.log("Message deleted successfully!");
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
  },

  setup(props) {
    const db = firebase.firestore();

    const chat = ref("");

    const bottom = ref(null);

    const slectedChatRef = db.collection("chatMessages");

    console.log(props.chatId, "TEST");

    const shasingBottom = ref(true);

    function disableAutoScroll(v) {
      shasingBottom.value = v
    //  console.log( v, 'V_DIR');
    }

    //  <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>

    watchEffect(() => {
      slectedChatRef.doc(store.state.chat.chatId).onSnapshot((doc) => {
        if (doc.exists) {
          // Do something with the document data
          chat.value = doc.data();

          console.log(chat.value, "cht but isnt list juct cht");

          if ( shasingBottom.value ) {

            bottom.value?.scrollIntoView({ behavior: "smooth", block: "end" });
          }
           
        } else {
          console.log("No such document!");
        }
      });
    });

    return {
      chat,
      bottom,
      disableAutoScroll,
    };
  },
};
</script>

<style lang="scss" scoped>
nav {
  width: 100%;
  padding: 5px;
  height: 7%;
  display: flex;
  flex-direction: row;
  background-color: #1d1e2a;
}

.observer {
  width: 100%;
  height: 50px;
  background-color: #ffffff67;
  height: 720px;
 
}

.bottom {
  background-color: rgba(255, 0, 0, 0.538);
  height: 50px;
  width: 100%;
  bottom: 0;
  position: relative;

  
   
  

  div {
    width: 100%;
    bottom: 50px;
    height: 30px;
    background-color: #ffffff32;
    position: absolute;
    z-index: 20;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.wrp {
  padding-top: 70px;
  position: relative;
}

.chat {
  width: 100%;
}
</style>
