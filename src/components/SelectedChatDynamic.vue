<template>
  <div class="wrp">
    <div v-observer="fetchPrev"></div>

    <div class="bottom" ref="bottom">
      <div v-observer="fetchNext"></div>
    </div>

    <!-- <chat-input :sendMsg="addNewMessage"></chat-input> -->
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import { useDark, useToggle } from "@vueuse/core";

export default {
  components: { ChatInput, MessageItem },
  props: {
    chatId: Array,
    sendMsg: Function,
    required: true,
  },

  data() {
    return {};
  },

  setup(props) {
    const db = ref(firebase.firestore());
    const bottom = ref(null);

    const subChats = ref([]);
    //middle msg item

    const disablePrevFetch = ref(null);
    const chatWasFetched = ref(null);
    // const slectedChatRef = db.collection("chatMessages");

    const first = ref(null);

    const chatId = ref(store.state.chat.chatId);

    const messagesRef = ref(
      db.value
        .collection("chatMessages")
        .doc(chatId.value)
        .collection("messages")
    );

    const queryFirst = ref(
      messagesRef.value.orderBy("createdAt", "desc").limit(40)
    );

    const queryPrev = ref(
      messagesRef.value
        .orderBy("createdAt", "desc")
        .endBefore(first.value)
        .limit(40)
    );

    watchEffect(async () => {
      //last msgs (first snapshot)
      queryFirst.value.onSnapshot((snapshot, parameters) => {
        subChats.value.push(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        first.value = subChats.value[0][0].createdAt;

        console.log(subChats.value, "FIRST QUERRY");
      });
    });

    async function fetchPrev() {
        
      const oldestMessage = subChats.value[subChats.value.length - 1];
      const snapshot = await messagesRef.value
        .orderBy("createdAt", "desc")
        .endBefore(oldestMessage.createdAt)
        .limit(40)
        .get();

      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      subChats.value = messages.concat(subChats.value);
    }

    function fetchNext() {}
    //     });

    return {
      fetchPrev,
      fetchNext,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/colors.scss";

.sm {
  height: 1000px;
}

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
  background-color: $content-main;
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

.dark .scrl-to-btm-btn {
  background-color: $content-main-l;
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
  overflow-y: auto;
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
