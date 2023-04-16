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

    <div v-observerdef="firstScroll" v-if="chat.length > 0"></div>
    <message-item
      :removeMessage="deleteMessage"
      v-for="it in chat"
      :key="it.id"
      :message="it"
      :isMy="it.userId.includes(firstPartOfmyId)"
    ></message-item>

    <div v-if="page > 0" class="bottom" ref="bottom">
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
import { ref, watchEffect } from "vue";
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

    //middle msg item

    let page = ref(
      store.state.chat.chatsScrollPosition[store.state.chat.chatId].page
    );
    const pivot = ref(
      store.state.chat.chatsScrollPosition[store.state.chat.chatId].pivot
    );

    const disablePrevFetch = ref(null);
    const chatWasFetched = ref(null);
    // const slectedChatRef = db.collection("chatMessages");

    const getMessagesType = ref("prev");

    const chasingBottom = ref(true);
    function scrollToBottom() {
      bottom.value?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    function disableAutoScroll(v) {
      chasingBottom.value = v;
      console.log("scroll d");
    }

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
        console.log(getMessagesType.value, pivot.value, "DIRECTION");
        switch (getMessagesType.value) {
          case "prev":
            console.log("prev case", pivot.value);

            query = messagesRef
              .orderBy("createdAt")
              .limitToLast(40)
              .endBefore(pivot.value.createdAt);

            break;

          case "next":
            console.log("NEXT CASE", pivot.value);

            query = messagesRef
              .orderBy("createdAt")
              .startAfter(pivot.value.createdAt)
              .limit(40);
        }

        // query = messagesRef
        //   .orderBy("createdAt")
        //   .limitToLast(40)
        //   .endBefore(firts.value.createdAt);

        // let next = messagesRef
        //   .orderBy("createdAt")
        //   .startAfter(firts.value.createdAt)
        //   .limit(40)
      } else {
        console.log("b");

        query = messagesRef.orderBy("createdAt", "desc").limit(40);
        // query = messagesRef.orderBy("createdAt", "desc").limit(10)
      }

      query.onSnapshot((snapshot, parameters) => {
        if (page.value > 0) {
          console.log("page.vale > 0");

          let newData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log(newData, "PORCIYA");
          chat.value = newData;
        } else {
          console.log("page.vale > 0 else ");
          chat.value = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .reverse();
          if (chasingBottom.value) {
            scrollToBottom();
          }
        }

        if (chat.value.length < 40) {
          disablePrevFetch.value = true;
        } else {
          disablePrevFetch.value = null;
        }
      });
    });

    function fetchPrev() {
      if (!disablePrevFetch.value) {
        
        let link = store.state.chat.chatsScrollPosition[store.state.chat.chatId]
       
        store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "pivot",
          data: chat.value[19],
        });

        store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "page",
          data: link.page + 1,
        });

        getMessagesType.value = "prev";

       

         page.value = link.page

         pivot.value = link.pivot

    

        console.log(page.value);
      }
    }

    function fetchNext() {
     
      getMessagesType.value = "next";

      let link = store.state.chat.chatsScrollPosition[store.state.chat.chatId]

      store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "pivot",
          data: chat.value[19],
        });

        store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "page",
          data: link.page - 1,
        });

      

       

         page.value = link.page

         pivot.value = link.pivot

    

        console.log(page.value);



   
    }

    function firstScroll() {
      if (!chatWasFetched.value) {
        bottom.value?.scrollIntoView({ block: "end" });
        console.log("firts scroll");
        chatWasFetched.value = true;
      }
    }

    const isDark = useDark();
    const toggleDark = useToggle();

    return {
      chat,
      toggleDark,
      fetchPrev,
      firstScroll,
      fetchNext,
      page,
      bottom,
      disableAutoScroll,
      chasingBottom,
      scrollToBottom,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/colors.scss";
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
