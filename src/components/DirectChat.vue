<template>
  <div class="wrp">
    <div v-observer="fetchPrev"></div>
    <messages-skelet v-if="recentlyWasPrevAct" :number="40"></messages-skelet>
    <transition name="bounce">
      <button
        @click="scrollToBottom"
        v-if="!chasingBottom"
        class="scrl-to-btm-btn"
      >
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </button>
    </transition>

    <div v-observerdef="firstScroll" v-if="chat.length > 0"></div>
    <message-item
      :last="{ i, length: chat.length }"
      v-for="(it, i) in chat"
      :key="it.id"
      :message="it"
      :isMy="it.userId.includes(firstPartOfmyId)"
    ></message-item>

    <div
      v-if="
        $store.state.chat.chatsScrollPosition[$store.state.chat.chatId].page > 0
      "
      class="bottom"
      ref="bottom"
    >
      <div v-observer="fetchNext"></div>
    </div>

    <div v-else class="bottom" ref="bottom">
      <div v-desapeared="disableAutoScroll"></div>
    </div>
    <!-- <chat-input :sendMsg="addNewMessage"></chat-input> -->
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, computed, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./chat/chat-input-components/ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { scrollTo } from "vue-scrollto";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import MessagesSkelet from "./MessagesSkelet.vue";

export default {
  components: { ChatInput, MessageItem, MessagesSkelet },
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

  },
  mounted() {},

  setup(props) {
    const db = firebase.firestore();
    const chat = ref([]);
    const bottom = ref(null);

    const recentlyWasPrevAct = ref(null);
    //middle msg item

    const pivot = ref(null);

    const disablePrevFetch = ref(null);
    const chatWasFetched = ref(null);
    // const slectedChatRef = db.collection("chatMessages");

    const getMessagesType = ref(null);

    const chasingBottom = ref(true);

    function scrollToBottom() {
      bottom.value?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    function disableAutoScroll(v) {
      chasingBottom.value = v;
    }

    watchEffect(() => {
      let link = store.state.chat.chatsScrollPosition[store.state.chat.chatId];

      console.log("CHAT WRONG ????", store.state.chat.chatId);

      const messagesRef = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages");

        let query = null;
        if (query === null) {
          console.log("DEF");
        }

      if (link.page > 0) {
        //in case we saw a top observer
        console.log("DEF")

        switch (getMessagesType.value) {
          case "prev":
            query = messagesRef
              .orderBy("createdAt")
              .limitToLast(80)
              .endBefore(  link.pivot)
            console.log("WAS");
            break;
          case "next":
            query = messagesRef
              .orderBy("createdAt")
              .startAfter( link.pivot)
              .limit(80)
            console.log("WAS 2");
        }
      } else {
        console.log("DEF");
        query = messagesRef.orderBy("createdAt", "desc").limit(80);
      }

      //{ preserveSnapshot: true }

      query.onSnapshot({ preserveSnapshot: true },(snapshot, parameters) => {
        if (link.page > 0) {
          console.log("as aw", getMessagesType.value, link.pivot);
          let newData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

    
          chat.value = newData;

          if (getMessagesType.value === "prev") {
            setTimeout(() => {
              try {
                link.last.ref.scrollIntoView({ block: "start" });
              } catch (e) {}
            });
          }
        } else {
          console.log("DEF");

          chat.value = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .reverse();
          if (chasingBottom.value) {
            scrollToBottom();
          }
        }

        if (chat.value.length < 80) {
          disablePrevFetch.value = true;
        } else {
          disablePrevFetch.value = null;
        }
      });
    });

    function fetchPrev() {
      if (!disablePrevFetch.value) {
        let link =
          store.state.chat.chatsScrollPosition[store.state.chat.chatId];

        store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "pivot",
          data: chat.value[40].createdAt,
        });

        store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "page",
          data: link.page + 1,
        });

        store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "last",
          data: { id: chat.value[0].id },
        });

        getMessagesType.value = "prev";
      }
    }

    function fetchNext() {
      console.log("EXECUTED");
      let link = store.state.chat.chatsScrollPosition[store.state.chat.chatId];

      const middle = Math.floor(chat.value.length / 2);

      store.commit("chat/changeChatsScrollData", {
        id: store.state.chat.chatId,
        key: "pivot",
        data: chat.value[middle - 18].createdAt,
      });

      store.commit("chat/changeChatsScrollData", {
        id: store.state.chat.chatId,
        key: "page",
        data: link.page - 1,
      });

      getMessagesType.value = "next";
    }

    function firstScroll() {
      if (!chatWasFetched.value) {
        bottom.value?.scrollIntoView({ block: "end" });
        chatWasFetched.value = true;
      }
    }

    return {
      chat,
      fetchPrev,
      firstScroll,
      fetchNext,
      bottom,
      disableAutoScroll,
      chasingBottom,
      scrollToBottom,
      recentlyWasPrevAct,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/colors.scss";

.save-line {
  background-color: rgba(255, 0, 0, 0.282);
  height: 1px;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  overflow-anchor: none;
}

@media (pointer: coarse) {
  //tch sreen

  .wrp {
    overflow-anchor: none;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

.chat {
  width: 100%;
}
</style>
