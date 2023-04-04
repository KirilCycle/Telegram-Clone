<template>
  <div class="wrp">
    <transition name="bounce">
      <button @click="scrollToBottom" v-if="!chasingBottom" class="scrl-to-btm-btn">
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </button>
    </transition>
    <message-item
      :removeMessage="deleteMessage"
      v-for="(it, index) in chat.messages"
      :key="it.id"
      :message="it"
      :next="chat.messages[index + 1]"
      :isMy="it.userId.includes(firstPartOfmyId)"
    ></message-item>
    <div class="bottom" ref="bottom">
      <div v-desapeared="disableAutoScroll"></div>
    </div>
    <chat-input :sendMsg="addNewMessage"></chat-input>
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
import { onMounted } from "vue";

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

    const chasingBottom = ref(true);

    function disableAutoScroll(v) {
      chasingBottom.value = v;
      //  console.log( v, 'V_DIR');
    }

    function scrollToBottom() {
      bottom.value?.scrollIntoView({ behavior: "smooth", block: "end" })
    }

    //  <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>

    watchEffect(() => {
      slectedChatRef.doc(store.state.chat.chatId).onSnapshot((doc) => {
        if (doc.exists) {
          // Do something with the document data
          chat.value = doc.data();

          console.log(chat.value, "cht but isnt list juct cht");

          if (chasingBottom.value) {
            scrollToBottom()
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
      chasingBottom,
      scrollToBottom,
    };
  },
};
</script>
<style lang="scss" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}


.scrl-to-btm-btn {
  &:hover {
    background-color: #313131;
  }
  width: 45px;
  height: 45px;
  background-color: rgb(28, 28, 28);
  border-radius: 22.5px;
  position: fixed;
  bottom: 100px;
  z-index: 30;
  display: block;
  right: 5px;
  color: rgb(68, 134, 255);
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 2rem;
  }
}

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
  height: 720px;
}

.bottom {
  height: 50px;
  width: 100%;
  bottom: 0;
  position: relative;

  div {
    width: 100%;
    bottom: 50px;
    height: 30px;

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
  overflow-x: hidden;
}

.chat {
  width: 100%;
}
</style>
