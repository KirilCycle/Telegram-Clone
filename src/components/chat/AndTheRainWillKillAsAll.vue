<template>
  <button v-show="!atTheBottom" class="scroll-bottom"></button>
  <div class="previos-observer" v-observer="previous"></div>
  <div class="msg" v-for="msg in msgs" :key="msg.id">
    {{ msg.text }}
  </div>
  <div
    ref="scrollAtTheBottom"
    class="check-bottom-scroll"
    v-desapeared="handleScrollBtn"
  ></div>
  <div class="next" v-observer="next"></div>
</template>

<script>
import { onMounted, watchEffect } from "vue";
import { uuidv4 } from "@firebase/util";
import firebase from "firebase/compat/app";
import { ref } from "vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import store from "@/store/store";

export default {
  setup(props, { emit }) {
    const bottom = ref(null);
    const db = firebase.firestore();
    const top = ref(null);
    const gettingType = ref(null);
    const msgs = ref(null);
    const pivotMessage = ref(null);
    const limit = ref(30);
    const chatQuerry = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );
    const currentAction = ref(null);
    const unsubscribe = ref(null);
    const isBottom = ref(null);
    const scrollAtTheBottom = ref(null);
    const atTheBottom = ref(null);
    const lastChatId = ref(null);
    const invokeStartChat = ref(null);

    function handleScrollBtn(isBottom) {
      atTheBottom.value = isBottom;
    }
    // const querryToFirst = db
    //   .collection("chatMessages")
    //   .doc(store.state.chat.chatId)
    //   .collection("messages")
    //   .orderBy("createdAt", "desc")
    //   .limit(1);

    // querryToFirst.onSnapshot((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     // Access the first document
    //      lastMessageId.value = doc.id;
    //     // Do something with the first document

    //     // Unsubscribe from further updates
    //   });
    // });
    // watchEffect(() => {
    //   if (store.state.chat.chatId !== lastChatId.value) {
    //    gettingType.value = null;
    //   console.log("s");
    //     if (unsubscribe.value) {
    //      unsubscribe.value
    //     }
    //       pivotMessage.value = null;
    //       chatQuerry.value = null;
    //       msgs.value = null;

    //       lastChatId.value = store.state.chat.chatId;
    //       gettingType.value = null;
    //       invokeStartChat.value = true;
    //   }
    // });

    watchEffect(() => {
      if (store.state.chat.chatId !== lastChatId.value) {
     console.log(   'HA > ');
        emit('update',store.state.chat.chatId)
        lastChatId.value = store.state.chat.chatId
      }
    });

    watchEffect(() => {
      switch (gettingType.value) {
        case "prev":
          chatQuerry.value = messagesRef.value
            .orderBy("createdAt")
            .limitToLast(limit.value)
            .endBefore(pivotMessage.value);

          if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }

          console.log("WAS");
          break;
        case "next":
          chatQuerry.value = messagesRef.value
            .orderBy("createdAt")
            .startAfter(pivotMessage.value)
            .limit(limit.value);

          if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }
          console.log("WAS 2");
        default:
          if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }

          chatQuerry.value = messagesRef.value
            .orderBy("createdAt", "desc")
            .limit(limit.value);
      }

      function subscribeToSnapshot() {
        unsubscribe.value = chatQuerry.value.onSnapshot(
          (snapshot, parameters) => {
            if (gettingType.value === "prev" || gettingType.value === "next") {
              msgs.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log(msgs.value);
            } else {
              msgs.value = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .reverse();
              console.log(msgs.value);
            }
          }
        );
      }

      onMounted(() => {
        subscribeToSnapshot();
      });
      // Function to subscribe to the snapshot listener
      // Initial subscription
      // onMounted(() => {
      // });

      // If you need to unsubscribe
      // unsubscribe();

      // If you need to subscribe again
      // subscribeToSnapshot();
    });

    function previous() {
      gettingType.value = "prev";
      const middle = Math.floor((msgs.value.length - 1) / 2);
      pivotMessage.value = msgs.value[middle].createdAt;
      console.log(msgs.value[middle].text, "prev midle");
      console.log("GO ?", middle);
      currentAction.value = uuidv4();
    }

    function next() {
      if (msgs.value.length > 29) {
        gettingType.value = "next";
        const middle = Math.floor((msgs.value.length - 1) / 2);
        console.log(msgs.value[middle].text, "next midle");
        pivotMessage.value = msgs.value[middle].createdAt;
        console.log("GO NEXT ?", middle, msgs.value[middle].text);
        currentAction.value = uuidv4();
      } else {
        console.log("XUY TAM A NE NEXT");
      }
    }

    return {
      bottom,
      previous,
      isBottom,
      scrollAtTheBottom,
      msgs,
      next,
      handleScrollBtn,
      top,
      atTheBottom,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 300px;
  height: 300px;
  background-color: #fff;
}
.scroll-bottom {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  bottom: 100px;
  right: 5px;
}

.check-bottom-scroll {
  position: relative;
  bottom: 50px;
}

.previos-observer {
  position: relative;
  top: 730px;
}

.next {
  position: relative;
  bottom: 130px;
}

.msg + .msg {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
