<template>
  <div class="wrp">
    <div v-observer="fetchPrev"></div>
    <transition name="bounce">
      <button
        @click="scrollToBottom"
        v-if="!chasingBottom"
        class="scrl-to-btm-btn"
      >
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </button>
    </transition>
    <message-item
      :removeMessage="deleteMessage"
      v-for="it in chat"
      :key="it.id"
      :message="it"
      :isMy="it.userId.includes(firstPartOfmyId)"
    ></message-item>

    <div class="bottom" ref="bottom">
      <div v-desapeared="disableAutoScroll"></div>
    </div>
    <!-- <chat-input :sendMsg="addNewMessage"></chat-input> -->
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
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { onMounted } from "vue";
import { limitToFirst, limitToLast } from "firebase/database";

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

    const chat = ref([]);

    const bottom = ref(null);

    // const slectedChatRef = db.collection("chatMessages");

    console.log(props.chatId, "TEST");

    const chasingBottom = ref(true);

    function disableAutoScroll(v) {
      chasingBottom.value = v;
      //  console.log( v, 'V_DIR');
    }

    function scrollToBottom() {
      bottom.value?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    let page = ref(0);

    const lastVisible = ref(null);
    const firts = ref(null);

    //  <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>

    watchEffect(() => {
      const messagesRef = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages");

      let query = null;

      // const db = firebase.firestore();
      // const lastVisible = chat.value[chat.value.length - 1];
      // const firts = chat.value[0];

      if (page.value > 0) {
        //in case we saw a top observer
        console.log("a");
        // const lastVisible = chat.value[chat.value.length - 1];
        // const firts = chat.value[0];
        // query = messagesRef.orderBy("createdAt", "desc").limit(10)

        console.log('prepare');

      
          query =  messagesRef.orderBy("createdAt")
          .limitToLast(40)
          .endBefore(firts.value.createdAt)
       

      } else {
        console.log("b");

       
        query = messagesRef.orderBy("createdAt","desc").limit(40);
        // query = messagesRef.orderBy("createdAt", "desc").limit(10)
      }

    

      query.onSnapshot((snapshot, parameters) => {
        
        if (page.value > 0) {
          chat.value = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            
        }
          
          else {
            chat.value = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .reverse() 
          }


        if (chasingBottom.value) {
          scrollToBottom();
        } else {
          console.log("No such document!");
        }
        console.log(chat.value, "docs");
      });
    });

    function fetchPrev() {
      console.log("more");
     

      //  lastVisible.value = chat.value[chat.value.length - 1];
       
      firts.value = chat.value[19] 

      page.value += 1;

      console.log(page.value);
      // Construct a new query starting at this document,
      // get the next 25 cities.

      // const messagesRef = db
      //   .collection("chatMessages")
      //   .doc(store.state.chat.chatId)
      //   .collection("messages");

      // let query = messagesRef
      //   .orderBy("createdAt")
      //   .limitToLast(3)
      //   .endBefore(firts.createdAt)

      // query.onSnapshot((snapshot, parameters) => {
      //   let test = snapshot.docs.reverse()
      //   .map((doc) => ( chat.value.unshift({ id: doc.id, ...doc.data() })) )

      //   console.log(test, "TEST");
      // });
    }

    return {
      chat,
      fetchPrev,
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
  bottom: 20%;
  cursor: pointer;
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

.bottom {
  height: 49px;
  width: 100%;
  bottom: 0;
  position: relative;
  z-index: -1;

  div {
    width: 100%;
    bottom: 50px;
    height: 50px;

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
  padding-top: 30px;
  position: relative;
  overflow-x: hidden;
}

@media (pointer: coarse) {
  //tch sreen

  .wrp {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

.chat {
  width: 100%;
}
</style>
